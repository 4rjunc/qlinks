#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("AsjZ3kWAUSQRNt2pZVeJkywhZ6gpLpHZmJjduPmKZDZZ");

#[program]
pub mod qlinks {
    use super::*;

  pub fn close(_ctx: Context<CloseQlinks>) -> Result<()> {
    Ok(())
  }

  pub fn decrement(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.qlinks.count = ctx.accounts.qlinks.count.checked_sub(1).unwrap();
    Ok(())
  }

  pub fn increment(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.qlinks.count = ctx.accounts.qlinks.count.checked_add(1).unwrap();
    Ok(())
  }

  pub fn initialize(_ctx: Context<InitializeQlinks>) -> Result<()> {
    Ok(())
  }

  pub fn set(ctx: Context<Update>, value: u8) -> Result<()> {
    ctx.accounts.qlinks.count = value.clone();
    Ok(())
  }
}

#[derive(Accounts)]
pub struct InitializeQlinks<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  init,
  space = 8 + Qlinks::INIT_SPACE,
  payer = payer
  )]
  pub qlinks: Account<'info, Qlinks>,
  pub system_program: Program<'info, System>,
}
#[derive(Accounts)]
pub struct CloseQlinks<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  mut,
  close = payer, // close account and return lamports to payer
  )]
  pub qlinks: Account<'info, Qlinks>,
}

#[derive(Accounts)]
pub struct Update<'info> {
  #[account(mut)]
  pub qlinks: Account<'info, Qlinks>,
}

#[account]
#[derive(InitSpace)]
pub struct Qlinks {
  count: u8,
}
