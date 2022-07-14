const { MerkleTree } = require("merkletreejs");
const keccak256 = require("keccak256");
import { allowlist } from "../../utils/allowlist";
import { ShardedMerkleTree } from "../../utils/shardedMerkleTree";
import path from 'path';
import { promises as fs } from 'fs';

const dir = path.join(process.cwd(), '/json/airdrops/polygon');
const tree = ShardedMerkleTree.fromFiles(`${dir}`);

export default function handler(req, res) {
    const body = JSON.parse(req.body);
    const addressToCheck = body.address;
    const user = allowlist.find(entry => entry.address = addressToCheck);
    let isValidAddress = user?.address ? true : false ;
    try {
        const [entry, proof] = tree.getProof(addressToCheck);
        res.status(200).json({entry, proof, isValidAddress});
    } catch (error) {
        res.status(500).json({error});
    }
}

    // const body = JSON.parse(req.body);
    // const addressToCheck = body.address;
    // try {
    //     const user = allowlist.find(element => element.address = addressToCheck);
    //     let leaf = keccak256(user.address, user.amount);
    //     let root = tree.getRoot().toString("hex");
    //     let proof = tree.getProof(leaf);
    //     let hexProof = tree.getHexProof(leaf);
    //     let isValid = tree.verify(proof, leaf, root);
    //     if (!isValid) {
    //         throw "Invalid Address";
    //     }
    //     res.status(200).json({proof, hexProof, isValid, user});
    // } catch (error) {
    //     res.status(500).json({error});
    // }