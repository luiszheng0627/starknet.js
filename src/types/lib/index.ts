import { StarknetChainId } from '../../constants';
import { weierstrass } from '../../utils/ec';
import { CompiledContract, CompiledSierraCasm, ContractClass } from './contract';

export type WeierstrassSignatureType = weierstrass.SignatureType;
export type ArraySignatureType = string[];
export type Signature = ArraySignatureType | WeierstrassSignatureType;

export type BigNumberish = string | number | bigint;

/**
 * Compiled calldata ready to be sent
 * decimal-string array
 */
export type Calldata = string[] & { readonly __compiled__?: boolean };

/**
 * Represents an integer in the range [0, 2^256)
 */
export interface Uint256 {
  // The low 128 bits of the value
  low: BigNumberish;
  // The high 128 bits of the value
  high: BigNumberish;
}

/**
 * BigNumberish array
 * use CallData.compile() to convert to Calldata
 */
export type RawCalldata = BigNumberish[];

/**
 * Hexadecimal-string array
 */
export type HexCalldata = string[];

export type AllowArray<T> = T | T[];

export type OptionalPayload<T> = { payload: T } | T;

export type RawArgs = RawArgsObject | RawArgsArray;

export type RawArgsObject = {
  [inputName: string]: MultiType | MultiType[] | RawArgs;
};

export type RawArgsArray = Array<MultiType | MultiType[] | RawArgs>;

export type MultiType = BigNumberish | Uint256 | object | boolean;

export type UniversalDeployerContractPayload = {
  classHash: BigNumberish;
  salt?: string;
  unique?: boolean;
  constructorCalldata?: RawArgs;
};

export type DeployAccountContractPayload = {
  classHash: string;
  constructorCalldata?: RawArgs;
  addressSalt?: BigNumberish;
  contractAddress?: string;
};

export type DeployAccountContractTransaction = Omit<
  DeployAccountContractPayload,
  'contractAddress'
> & {
  signature?: Signature;
};

export type DeclareContractPayload = {
  contract: CompiledContract | string;
  classHash?: string;
  casm?: CompiledSierraCasm;
  compiledClassHash?: string;
};

export type CompleteDeclareContractPayload = {
  contract: CompiledContract | string;
  classHash: string;
  casm?: CompiledSierraCasm;
  compiledClassHash?: string;
};

export type DeclareAndDeployContractPayload = Omit<UniversalDeployerContractPayload, 'classHash'> &
  DeclareContractPayload;

export type DeclareContractTransaction = {
  contract: ContractClass;
  senderAddress: string;
  signature?: Signature;
  compiledClassHash?: string;
};

export type CallDetails = {
  contractAddress: string;
  calldata?: RawArgs | Calldata;
  entrypoint?: string; // TODO: check if required
};

export type Invocation = CallDetails & { signature?: Signature };

export type Call = CallDetails & { entrypoint: string };

export type CairoVersion = '0' | '1';

export type InvocationsDetails = {
  nonce?: BigNumberish;
  maxFee?: BigNumberish;
  version?: BigNumberish;
};

/**
 * Contain all additional details params
 */
export type Details = {
  nonce: BigNumberish;
  maxFee: BigNumberish;
  version: BigNumberish;
  chainId: StarknetChainId;
};

export type InvocationsDetailsWithNonce = InvocationsDetails & {
  nonce: BigNumberish;
};

export enum TransactionType {
  DECLARE = 'DECLARE',
  DEPLOY = 'DEPLOY',
  DEPLOY_ACCOUNT = 'DEPLOY_ACCOUNT',
  INVOKE = 'INVOKE_FUNCTION',
}

export enum TransactionStatus {
  NOT_RECEIVED = 'NOT_RECEIVED',
  RECEIVED = 'RECEIVED',
  ACCEPTED_ON_L2 = 'ACCEPTED_ON_L2',
  ACCEPTED_ON_L1 = 'ACCEPTED_ON_L1',
  REJECTED = 'REJECTED',
}

export enum BlockStatus {
  PENDING = 'PENDING',
  ACCEPTED_ON_L1 = 'ACCEPTED_ON_L1',
  ACCEPTED_ON_L2 = 'ACCEPTED_ON_L2',
  REJECTED = 'REJECTED',
}

export enum BlockTag {
  pending = 'pending',
  latest = 'latest',
}

export type BlockNumber = BlockTag | null | number;

/**
 * hex string and BN are detected as block hashes
 * decimal string and number are detected as block numbers
 * null appends nothing to the request url
 */
export type BlockIdentifier = BlockNumber | BigNumberish;

/**
 * items used by AccountInvocations
 */
export type AccountInvocationItem = (
  | ({ type: TransactionType.DECLARE } & DeclareContractTransaction)
  | ({ type: TransactionType.DEPLOY_ACCOUNT } & DeployAccountContractTransaction)
  | ({ type: TransactionType.INVOKE } & Invocation)
) &
  InvocationsDetailsWithNonce;

/**
 * Complete invocations array with account details (internal type from account -> provider)
 */
export type AccountInvocations = AccountInvocationItem[];

/**
 * Invocations array user provide to bulk method (simulate)
 */
export type Invocations = Array<
  | ({ type: TransactionType.DECLARE } & OptionalPayload<DeclareContractPayload>)
  | ({ type: TransactionType.DEPLOY } & OptionalPayload<
      AllowArray<UniversalDeployerContractPayload>
    >)
  | ({ type: TransactionType.DEPLOY_ACCOUNT } & OptionalPayload<DeployAccountContractPayload>)
  | ({ type: TransactionType.INVOKE } & OptionalPayload<AllowArray<Call>>)
>;

export type Tupled = { element: any; type: string };

export type Args = {
  [inputName: string]: BigNumberish | BigNumberish[] | ParsedStruct | ParsedStruct[];
};
export type ParsedStruct = {
  [key: string]: BigNumberish | ParsedStruct;
};

export type waitForTransactionOptions = {
  retryInterval?: number;
  successStates?: Array<TransactionStatus>;
};

export type getSimulateTransactionOptions = {
  blockIdentifier?: BlockIdentifier;
  skipValidate?: boolean;
  skipExecute?: boolean;
};

export type getEstimateFeeBulkOptions = {
  blockIdentifier?: BlockIdentifier;
  skipValidate?: boolean;
};

export interface CallStruct {
  to: string;
  selector: string;
  calldata: string[];
}

export * from './contract';
