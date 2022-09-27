export const contractAbi = [
  { inputs: [], name: "AddressNotFarm", type: "error" },
  { inputs: [], name: "AddressNotForeman", type: "error" },
  { inputs: [], name: "PaymentFailed", type: "error" },
  { inputs: [], name: "SendBackFailed", type: "error" },
  { inputs: [], name: "WorkersAmountsMismatch", type: "error" },
  { inputs: [], name: "WrongPaymentAmount", type: "error" },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "farmAddress",
        type: "address",
      },
    ],
    name: "newFarm",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "farmAddress",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "foreman",
        type: "address",
      },
    ],
    name: "newForeman",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "foreman",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "worker",
        type: "address",
      },
      { indexed: false, internalType: "string", name: "date", type: "string" },
    ],
    name: "workerCheckedIn",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "farm",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "worker",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      { indexed: false, internalType: "string", name: "date", type: "string" },
    ],
    name: "workerPaid",
    type: "event",
  },
  {
    inputs: [
      { internalType: "address[]", name: "_workers", type: "address[]" },
      { internalType: "string", name: "_date", type: "string" },
    ],
    name: "checkIn",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "_farmAddress", type: "address" },
    ],
    name: "createFarm",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "_foremanAddress", type: "address" },
    ],
    name: "createForeman",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "isFarm",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "isForeman",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address[]", name: "_workers", type: "address[]" },
      { internalType: "uint256[]", name: "_amounts", type: "uint256[]" },
      { internalType: "string", name: "_date", type: "string" },
    ],
    name: "payWorkers",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

export const contractAddress = "0x9EbbB0D9c378bf5E6B9c334a5948De49EE4F61Af";

export const providerUrl =
  "https://eth-rinkeby.alchemyapi.io/v2/CSeNZPINOezoRZ0O-BzMthJzvOYD5ZUO";
