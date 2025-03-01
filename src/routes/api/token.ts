import { Router, Response } from "express";
import { validationResult } from "express-validator";
import HttpStatusCodes from "http-status-codes";

import Request from "../../types/Request";
import Token from "../../models/Token";

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
    console.log(tokenFields);

    const newToken = await Token.create(tokenFields);
    console.log("success created token");
    res.json({ token: newToken });
  } catch (err) {
    console.error(err.message);
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
  }
});


router.get("/get-by-address/:tokenAddress", async (req: Request, res: Response) => {
  const token = await Token.findOne({ tokenAddress: req.params.tokenAddress });
  if (!token) {
    return res.status(HttpStatusCodes.NOT_FOUND).json({
      errors: [{ msg: "Token not found" }],
    });
  }
  res.json(token);
});
router.get("/get-all", async (req: Request, res: Response) => {
  const tokens = await Token.find();
  res.json(tokens);
});

export default router;
