contractAbi = [
  "event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)",
  "event newFarm(address farmAddress)",
  "event newForeman(address farmAddress, address foreman)",
  "event workerCheckedIn(address foreman, address worker, string date)",
  "event workerPaid(address farm, address worker, uint256 amount)",
  "function checkIn(address _workerAddress, string _date)",
  "function createFarm(address _farmAddress)",
  "function createForeman(address _foremanAddress)",
  "function getDaysCheckedIn(address _workerAddress) view returns (string[])",
  "function isAddressFarm(address _maybeFarm) view returns (bool)",
  "function isAddressForeman(address _maybeForeman) view returns (bool)",
  "function owner() view returns (address)",
  "function payWorker(address _worker) payable",
  "function renounceOwnership()",
  "function transferOwnership(address newOwner)",
];

contractAddress = "0x84FFF7812BFE6a652644Ef6E05B6C8D4359e8AeC"; //"0x0fe2988Ef1d153a5fc1EC251EB46e9dF4E6947f0"

url = "https://eth-rinkeby.alchemyapi.io/v2/CSeNZPINOezoRZ0O-BzMthJzvOYD5ZUO";
