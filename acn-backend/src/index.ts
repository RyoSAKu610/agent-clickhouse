import express from 'express';
import cors from 'cors';
import { Connection, PublicKey, Transaction, SystemProgram } from '@solana/web3.js';
import { createPostResponse, createActionHeaders } from '@solana/actions';

const app = express();
app.use(express.json());
// Apply CORS for all routes (important for blinks)
app.use(cors({ origin: '*', methods: ['GET', 'POST', 'OPTIONS'], allowedHeaders: ['Content-Type', 'Authorization', 'Accept-Encoding'] }));

const PORT = process.env.PORT || 8080;

app.get('/actions.json', (req, res) => {
  const payload = {
    rules: [
      {
        pathPattern: "/*",
        apiPath: "/api/actions/*",
      },
      {
        pathPattern: "/api/actions/**",
        apiPath: "/api/actions/**",
      },
    ],
  };
  res.json(payload);
});

// Action metadata endpoint
app.get('/api/actions/pay-agent', (req, res) => {
  const payload = {
    title: "Hire AI Agent",
    icon: "https://solana.com/src/img/branding/solanaLogoMark.png",
    description: "Pay 0.01 SOL to hire the AI agent for a task on Agent Arcade.",
    label: "Hire Agent",
  };

  res.set(createActionHeaders());
  res.json(payload);
});

// Action transaction endpoint
app.post('/api/actions/pay-agent', async (req, res) => {
  try {
    const { account } = req.body;
    if (!account) {
      res.status(400).json({ error: 'Missing account' });
      return;
    }

    const userPubkey = new PublicKey(account);
    const connection = new Connection("https://api.devnet.solana.com", "confirmed");

    const transaction = new Transaction();

    // We can use a randomized or mock recipient address for this sandbox.
    const recipient = new PublicKey("11111111111111111111111111111111"); // Burn address or just random

    // Transfer 0.01 SOL
    transaction.add(
      SystemProgram.transfer({
        fromPubkey: userPubkey,
        toPubkey: recipient,
        lamports: 0.01 * 1e9,
      })
    );

    // Also add a Memo instruction for reputation/logs.
    transaction.add(
      new Transaction({
         feePayer: userPubkey,
      }).add({
        keys: [{ pubkey: userPubkey, isSigner: true, isWritable: true }],
        data: Buffer.from("Agent Arcade: task=hire_agent, amount=0.01, status=success", "utf-8"),
        programId: new PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr"),
      })
    )

    // Set a recent blockhash
    const { blockhash } = await connection.getLatestBlockhash('confirmed');
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = userPubkey;

    const transactionBuffer = transaction.serialize({ requireAllSignatures: false });
    const payload = {
      transaction: transactionBuffer.toString('base64'),
      message: "Successfully paid for agent services. Task is starting.",
    };

    res.set(createActionHeaders());
    res.json(payload);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An unknown error occurred' });
  }
});

// OPTIONS endpoints to handle CORS preflight requests for blinks
app.options('/api/actions/pay-agent', (req, res) => {
  res.set(createActionHeaders());
  res.status(200).end();
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
