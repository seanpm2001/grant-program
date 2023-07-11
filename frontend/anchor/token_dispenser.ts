export type TokenDispenser = {
  version: '0.1.0'
  name: 'token_dispenser'
  instructions: [
    {
      name: 'initialize'
      docs: [
        'This can only be called once and should be called right after the program is deployed.'
      ]
      accounts: [
        {
          name: 'payer'
          isMut: true
          isSigner: true
        },
        {
          name: 'config'
          isMut: true
          isSigner: false
        },
        {
          name: 'systemProgram'
          isMut: false
          isSigner: false
        }
      ]
      args: [
        {
          name: 'targetConfig'
          type: {
            defined: 'Config'
          }
        }
      ]
    },
    {
      name: 'claim'
      docs: [
        "* Claim a claimant's tokens. This instructions needs to enforce :\n     * - The dispenser guard has signed the transaction - DONE\n     * - The claimant is claiming no more than once per ecosystem - DONE\n     * - The claimant has provided a valid proof of identity (is the owner of the wallet\n     *   entitled to the tokens)\n     * - The claimant has provided a valid proof of inclusion (this confirm that the claimant --\n     *   DONE\n     * - The claimant has not already claimed tokens -- DONE"
      ]
      accounts: [
        {
          name: 'claimant'
          isMut: true
          isSigner: true
        },
        {
          name: 'dispenserGuard'
          isMut: false
          isSigner: true
        },
        {
          name: 'config'
          isMut: false
          isSigner: false
        },
        {
          name: 'cart'
          isMut: true
          isSigner: false
        },
        {
          name: 'systemProgram'
          isMut: false
          isSigner: false
        },
        {
          name: 'sysvarInstruction'
          isMut: false
          isSigner: false
        }
      ]
      args: [
        {
          name: 'claimCertificates'
          type: {
            vec: {
              defined: 'ClaimCertificate'
            }
          }
        }
      ]
    }
  ]
  accounts: [
    {
      name: 'Config'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'merkleRoot'
            type: {
              defined: 'MerkleRoot<SolanaHasher>'
            }
          },
          {
            name: 'dispenserGuard'
            type: 'publicKey'
          }
        ]
      }
    },
    {
      name: 'Receipt'
      type: {
        kind: 'struct'
        fields: []
      }
    },
    {
      name: 'Cart'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'amount'
            type: 'u64'
          },
          {
            name: 'set'
            type: {
              defined: 'ClaimedEcosystems'
            }
          }
        ]
      }
    }
  ]
  types: [
    {
      name: 'Secp256k1InstructionHeader'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'numSignatures'
            type: 'u8'
          },
          {
            name: 'signatureOffset'
            type: 'u16'
          },
          {
            name: 'signatureInstructionIndex'
            type: 'u8'
          },
          {
            name: 'ethAddressOffset'
            type: 'u16'
          },
          {
            name: 'ethAddressInstructionIndex'
            type: 'u8'
          },
          {
            name: 'messageDataOffset'
            type: 'u16'
          },
          {
            name: 'messageDataSize'
            type: 'u16'
          },
          {
            name: 'messageInstructionIndex'
            type: 'u8'
          }
        ]
      }
    },
    {
      name: 'ClaimInfo'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'identity'
            type: {
              defined: 'Identity'
            }
          },
          {
            name: 'amount'
            type: 'u64'
          }
        ]
      }
    },
    {
      name: 'ClaimCertificate'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'amount'
            type: 'u64'
          },
          {
            name: 'proofOfIdentity'
            type: {
              defined: 'IdentityCertificate'
            }
          },
          {
            name: 'proofOfInclusion'
            type: {
              defined: 'MerklePath<SolanaHasher>'
            }
          }
        ]
      }
    },
    {
      name: 'ClaimedEcosystems'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'set'
            type: {
              array: ['bool', 6]
            }
          }
        ]
      }
    },
    {
      name: 'MerkleRoot<SolanaHasher>'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'data'
            type: {
              array: ['u8', 32]
            }
          }
        ]
      }
    },
    {
      name: 'EvmPubkey'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'data'
            type: {
              array: ['u8', 20]
            }
          }
        ]
      }
    },
    {
      name: 'Secp256k1Signature'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'data'
            type: {
              array: ['u8', 64]
            }
          }
        ]
      }
    },
    {
      name: 'CosmosPubkey'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'data'
            type: {
              array: ['u8', 65]
            }
          }
        ]
      }
    },
    {
      name: 'MerklePath<SolanaHasher>'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'data'
            type: {
              vec: {
                array: ['u8', 32]
              }
            }
          }
        ]
      }
    },
    {
      name: 'Identity'
      docs: [
        "* This is the identity that the claimant will use to claim tokens.\n * A claimant can claim tokens for 1 identity on each ecosystem.\n * Typically for a blockchain it is a public key in the blockchain's address space."
      ]
      type: {
        kind: 'enum'
        variants: [
          {
            name: 'Discord'
            fields: ['string']
          },
          {
            name: 'Solana'
            fields: ['publicKey']
          },
          {
            name: 'Evm'
            fields: [
              {
                defined: 'EvmPubkey'
              }
            ]
          },
          {
            name: 'Sui'
          },
          {
            name: 'Aptos'
          },
          {
            name: 'Cosmwasm'
            fields: ['string']
          }
        ]
      }
    },
    {
      name: 'IdentityCertificate'
      type: {
        kind: 'enum'
        variants: [
          {
            name: 'Discord'
            fields: [
              {
                name: 'username'
                type: 'string'
              }
            ]
          },
          {
            name: 'Evm'
            fields: [
              {
                name: 'pubkey'
                type: {
                  defined: 'EvmPubkey'
                }
              },
              {
                name: 'verification_instruction_index'
                type: 'u8'
              }
            ]
          },
          {
            name: 'Solana'
            fields: [
              {
                name: 'pubkey'
                type: 'publicKey'
              },
              {
                name: 'verification_instruction_index'
                type: 'u8'
              }
            ]
          },
          {
            name: 'Sui'
          },
          {
            name: 'Aptos'
          },
          {
            name: 'Cosmwasm'
            fields: [
              {
                name: 'chain_id'
                type: 'string'
              },
              {
                name: 'signature'
                type: {
                  defined: 'Secp256k1Signature'
                }
              },
              {
                name: 'recovery_id'
                type: 'u8'
              },
              {
                name: 'pubkey'
                type: {
                  defined: 'CosmosPubkey'
                }
              },
              {
                name: 'message'
                type: 'bytes'
              }
            ]
          }
        ]
      }
    }
  ]
  errors: [
    {
      code: 6000
      name: 'ArithmeticOverflow'
    },
    {
      code: 6001
      name: 'MoreThanOneIdentityPerEcosystem'
    },
    {
      code: 6002
      name: 'AlreadyClaimed'
    },
    {
      code: 6003
      name: 'InvalidInclusionProof'
    },
    {
      code: 6004
      name: 'WrongPda'
    },
    {
      code: 6005
      name: 'NotImplemented'
    },
    {
      code: 6006
      name: 'SignatureVerificationWrongProgram'
    },
    {
      code: 6007
      name: 'SignatureVerificationWrongAccounts'
    },
    {
      code: 6008
      name: 'SignatureVerificationWrongHeader'
    },
    {
      code: 6009
      name: 'SignatureVerificationWrongMessage'
    },
    {
      code: 6010
      name: 'SignatureVerificationWrongMessageMetadata'
    },
    {
      code: 6011
      name: 'SignatureVerificationWrongSigner'
    },
    {
      code: 6012
      name: 'SignatureVerificationWrongClaimant'
    }
  ]
}
