'use client'

import {getQlinksProgram, getQlinksProgramId} from '@project/anchor'
import {useConnection} from '@solana/wallet-adapter-react'
import {Cluster, Keypair, PublicKey} from '@solana/web3.js'
import {useMutation, useQuery} from '@tanstack/react-query'
import {useMemo} from 'react'
import toast from 'react-hot-toast'
import {useCluster} from '../cluster/cluster-data-access'
import {useAnchorProvider} from '../solana/solana-provider'
import {useTransactionToast} from '../ui/ui-layout'

export function useQlinksProgram() {
  const { connection } = useConnection()
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const provider = useAnchorProvider()
  const programId = useMemo(() => getQlinksProgramId(cluster.network as Cluster), [cluster])
  const program = getQlinksProgram(provider)

  const accounts = useQuery({
    queryKey: ['qlinks', 'all', { cluster }],
    queryFn: () => program.account.qlinks.all(),
  })

  const getProgramAccount = useQuery({
    queryKey: ['get-program-account', { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  })

  const initialize = useMutation({
    mutationKey: ['qlinks', 'initialize', { cluster }],
    mutationFn: (keypair: Keypair) =>
      program.methods.initialize().accounts({ qlinks: keypair.publicKey }).signers([keypair]).rpc(),
    onSuccess: (signature) => {
      transactionToast(signature)
      return accounts.refetch()
    },
    onError: () => toast.error('Failed to initialize account'),
  })

  return {
    program,
    programId,
    accounts,
    getProgramAccount,
    initialize,
  }
}

export function useQlinksProgramAccount({ account }: { account: PublicKey }) {
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const { program, accounts } = useQlinksProgram()

  const accountQuery = useQuery({
    queryKey: ['qlinks', 'fetch', { cluster, account }],
    queryFn: () => program.account.qlinks.fetch(account),
  })

  const closeMutation = useMutation({
    mutationKey: ['qlinks', 'close', { cluster, account }],
    mutationFn: () => program.methods.close().accounts({ qlinks: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accounts.refetch()
    },
  })

  const decrementMutation = useMutation({
    mutationKey: ['qlinks', 'decrement', { cluster, account }],
    mutationFn: () => program.methods.decrement().accounts({ qlinks: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  const incrementMutation = useMutation({
    mutationKey: ['qlinks', 'increment', { cluster, account }],
    mutationFn: () => program.methods.increment().accounts({ qlinks: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  const setMutation = useMutation({
    mutationKey: ['qlinks', 'set', { cluster, account }],
    mutationFn: (value: number) => program.methods.set(value).accounts({ qlinks: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  return {
    accountQuery,
    closeMutation,
    decrementMutation,
    incrementMutation,
    setMutation,
  }
}