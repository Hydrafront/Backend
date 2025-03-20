import { Router, Response } from "express";
import { validationResult } from "express-validator";
import HttpStatusCodes from "http-status-codes";

import Request from "../../types/Request";
import Token from "../../models/Token";
import Transaction from "../../models/Transaction";
const router: Router = Router();

// @route   GET api/token/get-by-address/:tokenAddress
// @desc    Get token by address
// @access  Public
router.get(
  "/get-by-address/:tokenAddress",
  async (req: Request, res: Response) => {
    try {
      const token = await Token.findOne({
        tokenAddress: req.params.tokenAddress,
      });
      if (!token) {
        return res.status(HttpStatusCodes.NOT_FOUND).json({
          errors: [{ msg: "Token not found" }],
        });
      }
      res.json(token);
    } catch (err) {
      console.error(err.message);
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
    }
  }
);
// @route   GET api/token/get-transaction-by-address/:tokenAddress
// @desc    Get transactions by token address
// @access  Public
router.get(
  "/get-transactions-by-address/:tokenAddress",
  async (req: Request, res: Response) => {
    try {
      const transactions = await Transaction.find({
        tokenAddress: req.params.tokenAddress,
      }).sort({ createdAt: 1 });
      res.json(transactions);
    } catch (err) {
      console.error(err.message);
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
    }
  }
);

router.get(
  "/get-transactions-in-range/:tokenAddress/:from/:to",
  async (req: Request, res: Response) => {
    try {
      const { tokenAddress, from, to } = req.params;
      const allTokens = await Transaction.find({ tokenAddress }).sort({
        createdAt: 1,
      });
      const oldestToken = allTokens[0];
      const transactions = await Transaction.find({
        tokenAddress,
        // createdAt: {
        //   $gte: new Date(Number(from) * 1000),
        //   $lte: new Date(Number(to) * 1000),
        // },
      }).sort({ createdAt: 1 });
      res.json({
        data: transactions,
        noData: oldestToken
          ? new Date(oldestToken.createdAt) > new Date(Number(to) * 1000)
          : true,
      });
    } catch (err) {
      console.error(err.message);
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
    }
  }
);
// @route   POST api/token
// @desc    Register presale token info
// @access  Public
router.post("/create", async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(HttpStatusCodes.BAD_REQUEST)
      .json({ errors: errors.array() });
  }

  try {
    const { tokenAddress } = req.body;
    let token = await Token.findOne({ tokenAddress });
    // if (token) {
    //   return res.status(HttpStatusCodes.BAD_REQUEST).json({
    //     errors: [{ msg: "Presale token already exists" }],
    //   });
    // }

    const tokenFields = {
      tokenAddress,
      ...req.body.info,
    };

    console.log(tokenFields.logo);
    const newToken = await Token.create({
      ...tokenFields,
      logo: tokenFields.logo || "/assets/images/default/default-logo.png",
      banner: tokenFields.banner || "/assets/images/default/default-banner.png",
    });
    res.json({ token: newToken });
  } catch (err) {
    console.error(err.message);
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
  }
});

// @route   GET api/token/get-all
// @desc    Get all tokens
// @access  Public
router.post("/get", async (req: Request, res: Response) => {
  const {
    chainId,
    sort,
    dex,
    age,
    minProgress,
    maxProgress,
    boosted,
    ads,
    search,
    page,
  } = req.body;

  const query: any = {};

  if (chainId) query.chainId = chainId;
  if (dex) query.dex = dex;
  if (age) {
    if (age[0] === "≤")
      query.createdAt = {
        $lte: new Date(
          Date.now() -
            Number(age.slice(1, age.length - 1)) * 24 * 60 * 60 * 1000
        ),
      };
    if (age[0] === "≥")
      query.createdAt = {
        $gte: new Date(
          Date.now() -
            Number(age.slice(1, age.length - 1)) * 24 * 60 * 60 * 1000
        ),
      };
  }
  if (minProgress && !minProgress)
    query.progress = {
      $gte: Number(minProgress.slice(0, minProgress.length - 1)),
    };
  if (maxProgress && !maxProgress)
    query.progress = {
      $lte: Number(maxProgress.slice(0, maxProgress.length - 1)),
    };
  if (minProgress && maxProgress)
    query.progress = {
      $gte: Number(minProgress.slice(0, minProgress.length - 1)),
      $lte: Number(maxProgress.slice(0, maxProgress.length - 1)),
    };
  if (boosted) query.boost = { $gt: 0 };
  // if (ads) query.ads = ads;
  if (search)
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { symbol: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
      { tokenAddress: { $regex: search, $options: "i" } },
    ];
  const limit = 5;

  try {
    const tokenCount = await Token.countDocuments({ ...query }).sort({
      [sort]: -1,
    });
    const tokens = await Token.find({ ...query })
      .sort({ [sort]: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
    res.json({ tokens, tokenCount });
  } catch (err) {
    console.error(err.message);
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
  }
});

// @route   POST api/token/save-transaction
// @desc    Save transaction
// @access  Public
router.post("/save-transaction", async (req: Request, res: Response) => {
  try {
    const { transaction } = req.body;
    const txFields = {
      ...transaction,
    };
    await Token.findOneAndUpdate(
      { tokenAddress: transaction.tokenAddress },
      { $inc: { transactionCount: 1, volume: transaction.usd } },
      { new: true }
    );
    const newTransaction = await Transaction.create(txFields);
    res.json(newTransaction);
  } catch (err) {
    console.error(err.message);
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
  }
});

// @route   PUT api/token/update-boosted
// @desc    Update boosted
// @access  Public
router.put("/update-boosted", async (req: Request, res: Response) => {
  try {
    const { tokenAddress, boost } = req.body;
    const token = await Token.findOneAndUpdate(
      { tokenAddress },
      { $inc: { boost } }
    );
    res.json({ msg: "Token boosted updated", boost: token.boost });
  } catch (err) {
    console.error(err.message);
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
  }
});

export default router;
