import * as anchor from '@coral-xyz/anchor'
import {Program} from '@coral-xyz/anchor'
import {Keypair} from '@solana/web3.js'
import {Qlinks} from '../target/types/qlinks'

describe('qlinks', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)
  const payer = provider.wallet as anchor.Wallet

  const program = anchor.workspace.Qlinks as Program<Qlinks>

  const qlinksKeypair = Keypair.generate()

  it('Initialize Qlinks', async () => {
    await program.methods
      .initialize()
      .accounts({
        qlinks: qlinksKeypair.publicKey,
        payer: payer.publicKey,
      })
      .signers([qlinksKeypair])
      .rpc()

    const currentCount = await program.account.qlinks.fetch(qlinksKeypair.publicKey)

    expect(currentCount.count).toEqual(0)
  })

  it('Increment Qlinks', async () => {
    await program.methods.increment().accounts({ qlinks: qlinksKeypair.publicKey }).rpc()

    const currentCount = await program.account.qlinks.fetch(qlinksKeypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Increment Qlinks Again', async () => {
    await program.methods.increment().accounts({ qlinks: qlinksKeypair.publicKey }).rpc()

    const currentCount = await program.account.qlinks.fetch(qlinksKeypair.publicKey)

    expect(currentCount.count).toEqual(2)
  })

  it('Decrement Qlinks', async () => {
    await program.methods.decrement().accounts({ qlinks: qlinksKeypair.publicKey }).rpc()

    const currentCount = await program.account.qlinks.fetch(qlinksKeypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Set qlinks value', async () => {
    await program.methods.set(42).accounts({ qlinks: qlinksKeypair.publicKey }).rpc()

    const currentCount = await program.account.qlinks.fetch(qlinksKeypair.publicKey)

    expect(currentCount.count).toEqual(42)
  })

  it('Set close the qlinks account', async () => {
    await program.methods
      .close()
      .accounts({
        payer: payer.publicKey,
        qlinks: qlinksKeypair.publicKey,
      })
      .rpc()

    // The account should no longer exist, returning null.
    const userAccount = await program.account.qlinks.fetchNullable(qlinksKeypair.publicKey)
    expect(userAccount).toBeNull()
  })
})
