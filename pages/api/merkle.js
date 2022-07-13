const { MerkleTree } = require("merkletreejs");
const keccak256 = require("keccak256");
import { allowlist } from "../../utils/allowlist";

const leafNodes = allowlist.map(addr => keccak256(addr.address, addr.amount));
const tree = new MerkleTree(leafNodes, keccak256, {sortPairs: true});

export default function handler(req, res) {
    const body = JSON.parse(req.body);
    const addressToCheck = body.address;
    try {
        const user = allowlist.find(element => element.address = addressToCheck);
        let leaf = keccak256(user.address, user.amount);
        let root = tree.getRoot().toString("hex");
        let proof = tree.getProof(leaf);
        let hexProof = tree.getHexProof(leaf);
        let isValid = tree.verify(proof, leaf, root);
        if (!isValid) {
            throw "Invalid Address";
        }
        res.status(200).json({proof, hexProof, isValid, user});
    } catch (error) {
        res.status(500).json({error});
    }
}