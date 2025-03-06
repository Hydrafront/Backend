import { Router, Response } from "express";
import { validationResult } from "express-validator";
import HttpStatusCodes from "http-status-codes";

import Request from "../../types/Request";
import Token from "../../models/Token";
import Transaction from "../../models/Transaction";
const router: Router = Router();

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

    const newToken = await Token.create(tokenFields);
    res.json({ token: newToken });
  } catch (err) {
    console.error(err.message);
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
  }
});

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

// @route   GET api/token/get-all
// @desc    Get all tokens
// @access  Public
router.get("/get-all", async (req: Request, res: Response) => {
  try {
    const tokens = await Token.find();
    res.json(tokens);
  } catch (err) {
    console.error(err.message);
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
  }
});

// @route   GET api/token/get-transaction-by-address/:tokenAddress
// @desc    Get transactions by token address
// @access  Public
router.get(
  "/get-transactions-by-address/:tokenAddress",
  async (req: Request, res: Response) => {
    try {
      const transactions = await Transaction.find({
        tokenAddress: req.params.tokenAddress,
      });
      res.json(transactions);
    } catch (err) {
      console.error(err.message);
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
    }
  }
);

// @route   POST api/token/save-transaction
// @desc    Save transaction
// @access  Public
router.post("/save-transaction", async (req: Request, res: Response) => {
  try {
    const { transaction } = req.body;
    const txFields = {
      ...transaction,
    };
    const newTransaction = await Transaction.create(txFields);
    res.json(newTransaction);
  } catch (err) {
    console.error(err.message);
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
  }
});

export default router;
