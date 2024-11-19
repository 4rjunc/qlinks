// Here we export some useful types and functions for interacting with the Anchor program.
import { AnchorProvider, Program } from '@coral-xyz/anchor'
import { Cluster, PublicKey } from '@solana/web3.js'
import QlinksIDL from '../target/idl/qlinks.json'
import type { Qlinks } from '../target/types/qlinks'

// Re-export the generated IDL and type
export { Qlinks, QlinksIDL }

// The programId is imported from the program IDL.
export const QLINKS_PROGRAM_ID = new PublicKey(QlinksIDL.address)

// This is a helper function to get the Qlinks Anchor program.
export function getQlinksProgram(provider: AnchorProvider) {
  return new Program(QlinksIDL as Qlinks, provider)
}

// This is a helper function to get the program ID for the Qlinks program depending on the cluster.
export function getQlinksProgramId(cluster: Cluster) {
  switch (cluster) {
    case 'devnet':
    case 'testnet':
      // This is the program ID for the Qlinks program on devnet and testnet.
      return new PublicKey('CounNZdmsQmWh7uVngV9FXW2dZ6zAgbJyYsvBpqbykg')
    case 'mainnet-beta':
    default:
      return QLINKS_PROGRAM_ID
  }
}
