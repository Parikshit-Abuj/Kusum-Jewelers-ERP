
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model Customer
 * 
 */
export type Customer = $Result.DefaultSelection<Prisma.$CustomerPayload>
/**
 * Model Supplier
 * 
 */
export type Supplier = $Result.DefaultSelection<Prisma.$SupplierPayload>
/**
 * Model Product
 * 
 */
export type Product = $Result.DefaultSelection<Prisma.$ProductPayload>
/**
 * Model StockMovement
 * 
 */
export type StockMovement = $Result.DefaultSelection<Prisma.$StockMovementPayload>
/**
 * Model Purchase
 * 
 */
export type Purchase = $Result.DefaultSelection<Prisma.$PurchasePayload>
/**
 * Model PurchaseItem
 * 
 */
export type PurchaseItem = $Result.DefaultSelection<Prisma.$PurchaseItemPayload>
/**
 * Model Sale
 * 
 */
export type Sale = $Result.DefaultSelection<Prisma.$SalePayload>
/**
 * Model SaleItem
 * 
 */
export type SaleItem = $Result.DefaultSelection<Prisma.$SaleItemPayload>
/**
 * Model DailyRate
 * 
 */
export type DailyRate = $Result.DefaultSelection<Prisma.$DailyRatePayload>
/**
 * Model BarcodeSequence
 * 
 */
export type BarcodeSequence = $Result.DefaultSelection<Prisma.$BarcodeSequencePayload>
/**
 * Model CustomerLedger
 * 
 */
export type CustomerLedger = $Result.DefaultSelection<Prisma.$CustomerLedgerPayload>
/**
 * Model Repair
 * 
 */
export type Repair = $Result.DefaultSelection<Prisma.$RepairPayload>
/**
 * Model CashbookEntry
 * 
 */
export type CashbookEntry = $Result.DefaultSelection<Prisma.$CashbookEntryPayload>
/**
 * Model UrdPurchase
 * 
 */
export type UrdPurchase = $Result.DefaultSelection<Prisma.$UrdPurchasePayload>

/**
 * Enums
 */
export namespace $Enums {
  export const MetalType: {
  GOLD: 'GOLD',
  SILVER: 'SILVER',
  PLATINUM: 'PLATINUM',
  DIAMOND: 'DIAMOND',
  OTHER: 'OTHER'
};

export type MetalType = (typeof MetalType)[keyof typeof MetalType]


export const ProductStatus: {
  AVAILABLE: 'AVAILABLE',
  SOLD_OUT: 'SOLD_OUT',
  IN_REPAIR: 'IN_REPAIR',
  INACTIVE: 'INACTIVE'
};

export type ProductStatus = (typeof ProductStatus)[keyof typeof ProductStatus]


export const MovementType: {
  OPENING: 'OPENING',
  PURCHASE: 'PURCHASE',
  SALE: 'SALE',
  ADJUSTMENT_IN: 'ADJUSTMENT_IN',
  ADJUSTMENT_OUT: 'ADJUSTMENT_OUT',
  REPAIR_OUT: 'REPAIR_OUT',
  REPAIR_IN: 'REPAIR_IN'
};

export type MovementType = (typeof MovementType)[keyof typeof MovementType]


export const PaymentMethod: {
  CASH: 'CASH',
  UPI: 'UPI',
  CARD: 'CARD',
  BANK_TRANSFER: 'BANK_TRANSFER',
  CREDIT: 'CREDIT',
  MIXED: 'MIXED'
};

export type PaymentMethod = (typeof PaymentMethod)[keyof typeof PaymentMethod]


export const MakingChargeType: {
  FIXED: 'FIXED',
  PER_GRAM: 'PER_GRAM',
  PERCENTAGE: 'PERCENTAGE'
};

export type MakingChargeType = (typeof MakingChargeType)[keyof typeof MakingChargeType]


export const LedgerEntryType: {
  SALE_CREDIT: 'SALE_CREDIT',
  PAYMENT_RECEIVED: 'PAYMENT_RECEIVED',
  ADJUSTMENT: 'ADJUSTMENT'
};

export type LedgerEntryType = (typeof LedgerEntryType)[keyof typeof LedgerEntryType]


export const CashbookType: {
  IN: 'IN',
  OUT: 'OUT'
};

export type CashbookType = (typeof CashbookType)[keyof typeof CashbookType]


export const RepairStatus: {
  RECEIVED: 'RECEIVED',
  IN_PROGRESS: 'IN_PROGRESS',
  READY: 'READY',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED'
};

export type RepairStatus = (typeof RepairStatus)[keyof typeof RepairStatus]

}

export type MetalType = $Enums.MetalType

export const MetalType: typeof $Enums.MetalType

export type ProductStatus = $Enums.ProductStatus

export const ProductStatus: typeof $Enums.ProductStatus

export type MovementType = $Enums.MovementType

export const MovementType: typeof $Enums.MovementType

export type PaymentMethod = $Enums.PaymentMethod

export const PaymentMethod: typeof $Enums.PaymentMethod

export type MakingChargeType = $Enums.MakingChargeType

export const MakingChargeType: typeof $Enums.MakingChargeType

export type LedgerEntryType = $Enums.LedgerEntryType

export const LedgerEntryType: typeof $Enums.LedgerEntryType

export type CashbookType = $Enums.CashbookType

export const CashbookType: typeof $Enums.CashbookType

export type RepairStatus = $Enums.RepairStatus

export const RepairStatus: typeof $Enums.RepairStatus

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Customers
 * const customers = await prisma.customer.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Customers
   * const customers = await prisma.customer.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.customer`: Exposes CRUD operations for the **Customer** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Customers
    * const customers = await prisma.customer.findMany()
    * ```
    */
  get customer(): Prisma.CustomerDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.supplier`: Exposes CRUD operations for the **Supplier** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Suppliers
    * const suppliers = await prisma.supplier.findMany()
    * ```
    */
  get supplier(): Prisma.SupplierDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.product`: Exposes CRUD operations for the **Product** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Products
    * const products = await prisma.product.findMany()
    * ```
    */
  get product(): Prisma.ProductDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.stockMovement`: Exposes CRUD operations for the **StockMovement** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more StockMovements
    * const stockMovements = await prisma.stockMovement.findMany()
    * ```
    */
  get stockMovement(): Prisma.StockMovementDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.purchase`: Exposes CRUD operations for the **Purchase** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Purchases
    * const purchases = await prisma.purchase.findMany()
    * ```
    */
  get purchase(): Prisma.PurchaseDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.purchaseItem`: Exposes CRUD operations for the **PurchaseItem** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PurchaseItems
    * const purchaseItems = await prisma.purchaseItem.findMany()
    * ```
    */
  get purchaseItem(): Prisma.PurchaseItemDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.sale`: Exposes CRUD operations for the **Sale** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Sales
    * const sales = await prisma.sale.findMany()
    * ```
    */
  get sale(): Prisma.SaleDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.saleItem`: Exposes CRUD operations for the **SaleItem** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more SaleItems
    * const saleItems = await prisma.saleItem.findMany()
    * ```
    */
  get saleItem(): Prisma.SaleItemDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.dailyRate`: Exposes CRUD operations for the **DailyRate** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more DailyRates
    * const dailyRates = await prisma.dailyRate.findMany()
    * ```
    */
  get dailyRate(): Prisma.DailyRateDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.barcodeSequence`: Exposes CRUD operations for the **BarcodeSequence** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more BarcodeSequences
    * const barcodeSequences = await prisma.barcodeSequence.findMany()
    * ```
    */
  get barcodeSequence(): Prisma.BarcodeSequenceDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.customerLedger`: Exposes CRUD operations for the **CustomerLedger** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more CustomerLedgers
    * const customerLedgers = await prisma.customerLedger.findMany()
    * ```
    */
  get customerLedger(): Prisma.CustomerLedgerDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.repair`: Exposes CRUD operations for the **Repair** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Repairs
    * const repairs = await prisma.repair.findMany()
    * ```
    */
  get repair(): Prisma.RepairDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.cashbookEntry`: Exposes CRUD operations for the **CashbookEntry** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more CashbookEntries
    * const cashbookEntries = await prisma.cashbookEntry.findMany()
    * ```
    */
  get cashbookEntry(): Prisma.CashbookEntryDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.urdPurchase`: Exposes CRUD operations for the **UrdPurchase** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more UrdPurchases
    * const urdPurchases = await prisma.urdPurchase.findMany()
    * ```
    */
  get urdPurchase(): Prisma.UrdPurchaseDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.19.3
   * Query Engine version: c2990dca591cba766e3b7ef5d9e8a84796e47ab7
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    Customer: 'Customer',
    Supplier: 'Supplier',
    Product: 'Product',
    StockMovement: 'StockMovement',
    Purchase: 'Purchase',
    PurchaseItem: 'PurchaseItem',
    Sale: 'Sale',
    SaleItem: 'SaleItem',
    DailyRate: 'DailyRate',
    BarcodeSequence: 'BarcodeSequence',
    CustomerLedger: 'CustomerLedger',
    Repair: 'Repair',
    CashbookEntry: 'CashbookEntry',
    UrdPurchase: 'UrdPurchase'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "customer" | "supplier" | "product" | "stockMovement" | "purchase" | "purchaseItem" | "sale" | "saleItem" | "dailyRate" | "barcodeSequence" | "customerLedger" | "repair" | "cashbookEntry" | "urdPurchase"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Customer: {
        payload: Prisma.$CustomerPayload<ExtArgs>
        fields: Prisma.CustomerFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CustomerFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CustomerFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerPayload>
          }
          findFirst: {
            args: Prisma.CustomerFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CustomerFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerPayload>
          }
          findMany: {
            args: Prisma.CustomerFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerPayload>[]
          }
          create: {
            args: Prisma.CustomerCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerPayload>
          }
          createMany: {
            args: Prisma.CustomerCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.CustomerDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerPayload>
          }
          update: {
            args: Prisma.CustomerUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerPayload>
          }
          deleteMany: {
            args: Prisma.CustomerDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CustomerUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.CustomerUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerPayload>
          }
          aggregate: {
            args: Prisma.CustomerAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCustomer>
          }
          groupBy: {
            args: Prisma.CustomerGroupByArgs<ExtArgs>
            result: $Utils.Optional<CustomerGroupByOutputType>[]
          }
          count: {
            args: Prisma.CustomerCountArgs<ExtArgs>
            result: $Utils.Optional<CustomerCountAggregateOutputType> | number
          }
        }
      }
      Supplier: {
        payload: Prisma.$SupplierPayload<ExtArgs>
        fields: Prisma.SupplierFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SupplierFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SupplierPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SupplierFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SupplierPayload>
          }
          findFirst: {
            args: Prisma.SupplierFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SupplierPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SupplierFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SupplierPayload>
          }
          findMany: {
            args: Prisma.SupplierFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SupplierPayload>[]
          }
          create: {
            args: Prisma.SupplierCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SupplierPayload>
          }
          createMany: {
            args: Prisma.SupplierCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.SupplierDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SupplierPayload>
          }
          update: {
            args: Prisma.SupplierUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SupplierPayload>
          }
          deleteMany: {
            args: Prisma.SupplierDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SupplierUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.SupplierUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SupplierPayload>
          }
          aggregate: {
            args: Prisma.SupplierAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSupplier>
          }
          groupBy: {
            args: Prisma.SupplierGroupByArgs<ExtArgs>
            result: $Utils.Optional<SupplierGroupByOutputType>[]
          }
          count: {
            args: Prisma.SupplierCountArgs<ExtArgs>
            result: $Utils.Optional<SupplierCountAggregateOutputType> | number
          }
        }
      }
      Product: {
        payload: Prisma.$ProductPayload<ExtArgs>
        fields: Prisma.ProductFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ProductFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ProductFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload>
          }
          findFirst: {
            args: Prisma.ProductFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ProductFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload>
          }
          findMany: {
            args: Prisma.ProductFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload>[]
          }
          create: {
            args: Prisma.ProductCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload>
          }
          createMany: {
            args: Prisma.ProductCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.ProductDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload>
          }
          update: {
            args: Prisma.ProductUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload>
          }
          deleteMany: {
            args: Prisma.ProductDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ProductUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ProductUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload>
          }
          aggregate: {
            args: Prisma.ProductAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProduct>
          }
          groupBy: {
            args: Prisma.ProductGroupByArgs<ExtArgs>
            result: $Utils.Optional<ProductGroupByOutputType>[]
          }
          count: {
            args: Prisma.ProductCountArgs<ExtArgs>
            result: $Utils.Optional<ProductCountAggregateOutputType> | number
          }
        }
      }
      StockMovement: {
        payload: Prisma.$StockMovementPayload<ExtArgs>
        fields: Prisma.StockMovementFieldRefs
        operations: {
          findUnique: {
            args: Prisma.StockMovementFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StockMovementPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.StockMovementFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StockMovementPayload>
          }
          findFirst: {
            args: Prisma.StockMovementFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StockMovementPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.StockMovementFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StockMovementPayload>
          }
          findMany: {
            args: Prisma.StockMovementFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StockMovementPayload>[]
          }
          create: {
            args: Prisma.StockMovementCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StockMovementPayload>
          }
          createMany: {
            args: Prisma.StockMovementCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.StockMovementDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StockMovementPayload>
          }
          update: {
            args: Prisma.StockMovementUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StockMovementPayload>
          }
          deleteMany: {
            args: Prisma.StockMovementDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.StockMovementUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.StockMovementUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StockMovementPayload>
          }
          aggregate: {
            args: Prisma.StockMovementAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateStockMovement>
          }
          groupBy: {
            args: Prisma.StockMovementGroupByArgs<ExtArgs>
            result: $Utils.Optional<StockMovementGroupByOutputType>[]
          }
          count: {
            args: Prisma.StockMovementCountArgs<ExtArgs>
            result: $Utils.Optional<StockMovementCountAggregateOutputType> | number
          }
        }
      }
      Purchase: {
        payload: Prisma.$PurchasePayload<ExtArgs>
        fields: Prisma.PurchaseFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PurchaseFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PurchasePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PurchaseFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PurchasePayload>
          }
          findFirst: {
            args: Prisma.PurchaseFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PurchasePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PurchaseFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PurchasePayload>
          }
          findMany: {
            args: Prisma.PurchaseFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PurchasePayload>[]
          }
          create: {
            args: Prisma.PurchaseCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PurchasePayload>
          }
          createMany: {
            args: Prisma.PurchaseCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.PurchaseDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PurchasePayload>
          }
          update: {
            args: Prisma.PurchaseUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PurchasePayload>
          }
          deleteMany: {
            args: Prisma.PurchaseDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PurchaseUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.PurchaseUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PurchasePayload>
          }
          aggregate: {
            args: Prisma.PurchaseAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePurchase>
          }
          groupBy: {
            args: Prisma.PurchaseGroupByArgs<ExtArgs>
            result: $Utils.Optional<PurchaseGroupByOutputType>[]
          }
          count: {
            args: Prisma.PurchaseCountArgs<ExtArgs>
            result: $Utils.Optional<PurchaseCountAggregateOutputType> | number
          }
        }
      }
      PurchaseItem: {
        payload: Prisma.$PurchaseItemPayload<ExtArgs>
        fields: Prisma.PurchaseItemFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PurchaseItemFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PurchaseItemPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PurchaseItemFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PurchaseItemPayload>
          }
          findFirst: {
            args: Prisma.PurchaseItemFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PurchaseItemPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PurchaseItemFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PurchaseItemPayload>
          }
          findMany: {
            args: Prisma.PurchaseItemFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PurchaseItemPayload>[]
          }
          create: {
            args: Prisma.PurchaseItemCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PurchaseItemPayload>
          }
          createMany: {
            args: Prisma.PurchaseItemCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.PurchaseItemDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PurchaseItemPayload>
          }
          update: {
            args: Prisma.PurchaseItemUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PurchaseItemPayload>
          }
          deleteMany: {
            args: Prisma.PurchaseItemDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PurchaseItemUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.PurchaseItemUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PurchaseItemPayload>
          }
          aggregate: {
            args: Prisma.PurchaseItemAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePurchaseItem>
          }
          groupBy: {
            args: Prisma.PurchaseItemGroupByArgs<ExtArgs>
            result: $Utils.Optional<PurchaseItemGroupByOutputType>[]
          }
          count: {
            args: Prisma.PurchaseItemCountArgs<ExtArgs>
            result: $Utils.Optional<PurchaseItemCountAggregateOutputType> | number
          }
        }
      }
      Sale: {
        payload: Prisma.$SalePayload<ExtArgs>
        fields: Prisma.SaleFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SaleFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SalePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SaleFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SalePayload>
          }
          findFirst: {
            args: Prisma.SaleFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SalePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SaleFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SalePayload>
          }
          findMany: {
            args: Prisma.SaleFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SalePayload>[]
          }
          create: {
            args: Prisma.SaleCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SalePayload>
          }
          createMany: {
            args: Prisma.SaleCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.SaleDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SalePayload>
          }
          update: {
            args: Prisma.SaleUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SalePayload>
          }
          deleteMany: {
            args: Prisma.SaleDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SaleUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.SaleUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SalePayload>
          }
          aggregate: {
            args: Prisma.SaleAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSale>
          }
          groupBy: {
            args: Prisma.SaleGroupByArgs<ExtArgs>
            result: $Utils.Optional<SaleGroupByOutputType>[]
          }
          count: {
            args: Prisma.SaleCountArgs<ExtArgs>
            result: $Utils.Optional<SaleCountAggregateOutputType> | number
          }
        }
      }
      SaleItem: {
        payload: Prisma.$SaleItemPayload<ExtArgs>
        fields: Prisma.SaleItemFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SaleItemFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SaleItemPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SaleItemFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SaleItemPayload>
          }
          findFirst: {
            args: Prisma.SaleItemFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SaleItemPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SaleItemFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SaleItemPayload>
          }
          findMany: {
            args: Prisma.SaleItemFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SaleItemPayload>[]
          }
          create: {
            args: Prisma.SaleItemCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SaleItemPayload>
          }
          createMany: {
            args: Prisma.SaleItemCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.SaleItemDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SaleItemPayload>
          }
          update: {
            args: Prisma.SaleItemUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SaleItemPayload>
          }
          deleteMany: {
            args: Prisma.SaleItemDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SaleItemUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.SaleItemUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SaleItemPayload>
          }
          aggregate: {
            args: Prisma.SaleItemAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSaleItem>
          }
          groupBy: {
            args: Prisma.SaleItemGroupByArgs<ExtArgs>
            result: $Utils.Optional<SaleItemGroupByOutputType>[]
          }
          count: {
            args: Prisma.SaleItemCountArgs<ExtArgs>
            result: $Utils.Optional<SaleItemCountAggregateOutputType> | number
          }
        }
      }
      DailyRate: {
        payload: Prisma.$DailyRatePayload<ExtArgs>
        fields: Prisma.DailyRateFieldRefs
        operations: {
          findUnique: {
            args: Prisma.DailyRateFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DailyRatePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.DailyRateFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DailyRatePayload>
          }
          findFirst: {
            args: Prisma.DailyRateFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DailyRatePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.DailyRateFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DailyRatePayload>
          }
          findMany: {
            args: Prisma.DailyRateFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DailyRatePayload>[]
          }
          create: {
            args: Prisma.DailyRateCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DailyRatePayload>
          }
          createMany: {
            args: Prisma.DailyRateCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.DailyRateDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DailyRatePayload>
          }
          update: {
            args: Prisma.DailyRateUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DailyRatePayload>
          }
          deleteMany: {
            args: Prisma.DailyRateDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.DailyRateUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.DailyRateUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DailyRatePayload>
          }
          aggregate: {
            args: Prisma.DailyRateAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDailyRate>
          }
          groupBy: {
            args: Prisma.DailyRateGroupByArgs<ExtArgs>
            result: $Utils.Optional<DailyRateGroupByOutputType>[]
          }
          count: {
            args: Prisma.DailyRateCountArgs<ExtArgs>
            result: $Utils.Optional<DailyRateCountAggregateOutputType> | number
          }
        }
      }
      BarcodeSequence: {
        payload: Prisma.$BarcodeSequencePayload<ExtArgs>
        fields: Prisma.BarcodeSequenceFieldRefs
        operations: {
          findUnique: {
            args: Prisma.BarcodeSequenceFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BarcodeSequencePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.BarcodeSequenceFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BarcodeSequencePayload>
          }
          findFirst: {
            args: Prisma.BarcodeSequenceFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BarcodeSequencePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.BarcodeSequenceFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BarcodeSequencePayload>
          }
          findMany: {
            args: Prisma.BarcodeSequenceFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BarcodeSequencePayload>[]
          }
          create: {
            args: Prisma.BarcodeSequenceCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BarcodeSequencePayload>
          }
          createMany: {
            args: Prisma.BarcodeSequenceCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.BarcodeSequenceDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BarcodeSequencePayload>
          }
          update: {
            args: Prisma.BarcodeSequenceUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BarcodeSequencePayload>
          }
          deleteMany: {
            args: Prisma.BarcodeSequenceDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.BarcodeSequenceUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.BarcodeSequenceUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BarcodeSequencePayload>
          }
          aggregate: {
            args: Prisma.BarcodeSequenceAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateBarcodeSequence>
          }
          groupBy: {
            args: Prisma.BarcodeSequenceGroupByArgs<ExtArgs>
            result: $Utils.Optional<BarcodeSequenceGroupByOutputType>[]
          }
          count: {
            args: Prisma.BarcodeSequenceCountArgs<ExtArgs>
            result: $Utils.Optional<BarcodeSequenceCountAggregateOutputType> | number
          }
        }
      }
      CustomerLedger: {
        payload: Prisma.$CustomerLedgerPayload<ExtArgs>
        fields: Prisma.CustomerLedgerFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CustomerLedgerFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerLedgerPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CustomerLedgerFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerLedgerPayload>
          }
          findFirst: {
            args: Prisma.CustomerLedgerFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerLedgerPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CustomerLedgerFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerLedgerPayload>
          }
          findMany: {
            args: Prisma.CustomerLedgerFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerLedgerPayload>[]
          }
          create: {
            args: Prisma.CustomerLedgerCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerLedgerPayload>
          }
          createMany: {
            args: Prisma.CustomerLedgerCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.CustomerLedgerDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerLedgerPayload>
          }
          update: {
            args: Prisma.CustomerLedgerUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerLedgerPayload>
          }
          deleteMany: {
            args: Prisma.CustomerLedgerDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CustomerLedgerUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.CustomerLedgerUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerLedgerPayload>
          }
          aggregate: {
            args: Prisma.CustomerLedgerAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCustomerLedger>
          }
          groupBy: {
            args: Prisma.CustomerLedgerGroupByArgs<ExtArgs>
            result: $Utils.Optional<CustomerLedgerGroupByOutputType>[]
          }
          count: {
            args: Prisma.CustomerLedgerCountArgs<ExtArgs>
            result: $Utils.Optional<CustomerLedgerCountAggregateOutputType> | number
          }
        }
      }
      Repair: {
        payload: Prisma.$RepairPayload<ExtArgs>
        fields: Prisma.RepairFieldRefs
        operations: {
          findUnique: {
            args: Prisma.RepairFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RepairPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.RepairFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RepairPayload>
          }
          findFirst: {
            args: Prisma.RepairFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RepairPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.RepairFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RepairPayload>
          }
          findMany: {
            args: Prisma.RepairFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RepairPayload>[]
          }
          create: {
            args: Prisma.RepairCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RepairPayload>
          }
          createMany: {
            args: Prisma.RepairCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.RepairDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RepairPayload>
          }
          update: {
            args: Prisma.RepairUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RepairPayload>
          }
          deleteMany: {
            args: Prisma.RepairDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.RepairUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.RepairUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RepairPayload>
          }
          aggregate: {
            args: Prisma.RepairAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateRepair>
          }
          groupBy: {
            args: Prisma.RepairGroupByArgs<ExtArgs>
            result: $Utils.Optional<RepairGroupByOutputType>[]
          }
          count: {
            args: Prisma.RepairCountArgs<ExtArgs>
            result: $Utils.Optional<RepairCountAggregateOutputType> | number
          }
        }
      }
      CashbookEntry: {
        payload: Prisma.$CashbookEntryPayload<ExtArgs>
        fields: Prisma.CashbookEntryFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CashbookEntryFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CashbookEntryPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CashbookEntryFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CashbookEntryPayload>
          }
          findFirst: {
            args: Prisma.CashbookEntryFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CashbookEntryPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CashbookEntryFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CashbookEntryPayload>
          }
          findMany: {
            args: Prisma.CashbookEntryFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CashbookEntryPayload>[]
          }
          create: {
            args: Prisma.CashbookEntryCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CashbookEntryPayload>
          }
          createMany: {
            args: Prisma.CashbookEntryCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.CashbookEntryDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CashbookEntryPayload>
          }
          update: {
            args: Prisma.CashbookEntryUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CashbookEntryPayload>
          }
          deleteMany: {
            args: Prisma.CashbookEntryDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CashbookEntryUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.CashbookEntryUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CashbookEntryPayload>
          }
          aggregate: {
            args: Prisma.CashbookEntryAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCashbookEntry>
          }
          groupBy: {
            args: Prisma.CashbookEntryGroupByArgs<ExtArgs>
            result: $Utils.Optional<CashbookEntryGroupByOutputType>[]
          }
          count: {
            args: Prisma.CashbookEntryCountArgs<ExtArgs>
            result: $Utils.Optional<CashbookEntryCountAggregateOutputType> | number
          }
        }
      }
      UrdPurchase: {
        payload: Prisma.$UrdPurchasePayload<ExtArgs>
        fields: Prisma.UrdPurchaseFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UrdPurchaseFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UrdPurchasePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UrdPurchaseFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UrdPurchasePayload>
          }
          findFirst: {
            args: Prisma.UrdPurchaseFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UrdPurchasePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UrdPurchaseFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UrdPurchasePayload>
          }
          findMany: {
            args: Prisma.UrdPurchaseFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UrdPurchasePayload>[]
          }
          create: {
            args: Prisma.UrdPurchaseCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UrdPurchasePayload>
          }
          createMany: {
            args: Prisma.UrdPurchaseCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.UrdPurchaseDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UrdPurchasePayload>
          }
          update: {
            args: Prisma.UrdPurchaseUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UrdPurchasePayload>
          }
          deleteMany: {
            args: Prisma.UrdPurchaseDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UrdPurchaseUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.UrdPurchaseUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UrdPurchasePayload>
          }
          aggregate: {
            args: Prisma.UrdPurchaseAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUrdPurchase>
          }
          groupBy: {
            args: Prisma.UrdPurchaseGroupByArgs<ExtArgs>
            result: $Utils.Optional<UrdPurchaseGroupByOutputType>[]
          }
          count: {
            args: Prisma.UrdPurchaseCountArgs<ExtArgs>
            result: $Utils.Optional<UrdPurchaseCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory | null
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    customer?: CustomerOmit
    supplier?: SupplierOmit
    product?: ProductOmit
    stockMovement?: StockMovementOmit
    purchase?: PurchaseOmit
    purchaseItem?: PurchaseItemOmit
    sale?: SaleOmit
    saleItem?: SaleItemOmit
    dailyRate?: DailyRateOmit
    barcodeSequence?: BarcodeSequenceOmit
    customerLedger?: CustomerLedgerOmit
    repair?: RepairOmit
    cashbookEntry?: CashbookEntryOmit
    urdPurchase?: UrdPurchaseOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type CustomerCountOutputType
   */

  export type CustomerCountOutputType = {
    sales: number
    repairs: number
    ledger: number
    urdPurchases: number
    cashbookEntries: number
  }

  export type CustomerCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    sales?: boolean | CustomerCountOutputTypeCountSalesArgs
    repairs?: boolean | CustomerCountOutputTypeCountRepairsArgs
    ledger?: boolean | CustomerCountOutputTypeCountLedgerArgs
    urdPurchases?: boolean | CustomerCountOutputTypeCountUrdPurchasesArgs
    cashbookEntries?: boolean | CustomerCountOutputTypeCountCashbookEntriesArgs
  }

  // Custom InputTypes
  /**
   * CustomerCountOutputType without action
   */
  export type CustomerCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomerCountOutputType
     */
    select?: CustomerCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * CustomerCountOutputType without action
   */
  export type CustomerCountOutputTypeCountSalesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SaleWhereInput
  }

  /**
   * CustomerCountOutputType without action
   */
  export type CustomerCountOutputTypeCountRepairsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RepairWhereInput
  }

  /**
   * CustomerCountOutputType without action
   */
  export type CustomerCountOutputTypeCountLedgerArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CustomerLedgerWhereInput
  }

  /**
   * CustomerCountOutputType without action
   */
  export type CustomerCountOutputTypeCountUrdPurchasesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UrdPurchaseWhereInput
  }

  /**
   * CustomerCountOutputType without action
   */
  export type CustomerCountOutputTypeCountCashbookEntriesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CashbookEntryWhereInput
  }


  /**
   * Count Type SupplierCountOutputType
   */

  export type SupplierCountOutputType = {
    purchases: number
  }

  export type SupplierCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    purchases?: boolean | SupplierCountOutputTypeCountPurchasesArgs
  }

  // Custom InputTypes
  /**
   * SupplierCountOutputType without action
   */
  export type SupplierCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SupplierCountOutputType
     */
    select?: SupplierCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * SupplierCountOutputType without action
   */
  export type SupplierCountOutputTypeCountPurchasesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PurchaseWhereInput
  }


  /**
   * Count Type ProductCountOutputType
   */

  export type ProductCountOutputType = {
    saleItems: number
    purchaseItems: number
    movements: number
  }

  export type ProductCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    saleItems?: boolean | ProductCountOutputTypeCountSaleItemsArgs
    purchaseItems?: boolean | ProductCountOutputTypeCountPurchaseItemsArgs
    movements?: boolean | ProductCountOutputTypeCountMovementsArgs
  }

  // Custom InputTypes
  /**
   * ProductCountOutputType without action
   */
  export type ProductCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductCountOutputType
     */
    select?: ProductCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ProductCountOutputType without action
   */
  export type ProductCountOutputTypeCountSaleItemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SaleItemWhereInput
  }

  /**
   * ProductCountOutputType without action
   */
  export type ProductCountOutputTypeCountPurchaseItemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PurchaseItemWhereInput
  }

  /**
   * ProductCountOutputType without action
   */
  export type ProductCountOutputTypeCountMovementsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: StockMovementWhereInput
  }


  /**
   * Count Type PurchaseCountOutputType
   */

  export type PurchaseCountOutputType = {
    items: number
  }

  export type PurchaseCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    items?: boolean | PurchaseCountOutputTypeCountItemsArgs
  }

  // Custom InputTypes
  /**
   * PurchaseCountOutputType without action
   */
  export type PurchaseCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PurchaseCountOutputType
     */
    select?: PurchaseCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * PurchaseCountOutputType without action
   */
  export type PurchaseCountOutputTypeCountItemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PurchaseItemWhereInput
  }


  /**
   * Count Type SaleCountOutputType
   */

  export type SaleCountOutputType = {
    items: number
    ledgerEntries: number
  }

  export type SaleCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    items?: boolean | SaleCountOutputTypeCountItemsArgs
    ledgerEntries?: boolean | SaleCountOutputTypeCountLedgerEntriesArgs
  }

  // Custom InputTypes
  /**
   * SaleCountOutputType without action
   */
  export type SaleCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SaleCountOutputType
     */
    select?: SaleCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * SaleCountOutputType without action
   */
  export type SaleCountOutputTypeCountItemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SaleItemWhereInput
  }

  /**
   * SaleCountOutputType without action
   */
  export type SaleCountOutputTypeCountLedgerEntriesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CustomerLedgerWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Customer
   */

  export type AggregateCustomer = {
    _count: CustomerCountAggregateOutputType | null
    _avg: CustomerAvgAggregateOutputType | null
    _sum: CustomerSumAggregateOutputType | null
    _min: CustomerMinAggregateOutputType | null
    _max: CustomerMaxAggregateOutputType | null
  }

  export type CustomerAvgAggregateOutputType = {
    id: number | null
  }

  export type CustomerSumAggregateOutputType = {
    id: number | null
  }

  export type CustomerMinAggregateOutputType = {
    id: number | null
    name: string | null
    phone: string | null
    email: string | null
    address: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CustomerMaxAggregateOutputType = {
    id: number | null
    name: string | null
    phone: string | null
    email: string | null
    address: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CustomerCountAggregateOutputType = {
    id: number
    name: number
    phone: number
    email: number
    address: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type CustomerAvgAggregateInputType = {
    id?: true
  }

  export type CustomerSumAggregateInputType = {
    id?: true
  }

  export type CustomerMinAggregateInputType = {
    id?: true
    name?: true
    phone?: true
    email?: true
    address?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CustomerMaxAggregateInputType = {
    id?: true
    name?: true
    phone?: true
    email?: true
    address?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CustomerCountAggregateInputType = {
    id?: true
    name?: true
    phone?: true
    email?: true
    address?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type CustomerAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Customer to aggregate.
     */
    where?: CustomerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Customers to fetch.
     */
    orderBy?: CustomerOrderByWithRelationInput | CustomerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CustomerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Customers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Customers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Customers
    **/
    _count?: true | CustomerCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: CustomerAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: CustomerSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CustomerMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CustomerMaxAggregateInputType
  }

  export type GetCustomerAggregateType<T extends CustomerAggregateArgs> = {
        [P in keyof T & keyof AggregateCustomer]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCustomer[P]>
      : GetScalarType<T[P], AggregateCustomer[P]>
  }




  export type CustomerGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CustomerWhereInput
    orderBy?: CustomerOrderByWithAggregationInput | CustomerOrderByWithAggregationInput[]
    by: CustomerScalarFieldEnum[] | CustomerScalarFieldEnum
    having?: CustomerScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CustomerCountAggregateInputType | true
    _avg?: CustomerAvgAggregateInputType
    _sum?: CustomerSumAggregateInputType
    _min?: CustomerMinAggregateInputType
    _max?: CustomerMaxAggregateInputType
  }

  export type CustomerGroupByOutputType = {
    id: number
    name: string
    phone: string | null
    email: string | null
    address: string | null
    createdAt: Date
    updatedAt: Date
    _count: CustomerCountAggregateOutputType | null
    _avg: CustomerAvgAggregateOutputType | null
    _sum: CustomerSumAggregateOutputType | null
    _min: CustomerMinAggregateOutputType | null
    _max: CustomerMaxAggregateOutputType | null
  }

  type GetCustomerGroupByPayload<T extends CustomerGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CustomerGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CustomerGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CustomerGroupByOutputType[P]>
            : GetScalarType<T[P], CustomerGroupByOutputType[P]>
        }
      >
    >


  export type CustomerSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    phone?: boolean
    email?: boolean
    address?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    sales?: boolean | Customer$salesArgs<ExtArgs>
    repairs?: boolean | Customer$repairsArgs<ExtArgs>
    ledger?: boolean | Customer$ledgerArgs<ExtArgs>
    urdPurchases?: boolean | Customer$urdPurchasesArgs<ExtArgs>
    cashbookEntries?: boolean | Customer$cashbookEntriesArgs<ExtArgs>
    _count?: boolean | CustomerCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["customer"]>



  export type CustomerSelectScalar = {
    id?: boolean
    name?: boolean
    phone?: boolean
    email?: boolean
    address?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type CustomerOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "phone" | "email" | "address" | "createdAt" | "updatedAt", ExtArgs["result"]["customer"]>
  export type CustomerInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    sales?: boolean | Customer$salesArgs<ExtArgs>
    repairs?: boolean | Customer$repairsArgs<ExtArgs>
    ledger?: boolean | Customer$ledgerArgs<ExtArgs>
    urdPurchases?: boolean | Customer$urdPurchasesArgs<ExtArgs>
    cashbookEntries?: boolean | Customer$cashbookEntriesArgs<ExtArgs>
    _count?: boolean | CustomerCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $CustomerPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Customer"
    objects: {
      sales: Prisma.$SalePayload<ExtArgs>[]
      repairs: Prisma.$RepairPayload<ExtArgs>[]
      ledger: Prisma.$CustomerLedgerPayload<ExtArgs>[]
      urdPurchases: Prisma.$UrdPurchasePayload<ExtArgs>[]
      cashbookEntries: Prisma.$CashbookEntryPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      name: string
      phone: string | null
      email: string | null
      address: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["customer"]>
    composites: {}
  }

  type CustomerGetPayload<S extends boolean | null | undefined | CustomerDefaultArgs> = $Result.GetResult<Prisma.$CustomerPayload, S>

  type CustomerCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CustomerFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CustomerCountAggregateInputType | true
    }

  export interface CustomerDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Customer'], meta: { name: 'Customer' } }
    /**
     * Find zero or one Customer that matches the filter.
     * @param {CustomerFindUniqueArgs} args - Arguments to find a Customer
     * @example
     * // Get one Customer
     * const customer = await prisma.customer.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CustomerFindUniqueArgs>(args: SelectSubset<T, CustomerFindUniqueArgs<ExtArgs>>): Prisma__CustomerClient<$Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Customer that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CustomerFindUniqueOrThrowArgs} args - Arguments to find a Customer
     * @example
     * // Get one Customer
     * const customer = await prisma.customer.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CustomerFindUniqueOrThrowArgs>(args: SelectSubset<T, CustomerFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CustomerClient<$Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Customer that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomerFindFirstArgs} args - Arguments to find a Customer
     * @example
     * // Get one Customer
     * const customer = await prisma.customer.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CustomerFindFirstArgs>(args?: SelectSubset<T, CustomerFindFirstArgs<ExtArgs>>): Prisma__CustomerClient<$Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Customer that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomerFindFirstOrThrowArgs} args - Arguments to find a Customer
     * @example
     * // Get one Customer
     * const customer = await prisma.customer.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CustomerFindFirstOrThrowArgs>(args?: SelectSubset<T, CustomerFindFirstOrThrowArgs<ExtArgs>>): Prisma__CustomerClient<$Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Customers that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomerFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Customers
     * const customers = await prisma.customer.findMany()
     * 
     * // Get first 10 Customers
     * const customers = await prisma.customer.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const customerWithIdOnly = await prisma.customer.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CustomerFindManyArgs>(args?: SelectSubset<T, CustomerFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Customer.
     * @param {CustomerCreateArgs} args - Arguments to create a Customer.
     * @example
     * // Create one Customer
     * const Customer = await prisma.customer.create({
     *   data: {
     *     // ... data to create a Customer
     *   }
     * })
     * 
     */
    create<T extends CustomerCreateArgs>(args: SelectSubset<T, CustomerCreateArgs<ExtArgs>>): Prisma__CustomerClient<$Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Customers.
     * @param {CustomerCreateManyArgs} args - Arguments to create many Customers.
     * @example
     * // Create many Customers
     * const customer = await prisma.customer.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CustomerCreateManyArgs>(args?: SelectSubset<T, CustomerCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Customer.
     * @param {CustomerDeleteArgs} args - Arguments to delete one Customer.
     * @example
     * // Delete one Customer
     * const Customer = await prisma.customer.delete({
     *   where: {
     *     // ... filter to delete one Customer
     *   }
     * })
     * 
     */
    delete<T extends CustomerDeleteArgs>(args: SelectSubset<T, CustomerDeleteArgs<ExtArgs>>): Prisma__CustomerClient<$Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Customer.
     * @param {CustomerUpdateArgs} args - Arguments to update one Customer.
     * @example
     * // Update one Customer
     * const customer = await prisma.customer.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CustomerUpdateArgs>(args: SelectSubset<T, CustomerUpdateArgs<ExtArgs>>): Prisma__CustomerClient<$Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Customers.
     * @param {CustomerDeleteManyArgs} args - Arguments to filter Customers to delete.
     * @example
     * // Delete a few Customers
     * const { count } = await prisma.customer.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CustomerDeleteManyArgs>(args?: SelectSubset<T, CustomerDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Customers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomerUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Customers
     * const customer = await prisma.customer.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CustomerUpdateManyArgs>(args: SelectSubset<T, CustomerUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Customer.
     * @param {CustomerUpsertArgs} args - Arguments to update or create a Customer.
     * @example
     * // Update or create a Customer
     * const customer = await prisma.customer.upsert({
     *   create: {
     *     // ... data to create a Customer
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Customer we want to update
     *   }
     * })
     */
    upsert<T extends CustomerUpsertArgs>(args: SelectSubset<T, CustomerUpsertArgs<ExtArgs>>): Prisma__CustomerClient<$Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Customers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomerCountArgs} args - Arguments to filter Customers to count.
     * @example
     * // Count the number of Customers
     * const count = await prisma.customer.count({
     *   where: {
     *     // ... the filter for the Customers we want to count
     *   }
     * })
    **/
    count<T extends CustomerCountArgs>(
      args?: Subset<T, CustomerCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CustomerCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Customer.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomerAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CustomerAggregateArgs>(args: Subset<T, CustomerAggregateArgs>): Prisma.PrismaPromise<GetCustomerAggregateType<T>>

    /**
     * Group by Customer.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomerGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CustomerGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CustomerGroupByArgs['orderBy'] }
        : { orderBy?: CustomerGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CustomerGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCustomerGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Customer model
   */
  readonly fields: CustomerFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Customer.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CustomerClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    sales<T extends Customer$salesArgs<ExtArgs> = {}>(args?: Subset<T, Customer$salesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SalePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    repairs<T extends Customer$repairsArgs<ExtArgs> = {}>(args?: Subset<T, Customer$repairsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RepairPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    ledger<T extends Customer$ledgerArgs<ExtArgs> = {}>(args?: Subset<T, Customer$ledgerArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CustomerLedgerPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    urdPurchases<T extends Customer$urdPurchasesArgs<ExtArgs> = {}>(args?: Subset<T, Customer$urdPurchasesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UrdPurchasePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    cashbookEntries<T extends Customer$cashbookEntriesArgs<ExtArgs> = {}>(args?: Subset<T, Customer$cashbookEntriesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CashbookEntryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Customer model
   */
  interface CustomerFieldRefs {
    readonly id: FieldRef<"Customer", 'Int'>
    readonly name: FieldRef<"Customer", 'String'>
    readonly phone: FieldRef<"Customer", 'String'>
    readonly email: FieldRef<"Customer", 'String'>
    readonly address: FieldRef<"Customer", 'String'>
    readonly createdAt: FieldRef<"Customer", 'DateTime'>
    readonly updatedAt: FieldRef<"Customer", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Customer findUnique
   */
  export type CustomerFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Customer
     */
    select?: CustomerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Customer
     */
    omit?: CustomerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerInclude<ExtArgs> | null
    /**
     * Filter, which Customer to fetch.
     */
    where: CustomerWhereUniqueInput
  }

  /**
   * Customer findUniqueOrThrow
   */
  export type CustomerFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Customer
     */
    select?: CustomerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Customer
     */
    omit?: CustomerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerInclude<ExtArgs> | null
    /**
     * Filter, which Customer to fetch.
     */
    where: CustomerWhereUniqueInput
  }

  /**
   * Customer findFirst
   */
  export type CustomerFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Customer
     */
    select?: CustomerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Customer
     */
    omit?: CustomerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerInclude<ExtArgs> | null
    /**
     * Filter, which Customer to fetch.
     */
    where?: CustomerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Customers to fetch.
     */
    orderBy?: CustomerOrderByWithRelationInput | CustomerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Customers.
     */
    cursor?: CustomerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Customers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Customers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Customers.
     */
    distinct?: CustomerScalarFieldEnum | CustomerScalarFieldEnum[]
  }

  /**
   * Customer findFirstOrThrow
   */
  export type CustomerFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Customer
     */
    select?: CustomerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Customer
     */
    omit?: CustomerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerInclude<ExtArgs> | null
    /**
     * Filter, which Customer to fetch.
     */
    where?: CustomerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Customers to fetch.
     */
    orderBy?: CustomerOrderByWithRelationInput | CustomerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Customers.
     */
    cursor?: CustomerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Customers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Customers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Customers.
     */
    distinct?: CustomerScalarFieldEnum | CustomerScalarFieldEnum[]
  }

  /**
   * Customer findMany
   */
  export type CustomerFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Customer
     */
    select?: CustomerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Customer
     */
    omit?: CustomerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerInclude<ExtArgs> | null
    /**
     * Filter, which Customers to fetch.
     */
    where?: CustomerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Customers to fetch.
     */
    orderBy?: CustomerOrderByWithRelationInput | CustomerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Customers.
     */
    cursor?: CustomerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Customers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Customers.
     */
    skip?: number
    distinct?: CustomerScalarFieldEnum | CustomerScalarFieldEnum[]
  }

  /**
   * Customer create
   */
  export type CustomerCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Customer
     */
    select?: CustomerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Customer
     */
    omit?: CustomerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerInclude<ExtArgs> | null
    /**
     * The data needed to create a Customer.
     */
    data: XOR<CustomerCreateInput, CustomerUncheckedCreateInput>
  }

  /**
   * Customer createMany
   */
  export type CustomerCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Customers.
     */
    data: CustomerCreateManyInput | CustomerCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Customer update
   */
  export type CustomerUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Customer
     */
    select?: CustomerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Customer
     */
    omit?: CustomerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerInclude<ExtArgs> | null
    /**
     * The data needed to update a Customer.
     */
    data: XOR<CustomerUpdateInput, CustomerUncheckedUpdateInput>
    /**
     * Choose, which Customer to update.
     */
    where: CustomerWhereUniqueInput
  }

  /**
   * Customer updateMany
   */
  export type CustomerUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Customers.
     */
    data: XOR<CustomerUpdateManyMutationInput, CustomerUncheckedUpdateManyInput>
    /**
     * Filter which Customers to update
     */
    where?: CustomerWhereInput
    /**
     * Limit how many Customers to update.
     */
    limit?: number
  }

  /**
   * Customer upsert
   */
  export type CustomerUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Customer
     */
    select?: CustomerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Customer
     */
    omit?: CustomerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerInclude<ExtArgs> | null
    /**
     * The filter to search for the Customer to update in case it exists.
     */
    where: CustomerWhereUniqueInput
    /**
     * In case the Customer found by the `where` argument doesn't exist, create a new Customer with this data.
     */
    create: XOR<CustomerCreateInput, CustomerUncheckedCreateInput>
    /**
     * In case the Customer was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CustomerUpdateInput, CustomerUncheckedUpdateInput>
  }

  /**
   * Customer delete
   */
  export type CustomerDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Customer
     */
    select?: CustomerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Customer
     */
    omit?: CustomerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerInclude<ExtArgs> | null
    /**
     * Filter which Customer to delete.
     */
    where: CustomerWhereUniqueInput
  }

  /**
   * Customer deleteMany
   */
  export type CustomerDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Customers to delete
     */
    where?: CustomerWhereInput
    /**
     * Limit how many Customers to delete.
     */
    limit?: number
  }

  /**
   * Customer.sales
   */
  export type Customer$salesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Sale
     */
    select?: SaleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Sale
     */
    omit?: SaleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SaleInclude<ExtArgs> | null
    where?: SaleWhereInput
    orderBy?: SaleOrderByWithRelationInput | SaleOrderByWithRelationInput[]
    cursor?: SaleWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SaleScalarFieldEnum | SaleScalarFieldEnum[]
  }

  /**
   * Customer.repairs
   */
  export type Customer$repairsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Repair
     */
    select?: RepairSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Repair
     */
    omit?: RepairOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RepairInclude<ExtArgs> | null
    where?: RepairWhereInput
    orderBy?: RepairOrderByWithRelationInput | RepairOrderByWithRelationInput[]
    cursor?: RepairWhereUniqueInput
    take?: number
    skip?: number
    distinct?: RepairScalarFieldEnum | RepairScalarFieldEnum[]
  }

  /**
   * Customer.ledger
   */
  export type Customer$ledgerArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomerLedger
     */
    select?: CustomerLedgerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CustomerLedger
     */
    omit?: CustomerLedgerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerLedgerInclude<ExtArgs> | null
    where?: CustomerLedgerWhereInput
    orderBy?: CustomerLedgerOrderByWithRelationInput | CustomerLedgerOrderByWithRelationInput[]
    cursor?: CustomerLedgerWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CustomerLedgerScalarFieldEnum | CustomerLedgerScalarFieldEnum[]
  }

  /**
   * Customer.urdPurchases
   */
  export type Customer$urdPurchasesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UrdPurchase
     */
    select?: UrdPurchaseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UrdPurchase
     */
    omit?: UrdPurchaseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UrdPurchaseInclude<ExtArgs> | null
    where?: UrdPurchaseWhereInput
    orderBy?: UrdPurchaseOrderByWithRelationInput | UrdPurchaseOrderByWithRelationInput[]
    cursor?: UrdPurchaseWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UrdPurchaseScalarFieldEnum | UrdPurchaseScalarFieldEnum[]
  }

  /**
   * Customer.cashbookEntries
   */
  export type Customer$cashbookEntriesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CashbookEntry
     */
    select?: CashbookEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the CashbookEntry
     */
    omit?: CashbookEntryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CashbookEntryInclude<ExtArgs> | null
    where?: CashbookEntryWhereInput
    orderBy?: CashbookEntryOrderByWithRelationInput | CashbookEntryOrderByWithRelationInput[]
    cursor?: CashbookEntryWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CashbookEntryScalarFieldEnum | CashbookEntryScalarFieldEnum[]
  }

  /**
   * Customer without action
   */
  export type CustomerDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Customer
     */
    select?: CustomerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Customer
     */
    omit?: CustomerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerInclude<ExtArgs> | null
  }


  /**
   * Model Supplier
   */

  export type AggregateSupplier = {
    _count: SupplierCountAggregateOutputType | null
    _avg: SupplierAvgAggregateOutputType | null
    _sum: SupplierSumAggregateOutputType | null
    _min: SupplierMinAggregateOutputType | null
    _max: SupplierMaxAggregateOutputType | null
  }

  export type SupplierAvgAggregateOutputType = {
    id: number | null
  }

  export type SupplierSumAggregateOutputType = {
    id: number | null
  }

  export type SupplierMinAggregateOutputType = {
    id: number | null
    name: string | null
    phone: string | null
    email: string | null
    address: string | null
    gstin: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SupplierMaxAggregateOutputType = {
    id: number | null
    name: string | null
    phone: string | null
    email: string | null
    address: string | null
    gstin: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SupplierCountAggregateOutputType = {
    id: number
    name: number
    phone: number
    email: number
    address: number
    gstin: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type SupplierAvgAggregateInputType = {
    id?: true
  }

  export type SupplierSumAggregateInputType = {
    id?: true
  }

  export type SupplierMinAggregateInputType = {
    id?: true
    name?: true
    phone?: true
    email?: true
    address?: true
    gstin?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SupplierMaxAggregateInputType = {
    id?: true
    name?: true
    phone?: true
    email?: true
    address?: true
    gstin?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SupplierCountAggregateInputType = {
    id?: true
    name?: true
    phone?: true
    email?: true
    address?: true
    gstin?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type SupplierAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Supplier to aggregate.
     */
    where?: SupplierWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Suppliers to fetch.
     */
    orderBy?: SupplierOrderByWithRelationInput | SupplierOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SupplierWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Suppliers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Suppliers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Suppliers
    **/
    _count?: true | SupplierCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: SupplierAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: SupplierSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SupplierMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SupplierMaxAggregateInputType
  }

  export type GetSupplierAggregateType<T extends SupplierAggregateArgs> = {
        [P in keyof T & keyof AggregateSupplier]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSupplier[P]>
      : GetScalarType<T[P], AggregateSupplier[P]>
  }




  export type SupplierGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SupplierWhereInput
    orderBy?: SupplierOrderByWithAggregationInput | SupplierOrderByWithAggregationInput[]
    by: SupplierScalarFieldEnum[] | SupplierScalarFieldEnum
    having?: SupplierScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SupplierCountAggregateInputType | true
    _avg?: SupplierAvgAggregateInputType
    _sum?: SupplierSumAggregateInputType
    _min?: SupplierMinAggregateInputType
    _max?: SupplierMaxAggregateInputType
  }

  export type SupplierGroupByOutputType = {
    id: number
    name: string
    phone: string | null
    email: string | null
    address: string | null
    gstin: string | null
    createdAt: Date
    updatedAt: Date
    _count: SupplierCountAggregateOutputType | null
    _avg: SupplierAvgAggregateOutputType | null
    _sum: SupplierSumAggregateOutputType | null
    _min: SupplierMinAggregateOutputType | null
    _max: SupplierMaxAggregateOutputType | null
  }

  type GetSupplierGroupByPayload<T extends SupplierGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SupplierGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SupplierGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SupplierGroupByOutputType[P]>
            : GetScalarType<T[P], SupplierGroupByOutputType[P]>
        }
      >
    >


  export type SupplierSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    phone?: boolean
    email?: boolean
    address?: boolean
    gstin?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    purchases?: boolean | Supplier$purchasesArgs<ExtArgs>
    _count?: boolean | SupplierCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["supplier"]>



  export type SupplierSelectScalar = {
    id?: boolean
    name?: boolean
    phone?: boolean
    email?: boolean
    address?: boolean
    gstin?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type SupplierOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "phone" | "email" | "address" | "gstin" | "createdAt" | "updatedAt", ExtArgs["result"]["supplier"]>
  export type SupplierInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    purchases?: boolean | Supplier$purchasesArgs<ExtArgs>
    _count?: boolean | SupplierCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $SupplierPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Supplier"
    objects: {
      purchases: Prisma.$PurchasePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      name: string
      phone: string | null
      email: string | null
      address: string | null
      gstin: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["supplier"]>
    composites: {}
  }

  type SupplierGetPayload<S extends boolean | null | undefined | SupplierDefaultArgs> = $Result.GetResult<Prisma.$SupplierPayload, S>

  type SupplierCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SupplierFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SupplierCountAggregateInputType | true
    }

  export interface SupplierDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Supplier'], meta: { name: 'Supplier' } }
    /**
     * Find zero or one Supplier that matches the filter.
     * @param {SupplierFindUniqueArgs} args - Arguments to find a Supplier
     * @example
     * // Get one Supplier
     * const supplier = await prisma.supplier.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SupplierFindUniqueArgs>(args: SelectSubset<T, SupplierFindUniqueArgs<ExtArgs>>): Prisma__SupplierClient<$Result.GetResult<Prisma.$SupplierPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Supplier that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SupplierFindUniqueOrThrowArgs} args - Arguments to find a Supplier
     * @example
     * // Get one Supplier
     * const supplier = await prisma.supplier.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SupplierFindUniqueOrThrowArgs>(args: SelectSubset<T, SupplierFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SupplierClient<$Result.GetResult<Prisma.$SupplierPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Supplier that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SupplierFindFirstArgs} args - Arguments to find a Supplier
     * @example
     * // Get one Supplier
     * const supplier = await prisma.supplier.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SupplierFindFirstArgs>(args?: SelectSubset<T, SupplierFindFirstArgs<ExtArgs>>): Prisma__SupplierClient<$Result.GetResult<Prisma.$SupplierPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Supplier that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SupplierFindFirstOrThrowArgs} args - Arguments to find a Supplier
     * @example
     * // Get one Supplier
     * const supplier = await prisma.supplier.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SupplierFindFirstOrThrowArgs>(args?: SelectSubset<T, SupplierFindFirstOrThrowArgs<ExtArgs>>): Prisma__SupplierClient<$Result.GetResult<Prisma.$SupplierPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Suppliers that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SupplierFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Suppliers
     * const suppliers = await prisma.supplier.findMany()
     * 
     * // Get first 10 Suppliers
     * const suppliers = await prisma.supplier.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const supplierWithIdOnly = await prisma.supplier.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SupplierFindManyArgs>(args?: SelectSubset<T, SupplierFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SupplierPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Supplier.
     * @param {SupplierCreateArgs} args - Arguments to create a Supplier.
     * @example
     * // Create one Supplier
     * const Supplier = await prisma.supplier.create({
     *   data: {
     *     // ... data to create a Supplier
     *   }
     * })
     * 
     */
    create<T extends SupplierCreateArgs>(args: SelectSubset<T, SupplierCreateArgs<ExtArgs>>): Prisma__SupplierClient<$Result.GetResult<Prisma.$SupplierPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Suppliers.
     * @param {SupplierCreateManyArgs} args - Arguments to create many Suppliers.
     * @example
     * // Create many Suppliers
     * const supplier = await prisma.supplier.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SupplierCreateManyArgs>(args?: SelectSubset<T, SupplierCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Supplier.
     * @param {SupplierDeleteArgs} args - Arguments to delete one Supplier.
     * @example
     * // Delete one Supplier
     * const Supplier = await prisma.supplier.delete({
     *   where: {
     *     // ... filter to delete one Supplier
     *   }
     * })
     * 
     */
    delete<T extends SupplierDeleteArgs>(args: SelectSubset<T, SupplierDeleteArgs<ExtArgs>>): Prisma__SupplierClient<$Result.GetResult<Prisma.$SupplierPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Supplier.
     * @param {SupplierUpdateArgs} args - Arguments to update one Supplier.
     * @example
     * // Update one Supplier
     * const supplier = await prisma.supplier.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SupplierUpdateArgs>(args: SelectSubset<T, SupplierUpdateArgs<ExtArgs>>): Prisma__SupplierClient<$Result.GetResult<Prisma.$SupplierPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Suppliers.
     * @param {SupplierDeleteManyArgs} args - Arguments to filter Suppliers to delete.
     * @example
     * // Delete a few Suppliers
     * const { count } = await prisma.supplier.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SupplierDeleteManyArgs>(args?: SelectSubset<T, SupplierDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Suppliers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SupplierUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Suppliers
     * const supplier = await prisma.supplier.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SupplierUpdateManyArgs>(args: SelectSubset<T, SupplierUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Supplier.
     * @param {SupplierUpsertArgs} args - Arguments to update or create a Supplier.
     * @example
     * // Update or create a Supplier
     * const supplier = await prisma.supplier.upsert({
     *   create: {
     *     // ... data to create a Supplier
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Supplier we want to update
     *   }
     * })
     */
    upsert<T extends SupplierUpsertArgs>(args: SelectSubset<T, SupplierUpsertArgs<ExtArgs>>): Prisma__SupplierClient<$Result.GetResult<Prisma.$SupplierPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Suppliers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SupplierCountArgs} args - Arguments to filter Suppliers to count.
     * @example
     * // Count the number of Suppliers
     * const count = await prisma.supplier.count({
     *   where: {
     *     // ... the filter for the Suppliers we want to count
     *   }
     * })
    **/
    count<T extends SupplierCountArgs>(
      args?: Subset<T, SupplierCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SupplierCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Supplier.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SupplierAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SupplierAggregateArgs>(args: Subset<T, SupplierAggregateArgs>): Prisma.PrismaPromise<GetSupplierAggregateType<T>>

    /**
     * Group by Supplier.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SupplierGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SupplierGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SupplierGroupByArgs['orderBy'] }
        : { orderBy?: SupplierGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SupplierGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSupplierGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Supplier model
   */
  readonly fields: SupplierFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Supplier.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SupplierClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    purchases<T extends Supplier$purchasesArgs<ExtArgs> = {}>(args?: Subset<T, Supplier$purchasesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PurchasePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Supplier model
   */
  interface SupplierFieldRefs {
    readonly id: FieldRef<"Supplier", 'Int'>
    readonly name: FieldRef<"Supplier", 'String'>
    readonly phone: FieldRef<"Supplier", 'String'>
    readonly email: FieldRef<"Supplier", 'String'>
    readonly address: FieldRef<"Supplier", 'String'>
    readonly gstin: FieldRef<"Supplier", 'String'>
    readonly createdAt: FieldRef<"Supplier", 'DateTime'>
    readonly updatedAt: FieldRef<"Supplier", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Supplier findUnique
   */
  export type SupplierFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Supplier
     */
    select?: SupplierSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Supplier
     */
    omit?: SupplierOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SupplierInclude<ExtArgs> | null
    /**
     * Filter, which Supplier to fetch.
     */
    where: SupplierWhereUniqueInput
  }

  /**
   * Supplier findUniqueOrThrow
   */
  export type SupplierFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Supplier
     */
    select?: SupplierSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Supplier
     */
    omit?: SupplierOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SupplierInclude<ExtArgs> | null
    /**
     * Filter, which Supplier to fetch.
     */
    where: SupplierWhereUniqueInput
  }

  /**
   * Supplier findFirst
   */
  export type SupplierFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Supplier
     */
    select?: SupplierSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Supplier
     */
    omit?: SupplierOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SupplierInclude<ExtArgs> | null
    /**
     * Filter, which Supplier to fetch.
     */
    where?: SupplierWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Suppliers to fetch.
     */
    orderBy?: SupplierOrderByWithRelationInput | SupplierOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Suppliers.
     */
    cursor?: SupplierWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Suppliers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Suppliers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Suppliers.
     */
    distinct?: SupplierScalarFieldEnum | SupplierScalarFieldEnum[]
  }

  /**
   * Supplier findFirstOrThrow
   */
  export type SupplierFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Supplier
     */
    select?: SupplierSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Supplier
     */
    omit?: SupplierOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SupplierInclude<ExtArgs> | null
    /**
     * Filter, which Supplier to fetch.
     */
    where?: SupplierWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Suppliers to fetch.
     */
    orderBy?: SupplierOrderByWithRelationInput | SupplierOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Suppliers.
     */
    cursor?: SupplierWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Suppliers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Suppliers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Suppliers.
     */
    distinct?: SupplierScalarFieldEnum | SupplierScalarFieldEnum[]
  }

  /**
   * Supplier findMany
   */
  export type SupplierFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Supplier
     */
    select?: SupplierSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Supplier
     */
    omit?: SupplierOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SupplierInclude<ExtArgs> | null
    /**
     * Filter, which Suppliers to fetch.
     */
    where?: SupplierWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Suppliers to fetch.
     */
    orderBy?: SupplierOrderByWithRelationInput | SupplierOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Suppliers.
     */
    cursor?: SupplierWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Suppliers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Suppliers.
     */
    skip?: number
    distinct?: SupplierScalarFieldEnum | SupplierScalarFieldEnum[]
  }

  /**
   * Supplier create
   */
  export type SupplierCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Supplier
     */
    select?: SupplierSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Supplier
     */
    omit?: SupplierOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SupplierInclude<ExtArgs> | null
    /**
     * The data needed to create a Supplier.
     */
    data: XOR<SupplierCreateInput, SupplierUncheckedCreateInput>
  }

  /**
   * Supplier createMany
   */
  export type SupplierCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Suppliers.
     */
    data: SupplierCreateManyInput | SupplierCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Supplier update
   */
  export type SupplierUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Supplier
     */
    select?: SupplierSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Supplier
     */
    omit?: SupplierOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SupplierInclude<ExtArgs> | null
    /**
     * The data needed to update a Supplier.
     */
    data: XOR<SupplierUpdateInput, SupplierUncheckedUpdateInput>
    /**
     * Choose, which Supplier to update.
     */
    where: SupplierWhereUniqueInput
  }

  /**
   * Supplier updateMany
   */
  export type SupplierUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Suppliers.
     */
    data: XOR<SupplierUpdateManyMutationInput, SupplierUncheckedUpdateManyInput>
    /**
     * Filter which Suppliers to update
     */
    where?: SupplierWhereInput
    /**
     * Limit how many Suppliers to update.
     */
    limit?: number
  }

  /**
   * Supplier upsert
   */
  export type SupplierUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Supplier
     */
    select?: SupplierSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Supplier
     */
    omit?: SupplierOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SupplierInclude<ExtArgs> | null
    /**
     * The filter to search for the Supplier to update in case it exists.
     */
    where: SupplierWhereUniqueInput
    /**
     * In case the Supplier found by the `where` argument doesn't exist, create a new Supplier with this data.
     */
    create: XOR<SupplierCreateInput, SupplierUncheckedCreateInput>
    /**
     * In case the Supplier was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SupplierUpdateInput, SupplierUncheckedUpdateInput>
  }

  /**
   * Supplier delete
   */
  export type SupplierDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Supplier
     */
    select?: SupplierSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Supplier
     */
    omit?: SupplierOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SupplierInclude<ExtArgs> | null
    /**
     * Filter which Supplier to delete.
     */
    where: SupplierWhereUniqueInput
  }

  /**
   * Supplier deleteMany
   */
  export type SupplierDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Suppliers to delete
     */
    where?: SupplierWhereInput
    /**
     * Limit how many Suppliers to delete.
     */
    limit?: number
  }

  /**
   * Supplier.purchases
   */
  export type Supplier$purchasesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Purchase
     */
    select?: PurchaseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Purchase
     */
    omit?: PurchaseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PurchaseInclude<ExtArgs> | null
    where?: PurchaseWhereInput
    orderBy?: PurchaseOrderByWithRelationInput | PurchaseOrderByWithRelationInput[]
    cursor?: PurchaseWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PurchaseScalarFieldEnum | PurchaseScalarFieldEnum[]
  }

  /**
   * Supplier without action
   */
  export type SupplierDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Supplier
     */
    select?: SupplierSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Supplier
     */
    omit?: SupplierOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SupplierInclude<ExtArgs> | null
  }


  /**
   * Model Product
   */

  export type AggregateProduct = {
    _count: ProductCountAggregateOutputType | null
    _avg: ProductAvgAggregateOutputType | null
    _sum: ProductSumAggregateOutputType | null
    _min: ProductMinAggregateOutputType | null
    _max: ProductMaxAggregateOutputType | null
  }

  export type ProductAvgAggregateOutputType = {
    id: number | null
    grossWeight: Decimal | null
    stoneWeight: Decimal | null
    netWeight: Decimal | null
    quantity: number | null
    reorderLevel: number | null
    purchasePrice: Decimal | null
    sellingPrice: Decimal | null
    makingChargePerGram: Decimal | null
    makingChargeValue: Decimal | null
  }

  export type ProductSumAggregateOutputType = {
    id: number | null
    grossWeight: Decimal | null
    stoneWeight: Decimal | null
    netWeight: Decimal | null
    quantity: number | null
    reorderLevel: number | null
    purchasePrice: Decimal | null
    sellingPrice: Decimal | null
    makingChargePerGram: Decimal | null
    makingChargeValue: Decimal | null
  }

  export type ProductMinAggregateOutputType = {
    id: number | null
    barcode: string | null
    sku: string | null
    name: string | null
    category: string | null
    metal: $Enums.MetalType | null
    purity: string | null
    grossWeight: Decimal | null
    stoneWeight: Decimal | null
    netWeight: Decimal | null
    quantity: number | null
    reorderLevel: number | null
    purchasePrice: Decimal | null
    sellingPrice: Decimal | null
    makingChargePerGram: Decimal | null
    makingChargeType: $Enums.MakingChargeType | null
    makingChargeValue: Decimal | null
    location: string | null
    notes: string | null
    status: $Enums.ProductStatus | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ProductMaxAggregateOutputType = {
    id: number | null
    barcode: string | null
    sku: string | null
    name: string | null
    category: string | null
    metal: $Enums.MetalType | null
    purity: string | null
    grossWeight: Decimal | null
    stoneWeight: Decimal | null
    netWeight: Decimal | null
    quantity: number | null
    reorderLevel: number | null
    purchasePrice: Decimal | null
    sellingPrice: Decimal | null
    makingChargePerGram: Decimal | null
    makingChargeType: $Enums.MakingChargeType | null
    makingChargeValue: Decimal | null
    location: string | null
    notes: string | null
    status: $Enums.ProductStatus | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ProductCountAggregateOutputType = {
    id: number
    barcode: number
    sku: number
    name: number
    category: number
    metal: number
    purity: number
    grossWeight: number
    stoneWeight: number
    netWeight: number
    quantity: number
    reorderLevel: number
    purchasePrice: number
    sellingPrice: number
    makingChargePerGram: number
    makingChargeType: number
    makingChargeValue: number
    location: number
    notes: number
    status: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ProductAvgAggregateInputType = {
    id?: true
    grossWeight?: true
    stoneWeight?: true
    netWeight?: true
    quantity?: true
    reorderLevel?: true
    purchasePrice?: true
    sellingPrice?: true
    makingChargePerGram?: true
    makingChargeValue?: true
  }

  export type ProductSumAggregateInputType = {
    id?: true
    grossWeight?: true
    stoneWeight?: true
    netWeight?: true
    quantity?: true
    reorderLevel?: true
    purchasePrice?: true
    sellingPrice?: true
    makingChargePerGram?: true
    makingChargeValue?: true
  }

  export type ProductMinAggregateInputType = {
    id?: true
    barcode?: true
    sku?: true
    name?: true
    category?: true
    metal?: true
    purity?: true
    grossWeight?: true
    stoneWeight?: true
    netWeight?: true
    quantity?: true
    reorderLevel?: true
    purchasePrice?: true
    sellingPrice?: true
    makingChargePerGram?: true
    makingChargeType?: true
    makingChargeValue?: true
    location?: true
    notes?: true
    status?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ProductMaxAggregateInputType = {
    id?: true
    barcode?: true
    sku?: true
    name?: true
    category?: true
    metal?: true
    purity?: true
    grossWeight?: true
    stoneWeight?: true
    netWeight?: true
    quantity?: true
    reorderLevel?: true
    purchasePrice?: true
    sellingPrice?: true
    makingChargePerGram?: true
    makingChargeType?: true
    makingChargeValue?: true
    location?: true
    notes?: true
    status?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ProductCountAggregateInputType = {
    id?: true
    barcode?: true
    sku?: true
    name?: true
    category?: true
    metal?: true
    purity?: true
    grossWeight?: true
    stoneWeight?: true
    netWeight?: true
    quantity?: true
    reorderLevel?: true
    purchasePrice?: true
    sellingPrice?: true
    makingChargePerGram?: true
    makingChargeType?: true
    makingChargeValue?: true
    location?: true
    notes?: true
    status?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ProductAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Product to aggregate.
     */
    where?: ProductWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Products to fetch.
     */
    orderBy?: ProductOrderByWithRelationInput | ProductOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ProductWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Products from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Products.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Products
    **/
    _count?: true | ProductCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ProductAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ProductSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ProductMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ProductMaxAggregateInputType
  }

  export type GetProductAggregateType<T extends ProductAggregateArgs> = {
        [P in keyof T & keyof AggregateProduct]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProduct[P]>
      : GetScalarType<T[P], AggregateProduct[P]>
  }




  export type ProductGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProductWhereInput
    orderBy?: ProductOrderByWithAggregationInput | ProductOrderByWithAggregationInput[]
    by: ProductScalarFieldEnum[] | ProductScalarFieldEnum
    having?: ProductScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ProductCountAggregateInputType | true
    _avg?: ProductAvgAggregateInputType
    _sum?: ProductSumAggregateInputType
    _min?: ProductMinAggregateInputType
    _max?: ProductMaxAggregateInputType
  }

  export type ProductGroupByOutputType = {
    id: number
    barcode: string | null
    sku: string
    name: string
    category: string
    metal: $Enums.MetalType
    purity: string | null
    grossWeight: Decimal
    stoneWeight: Decimal
    netWeight: Decimal
    quantity: number
    reorderLevel: number
    purchasePrice: Decimal
    sellingPrice: Decimal
    makingChargePerGram: Decimal
    makingChargeType: $Enums.MakingChargeType
    makingChargeValue: Decimal
    location: string | null
    notes: string | null
    status: $Enums.ProductStatus
    createdAt: Date
    updatedAt: Date
    _count: ProductCountAggregateOutputType | null
    _avg: ProductAvgAggregateOutputType | null
    _sum: ProductSumAggregateOutputType | null
    _min: ProductMinAggregateOutputType | null
    _max: ProductMaxAggregateOutputType | null
  }

  type GetProductGroupByPayload<T extends ProductGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ProductGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ProductGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ProductGroupByOutputType[P]>
            : GetScalarType<T[P], ProductGroupByOutputType[P]>
        }
      >
    >


  export type ProductSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    barcode?: boolean
    sku?: boolean
    name?: boolean
    category?: boolean
    metal?: boolean
    purity?: boolean
    grossWeight?: boolean
    stoneWeight?: boolean
    netWeight?: boolean
    quantity?: boolean
    reorderLevel?: boolean
    purchasePrice?: boolean
    sellingPrice?: boolean
    makingChargePerGram?: boolean
    makingChargeType?: boolean
    makingChargeValue?: boolean
    location?: boolean
    notes?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    saleItems?: boolean | Product$saleItemsArgs<ExtArgs>
    purchaseItems?: boolean | Product$purchaseItemsArgs<ExtArgs>
    movements?: boolean | Product$movementsArgs<ExtArgs>
    _count?: boolean | ProductCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["product"]>



  export type ProductSelectScalar = {
    id?: boolean
    barcode?: boolean
    sku?: boolean
    name?: boolean
    category?: boolean
    metal?: boolean
    purity?: boolean
    grossWeight?: boolean
    stoneWeight?: boolean
    netWeight?: boolean
    quantity?: boolean
    reorderLevel?: boolean
    purchasePrice?: boolean
    sellingPrice?: boolean
    makingChargePerGram?: boolean
    makingChargeType?: boolean
    makingChargeValue?: boolean
    location?: boolean
    notes?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ProductOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "barcode" | "sku" | "name" | "category" | "metal" | "purity" | "grossWeight" | "stoneWeight" | "netWeight" | "quantity" | "reorderLevel" | "purchasePrice" | "sellingPrice" | "makingChargePerGram" | "makingChargeType" | "makingChargeValue" | "location" | "notes" | "status" | "createdAt" | "updatedAt", ExtArgs["result"]["product"]>
  export type ProductInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    saleItems?: boolean | Product$saleItemsArgs<ExtArgs>
    purchaseItems?: boolean | Product$purchaseItemsArgs<ExtArgs>
    movements?: boolean | Product$movementsArgs<ExtArgs>
    _count?: boolean | ProductCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $ProductPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Product"
    objects: {
      saleItems: Prisma.$SaleItemPayload<ExtArgs>[]
      purchaseItems: Prisma.$PurchaseItemPayload<ExtArgs>[]
      movements: Prisma.$StockMovementPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      barcode: string | null
      sku: string
      name: string
      category: string
      metal: $Enums.MetalType
      purity: string | null
      grossWeight: Prisma.Decimal
      stoneWeight: Prisma.Decimal
      netWeight: Prisma.Decimal
      quantity: number
      reorderLevel: number
      purchasePrice: Prisma.Decimal
      sellingPrice: Prisma.Decimal
      makingChargePerGram: Prisma.Decimal
      makingChargeType: $Enums.MakingChargeType
      makingChargeValue: Prisma.Decimal
      location: string | null
      notes: string | null
      status: $Enums.ProductStatus
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["product"]>
    composites: {}
  }

  type ProductGetPayload<S extends boolean | null | undefined | ProductDefaultArgs> = $Result.GetResult<Prisma.$ProductPayload, S>

  type ProductCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ProductFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ProductCountAggregateInputType | true
    }

  export interface ProductDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Product'], meta: { name: 'Product' } }
    /**
     * Find zero or one Product that matches the filter.
     * @param {ProductFindUniqueArgs} args - Arguments to find a Product
     * @example
     * // Get one Product
     * const product = await prisma.product.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ProductFindUniqueArgs>(args: SelectSubset<T, ProductFindUniqueArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Product that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ProductFindUniqueOrThrowArgs} args - Arguments to find a Product
     * @example
     * // Get one Product
     * const product = await prisma.product.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ProductFindUniqueOrThrowArgs>(args: SelectSubset<T, ProductFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Product that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductFindFirstArgs} args - Arguments to find a Product
     * @example
     * // Get one Product
     * const product = await prisma.product.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ProductFindFirstArgs>(args?: SelectSubset<T, ProductFindFirstArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Product that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductFindFirstOrThrowArgs} args - Arguments to find a Product
     * @example
     * // Get one Product
     * const product = await prisma.product.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ProductFindFirstOrThrowArgs>(args?: SelectSubset<T, ProductFindFirstOrThrowArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Products that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Products
     * const products = await prisma.product.findMany()
     * 
     * // Get first 10 Products
     * const products = await prisma.product.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const productWithIdOnly = await prisma.product.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ProductFindManyArgs>(args?: SelectSubset<T, ProductFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Product.
     * @param {ProductCreateArgs} args - Arguments to create a Product.
     * @example
     * // Create one Product
     * const Product = await prisma.product.create({
     *   data: {
     *     // ... data to create a Product
     *   }
     * })
     * 
     */
    create<T extends ProductCreateArgs>(args: SelectSubset<T, ProductCreateArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Products.
     * @param {ProductCreateManyArgs} args - Arguments to create many Products.
     * @example
     * // Create many Products
     * const product = await prisma.product.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ProductCreateManyArgs>(args?: SelectSubset<T, ProductCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Product.
     * @param {ProductDeleteArgs} args - Arguments to delete one Product.
     * @example
     * // Delete one Product
     * const Product = await prisma.product.delete({
     *   where: {
     *     // ... filter to delete one Product
     *   }
     * })
     * 
     */
    delete<T extends ProductDeleteArgs>(args: SelectSubset<T, ProductDeleteArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Product.
     * @param {ProductUpdateArgs} args - Arguments to update one Product.
     * @example
     * // Update one Product
     * const product = await prisma.product.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ProductUpdateArgs>(args: SelectSubset<T, ProductUpdateArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Products.
     * @param {ProductDeleteManyArgs} args - Arguments to filter Products to delete.
     * @example
     * // Delete a few Products
     * const { count } = await prisma.product.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ProductDeleteManyArgs>(args?: SelectSubset<T, ProductDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Products.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Products
     * const product = await prisma.product.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ProductUpdateManyArgs>(args: SelectSubset<T, ProductUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Product.
     * @param {ProductUpsertArgs} args - Arguments to update or create a Product.
     * @example
     * // Update or create a Product
     * const product = await prisma.product.upsert({
     *   create: {
     *     // ... data to create a Product
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Product we want to update
     *   }
     * })
     */
    upsert<T extends ProductUpsertArgs>(args: SelectSubset<T, ProductUpsertArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Products.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductCountArgs} args - Arguments to filter Products to count.
     * @example
     * // Count the number of Products
     * const count = await prisma.product.count({
     *   where: {
     *     // ... the filter for the Products we want to count
     *   }
     * })
    **/
    count<T extends ProductCountArgs>(
      args?: Subset<T, ProductCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProductCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Product.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ProductAggregateArgs>(args: Subset<T, ProductAggregateArgs>): Prisma.PrismaPromise<GetProductAggregateType<T>>

    /**
     * Group by Product.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ProductGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ProductGroupByArgs['orderBy'] }
        : { orderBy?: ProductGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ProductGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProductGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Product model
   */
  readonly fields: ProductFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Product.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ProductClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    saleItems<T extends Product$saleItemsArgs<ExtArgs> = {}>(args?: Subset<T, Product$saleItemsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SaleItemPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    purchaseItems<T extends Product$purchaseItemsArgs<ExtArgs> = {}>(args?: Subset<T, Product$purchaseItemsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PurchaseItemPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    movements<T extends Product$movementsArgs<ExtArgs> = {}>(args?: Subset<T, Product$movementsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StockMovementPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Product model
   */
  interface ProductFieldRefs {
    readonly id: FieldRef<"Product", 'Int'>
    readonly barcode: FieldRef<"Product", 'String'>
    readonly sku: FieldRef<"Product", 'String'>
    readonly name: FieldRef<"Product", 'String'>
    readonly category: FieldRef<"Product", 'String'>
    readonly metal: FieldRef<"Product", 'MetalType'>
    readonly purity: FieldRef<"Product", 'String'>
    readonly grossWeight: FieldRef<"Product", 'Decimal'>
    readonly stoneWeight: FieldRef<"Product", 'Decimal'>
    readonly netWeight: FieldRef<"Product", 'Decimal'>
    readonly quantity: FieldRef<"Product", 'Int'>
    readonly reorderLevel: FieldRef<"Product", 'Int'>
    readonly purchasePrice: FieldRef<"Product", 'Decimal'>
    readonly sellingPrice: FieldRef<"Product", 'Decimal'>
    readonly makingChargePerGram: FieldRef<"Product", 'Decimal'>
    readonly makingChargeType: FieldRef<"Product", 'MakingChargeType'>
    readonly makingChargeValue: FieldRef<"Product", 'Decimal'>
    readonly location: FieldRef<"Product", 'String'>
    readonly notes: FieldRef<"Product", 'String'>
    readonly status: FieldRef<"Product", 'ProductStatus'>
    readonly createdAt: FieldRef<"Product", 'DateTime'>
    readonly updatedAt: FieldRef<"Product", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Product findUnique
   */
  export type ProductFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Product
     */
    omit?: ProductOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    /**
     * Filter, which Product to fetch.
     */
    where: ProductWhereUniqueInput
  }

  /**
   * Product findUniqueOrThrow
   */
  export type ProductFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Product
     */
    omit?: ProductOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    /**
     * Filter, which Product to fetch.
     */
    where: ProductWhereUniqueInput
  }

  /**
   * Product findFirst
   */
  export type ProductFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Product
     */
    omit?: ProductOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    /**
     * Filter, which Product to fetch.
     */
    where?: ProductWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Products to fetch.
     */
    orderBy?: ProductOrderByWithRelationInput | ProductOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Products.
     */
    cursor?: ProductWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Products from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Products.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Products.
     */
    distinct?: ProductScalarFieldEnum | ProductScalarFieldEnum[]
  }

  /**
   * Product findFirstOrThrow
   */
  export type ProductFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Product
     */
    omit?: ProductOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    /**
     * Filter, which Product to fetch.
     */
    where?: ProductWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Products to fetch.
     */
    orderBy?: ProductOrderByWithRelationInput | ProductOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Products.
     */
    cursor?: ProductWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Products from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Products.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Products.
     */
    distinct?: ProductScalarFieldEnum | ProductScalarFieldEnum[]
  }

  /**
   * Product findMany
   */
  export type ProductFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Product
     */
    omit?: ProductOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    /**
     * Filter, which Products to fetch.
     */
    where?: ProductWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Products to fetch.
     */
    orderBy?: ProductOrderByWithRelationInput | ProductOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Products.
     */
    cursor?: ProductWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Products from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Products.
     */
    skip?: number
    distinct?: ProductScalarFieldEnum | ProductScalarFieldEnum[]
  }

  /**
   * Product create
   */
  export type ProductCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Product
     */
    omit?: ProductOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    /**
     * The data needed to create a Product.
     */
    data: XOR<ProductCreateInput, ProductUncheckedCreateInput>
  }

  /**
   * Product createMany
   */
  export type ProductCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Products.
     */
    data: ProductCreateManyInput | ProductCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Product update
   */
  export type ProductUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Product
     */
    omit?: ProductOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    /**
     * The data needed to update a Product.
     */
    data: XOR<ProductUpdateInput, ProductUncheckedUpdateInput>
    /**
     * Choose, which Product to update.
     */
    where: ProductWhereUniqueInput
  }

  /**
   * Product updateMany
   */
  export type ProductUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Products.
     */
    data: XOR<ProductUpdateManyMutationInput, ProductUncheckedUpdateManyInput>
    /**
     * Filter which Products to update
     */
    where?: ProductWhereInput
    /**
     * Limit how many Products to update.
     */
    limit?: number
  }

  /**
   * Product upsert
   */
  export type ProductUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Product
     */
    omit?: ProductOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    /**
     * The filter to search for the Product to update in case it exists.
     */
    where: ProductWhereUniqueInput
    /**
     * In case the Product found by the `where` argument doesn't exist, create a new Product with this data.
     */
    create: XOR<ProductCreateInput, ProductUncheckedCreateInput>
    /**
     * In case the Product was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ProductUpdateInput, ProductUncheckedUpdateInput>
  }

  /**
   * Product delete
   */
  export type ProductDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Product
     */
    omit?: ProductOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    /**
     * Filter which Product to delete.
     */
    where: ProductWhereUniqueInput
  }

  /**
   * Product deleteMany
   */
  export type ProductDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Products to delete
     */
    where?: ProductWhereInput
    /**
     * Limit how many Products to delete.
     */
    limit?: number
  }

  /**
   * Product.saleItems
   */
  export type Product$saleItemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SaleItem
     */
    select?: SaleItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SaleItem
     */
    omit?: SaleItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SaleItemInclude<ExtArgs> | null
    where?: SaleItemWhereInput
    orderBy?: SaleItemOrderByWithRelationInput | SaleItemOrderByWithRelationInput[]
    cursor?: SaleItemWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SaleItemScalarFieldEnum | SaleItemScalarFieldEnum[]
  }

  /**
   * Product.purchaseItems
   */
  export type Product$purchaseItemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PurchaseItem
     */
    select?: PurchaseItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PurchaseItem
     */
    omit?: PurchaseItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PurchaseItemInclude<ExtArgs> | null
    where?: PurchaseItemWhereInput
    orderBy?: PurchaseItemOrderByWithRelationInput | PurchaseItemOrderByWithRelationInput[]
    cursor?: PurchaseItemWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PurchaseItemScalarFieldEnum | PurchaseItemScalarFieldEnum[]
  }

  /**
   * Product.movements
   */
  export type Product$movementsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StockMovement
     */
    select?: StockMovementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StockMovement
     */
    omit?: StockMovementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StockMovementInclude<ExtArgs> | null
    where?: StockMovementWhereInput
    orderBy?: StockMovementOrderByWithRelationInput | StockMovementOrderByWithRelationInput[]
    cursor?: StockMovementWhereUniqueInput
    take?: number
    skip?: number
    distinct?: StockMovementScalarFieldEnum | StockMovementScalarFieldEnum[]
  }

  /**
   * Product without action
   */
  export type ProductDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Product
     */
    omit?: ProductOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
  }


  /**
   * Model StockMovement
   */

  export type AggregateStockMovement = {
    _count: StockMovementCountAggregateOutputType | null
    _avg: StockMovementAvgAggregateOutputType | null
    _sum: StockMovementSumAggregateOutputType | null
    _min: StockMovementMinAggregateOutputType | null
    _max: StockMovementMaxAggregateOutputType | null
  }

  export type StockMovementAvgAggregateOutputType = {
    id: number | null
    productId: number | null
    quantity: number | null
  }

  export type StockMovementSumAggregateOutputType = {
    id: number | null
    productId: number | null
    quantity: number | null
  }

  export type StockMovementMinAggregateOutputType = {
    id: number | null
    productId: number | null
    type: $Enums.MovementType | null
    quantity: number | null
    note: string | null
    createdAt: Date | null
  }

  export type StockMovementMaxAggregateOutputType = {
    id: number | null
    productId: number | null
    type: $Enums.MovementType | null
    quantity: number | null
    note: string | null
    createdAt: Date | null
  }

  export type StockMovementCountAggregateOutputType = {
    id: number
    productId: number
    type: number
    quantity: number
    note: number
    createdAt: number
    _all: number
  }


  export type StockMovementAvgAggregateInputType = {
    id?: true
    productId?: true
    quantity?: true
  }

  export type StockMovementSumAggregateInputType = {
    id?: true
    productId?: true
    quantity?: true
  }

  export type StockMovementMinAggregateInputType = {
    id?: true
    productId?: true
    type?: true
    quantity?: true
    note?: true
    createdAt?: true
  }

  export type StockMovementMaxAggregateInputType = {
    id?: true
    productId?: true
    type?: true
    quantity?: true
    note?: true
    createdAt?: true
  }

  export type StockMovementCountAggregateInputType = {
    id?: true
    productId?: true
    type?: true
    quantity?: true
    note?: true
    createdAt?: true
    _all?: true
  }

  export type StockMovementAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which StockMovement to aggregate.
     */
    where?: StockMovementWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StockMovements to fetch.
     */
    orderBy?: StockMovementOrderByWithRelationInput | StockMovementOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: StockMovementWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StockMovements from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StockMovements.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned StockMovements
    **/
    _count?: true | StockMovementCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: StockMovementAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: StockMovementSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: StockMovementMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: StockMovementMaxAggregateInputType
  }

  export type GetStockMovementAggregateType<T extends StockMovementAggregateArgs> = {
        [P in keyof T & keyof AggregateStockMovement]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateStockMovement[P]>
      : GetScalarType<T[P], AggregateStockMovement[P]>
  }




  export type StockMovementGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: StockMovementWhereInput
    orderBy?: StockMovementOrderByWithAggregationInput | StockMovementOrderByWithAggregationInput[]
    by: StockMovementScalarFieldEnum[] | StockMovementScalarFieldEnum
    having?: StockMovementScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: StockMovementCountAggregateInputType | true
    _avg?: StockMovementAvgAggregateInputType
    _sum?: StockMovementSumAggregateInputType
    _min?: StockMovementMinAggregateInputType
    _max?: StockMovementMaxAggregateInputType
  }

  export type StockMovementGroupByOutputType = {
    id: number
    productId: number
    type: $Enums.MovementType
    quantity: number
    note: string | null
    createdAt: Date
    _count: StockMovementCountAggregateOutputType | null
    _avg: StockMovementAvgAggregateOutputType | null
    _sum: StockMovementSumAggregateOutputType | null
    _min: StockMovementMinAggregateOutputType | null
    _max: StockMovementMaxAggregateOutputType | null
  }

  type GetStockMovementGroupByPayload<T extends StockMovementGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<StockMovementGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof StockMovementGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], StockMovementGroupByOutputType[P]>
            : GetScalarType<T[P], StockMovementGroupByOutputType[P]>
        }
      >
    >


  export type StockMovementSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    productId?: boolean
    type?: boolean
    quantity?: boolean
    note?: boolean
    createdAt?: boolean
    product?: boolean | ProductDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["stockMovement"]>



  export type StockMovementSelectScalar = {
    id?: boolean
    productId?: boolean
    type?: boolean
    quantity?: boolean
    note?: boolean
    createdAt?: boolean
  }

  export type StockMovementOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "productId" | "type" | "quantity" | "note" | "createdAt", ExtArgs["result"]["stockMovement"]>
  export type StockMovementInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    product?: boolean | ProductDefaultArgs<ExtArgs>
  }

  export type $StockMovementPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "StockMovement"
    objects: {
      product: Prisma.$ProductPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      productId: number
      type: $Enums.MovementType
      quantity: number
      note: string | null
      createdAt: Date
    }, ExtArgs["result"]["stockMovement"]>
    composites: {}
  }

  type StockMovementGetPayload<S extends boolean | null | undefined | StockMovementDefaultArgs> = $Result.GetResult<Prisma.$StockMovementPayload, S>

  type StockMovementCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<StockMovementFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: StockMovementCountAggregateInputType | true
    }

  export interface StockMovementDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['StockMovement'], meta: { name: 'StockMovement' } }
    /**
     * Find zero or one StockMovement that matches the filter.
     * @param {StockMovementFindUniqueArgs} args - Arguments to find a StockMovement
     * @example
     * // Get one StockMovement
     * const stockMovement = await prisma.stockMovement.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends StockMovementFindUniqueArgs>(args: SelectSubset<T, StockMovementFindUniqueArgs<ExtArgs>>): Prisma__StockMovementClient<$Result.GetResult<Prisma.$StockMovementPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one StockMovement that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {StockMovementFindUniqueOrThrowArgs} args - Arguments to find a StockMovement
     * @example
     * // Get one StockMovement
     * const stockMovement = await prisma.stockMovement.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends StockMovementFindUniqueOrThrowArgs>(args: SelectSubset<T, StockMovementFindUniqueOrThrowArgs<ExtArgs>>): Prisma__StockMovementClient<$Result.GetResult<Prisma.$StockMovementPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first StockMovement that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StockMovementFindFirstArgs} args - Arguments to find a StockMovement
     * @example
     * // Get one StockMovement
     * const stockMovement = await prisma.stockMovement.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends StockMovementFindFirstArgs>(args?: SelectSubset<T, StockMovementFindFirstArgs<ExtArgs>>): Prisma__StockMovementClient<$Result.GetResult<Prisma.$StockMovementPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first StockMovement that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StockMovementFindFirstOrThrowArgs} args - Arguments to find a StockMovement
     * @example
     * // Get one StockMovement
     * const stockMovement = await prisma.stockMovement.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends StockMovementFindFirstOrThrowArgs>(args?: SelectSubset<T, StockMovementFindFirstOrThrowArgs<ExtArgs>>): Prisma__StockMovementClient<$Result.GetResult<Prisma.$StockMovementPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more StockMovements that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StockMovementFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all StockMovements
     * const stockMovements = await prisma.stockMovement.findMany()
     * 
     * // Get first 10 StockMovements
     * const stockMovements = await prisma.stockMovement.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const stockMovementWithIdOnly = await prisma.stockMovement.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends StockMovementFindManyArgs>(args?: SelectSubset<T, StockMovementFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StockMovementPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a StockMovement.
     * @param {StockMovementCreateArgs} args - Arguments to create a StockMovement.
     * @example
     * // Create one StockMovement
     * const StockMovement = await prisma.stockMovement.create({
     *   data: {
     *     // ... data to create a StockMovement
     *   }
     * })
     * 
     */
    create<T extends StockMovementCreateArgs>(args: SelectSubset<T, StockMovementCreateArgs<ExtArgs>>): Prisma__StockMovementClient<$Result.GetResult<Prisma.$StockMovementPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many StockMovements.
     * @param {StockMovementCreateManyArgs} args - Arguments to create many StockMovements.
     * @example
     * // Create many StockMovements
     * const stockMovement = await prisma.stockMovement.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends StockMovementCreateManyArgs>(args?: SelectSubset<T, StockMovementCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a StockMovement.
     * @param {StockMovementDeleteArgs} args - Arguments to delete one StockMovement.
     * @example
     * // Delete one StockMovement
     * const StockMovement = await prisma.stockMovement.delete({
     *   where: {
     *     // ... filter to delete one StockMovement
     *   }
     * })
     * 
     */
    delete<T extends StockMovementDeleteArgs>(args: SelectSubset<T, StockMovementDeleteArgs<ExtArgs>>): Prisma__StockMovementClient<$Result.GetResult<Prisma.$StockMovementPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one StockMovement.
     * @param {StockMovementUpdateArgs} args - Arguments to update one StockMovement.
     * @example
     * // Update one StockMovement
     * const stockMovement = await prisma.stockMovement.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends StockMovementUpdateArgs>(args: SelectSubset<T, StockMovementUpdateArgs<ExtArgs>>): Prisma__StockMovementClient<$Result.GetResult<Prisma.$StockMovementPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more StockMovements.
     * @param {StockMovementDeleteManyArgs} args - Arguments to filter StockMovements to delete.
     * @example
     * // Delete a few StockMovements
     * const { count } = await prisma.stockMovement.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends StockMovementDeleteManyArgs>(args?: SelectSubset<T, StockMovementDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more StockMovements.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StockMovementUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many StockMovements
     * const stockMovement = await prisma.stockMovement.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends StockMovementUpdateManyArgs>(args: SelectSubset<T, StockMovementUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one StockMovement.
     * @param {StockMovementUpsertArgs} args - Arguments to update or create a StockMovement.
     * @example
     * // Update or create a StockMovement
     * const stockMovement = await prisma.stockMovement.upsert({
     *   create: {
     *     // ... data to create a StockMovement
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the StockMovement we want to update
     *   }
     * })
     */
    upsert<T extends StockMovementUpsertArgs>(args: SelectSubset<T, StockMovementUpsertArgs<ExtArgs>>): Prisma__StockMovementClient<$Result.GetResult<Prisma.$StockMovementPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of StockMovements.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StockMovementCountArgs} args - Arguments to filter StockMovements to count.
     * @example
     * // Count the number of StockMovements
     * const count = await prisma.stockMovement.count({
     *   where: {
     *     // ... the filter for the StockMovements we want to count
     *   }
     * })
    **/
    count<T extends StockMovementCountArgs>(
      args?: Subset<T, StockMovementCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], StockMovementCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a StockMovement.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StockMovementAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends StockMovementAggregateArgs>(args: Subset<T, StockMovementAggregateArgs>): Prisma.PrismaPromise<GetStockMovementAggregateType<T>>

    /**
     * Group by StockMovement.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StockMovementGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends StockMovementGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: StockMovementGroupByArgs['orderBy'] }
        : { orderBy?: StockMovementGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, StockMovementGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetStockMovementGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the StockMovement model
   */
  readonly fields: StockMovementFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for StockMovement.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__StockMovementClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    product<T extends ProductDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ProductDefaultArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the StockMovement model
   */
  interface StockMovementFieldRefs {
    readonly id: FieldRef<"StockMovement", 'Int'>
    readonly productId: FieldRef<"StockMovement", 'Int'>
    readonly type: FieldRef<"StockMovement", 'MovementType'>
    readonly quantity: FieldRef<"StockMovement", 'Int'>
    readonly note: FieldRef<"StockMovement", 'String'>
    readonly createdAt: FieldRef<"StockMovement", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * StockMovement findUnique
   */
  export type StockMovementFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StockMovement
     */
    select?: StockMovementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StockMovement
     */
    omit?: StockMovementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StockMovementInclude<ExtArgs> | null
    /**
     * Filter, which StockMovement to fetch.
     */
    where: StockMovementWhereUniqueInput
  }

  /**
   * StockMovement findUniqueOrThrow
   */
  export type StockMovementFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StockMovement
     */
    select?: StockMovementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StockMovement
     */
    omit?: StockMovementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StockMovementInclude<ExtArgs> | null
    /**
     * Filter, which StockMovement to fetch.
     */
    where: StockMovementWhereUniqueInput
  }

  /**
   * StockMovement findFirst
   */
  export type StockMovementFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StockMovement
     */
    select?: StockMovementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StockMovement
     */
    omit?: StockMovementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StockMovementInclude<ExtArgs> | null
    /**
     * Filter, which StockMovement to fetch.
     */
    where?: StockMovementWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StockMovements to fetch.
     */
    orderBy?: StockMovementOrderByWithRelationInput | StockMovementOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for StockMovements.
     */
    cursor?: StockMovementWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StockMovements from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StockMovements.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of StockMovements.
     */
    distinct?: StockMovementScalarFieldEnum | StockMovementScalarFieldEnum[]
  }

  /**
   * StockMovement findFirstOrThrow
   */
  export type StockMovementFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StockMovement
     */
    select?: StockMovementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StockMovement
     */
    omit?: StockMovementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StockMovementInclude<ExtArgs> | null
    /**
     * Filter, which StockMovement to fetch.
     */
    where?: StockMovementWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StockMovements to fetch.
     */
    orderBy?: StockMovementOrderByWithRelationInput | StockMovementOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for StockMovements.
     */
    cursor?: StockMovementWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StockMovements from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StockMovements.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of StockMovements.
     */
    distinct?: StockMovementScalarFieldEnum | StockMovementScalarFieldEnum[]
  }

  /**
   * StockMovement findMany
   */
  export type StockMovementFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StockMovement
     */
    select?: StockMovementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StockMovement
     */
    omit?: StockMovementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StockMovementInclude<ExtArgs> | null
    /**
     * Filter, which StockMovements to fetch.
     */
    where?: StockMovementWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StockMovements to fetch.
     */
    orderBy?: StockMovementOrderByWithRelationInput | StockMovementOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing StockMovements.
     */
    cursor?: StockMovementWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StockMovements from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StockMovements.
     */
    skip?: number
    distinct?: StockMovementScalarFieldEnum | StockMovementScalarFieldEnum[]
  }

  /**
   * StockMovement create
   */
  export type StockMovementCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StockMovement
     */
    select?: StockMovementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StockMovement
     */
    omit?: StockMovementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StockMovementInclude<ExtArgs> | null
    /**
     * The data needed to create a StockMovement.
     */
    data: XOR<StockMovementCreateInput, StockMovementUncheckedCreateInput>
  }

  /**
   * StockMovement createMany
   */
  export type StockMovementCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many StockMovements.
     */
    data: StockMovementCreateManyInput | StockMovementCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * StockMovement update
   */
  export type StockMovementUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StockMovement
     */
    select?: StockMovementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StockMovement
     */
    omit?: StockMovementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StockMovementInclude<ExtArgs> | null
    /**
     * The data needed to update a StockMovement.
     */
    data: XOR<StockMovementUpdateInput, StockMovementUncheckedUpdateInput>
    /**
     * Choose, which StockMovement to update.
     */
    where: StockMovementWhereUniqueInput
  }

  /**
   * StockMovement updateMany
   */
  export type StockMovementUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update StockMovements.
     */
    data: XOR<StockMovementUpdateManyMutationInput, StockMovementUncheckedUpdateManyInput>
    /**
     * Filter which StockMovements to update
     */
    where?: StockMovementWhereInput
    /**
     * Limit how many StockMovements to update.
     */
    limit?: number
  }

  /**
   * StockMovement upsert
   */
  export type StockMovementUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StockMovement
     */
    select?: StockMovementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StockMovement
     */
    omit?: StockMovementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StockMovementInclude<ExtArgs> | null
    /**
     * The filter to search for the StockMovement to update in case it exists.
     */
    where: StockMovementWhereUniqueInput
    /**
     * In case the StockMovement found by the `where` argument doesn't exist, create a new StockMovement with this data.
     */
    create: XOR<StockMovementCreateInput, StockMovementUncheckedCreateInput>
    /**
     * In case the StockMovement was found with the provided `where` argument, update it with this data.
     */
    update: XOR<StockMovementUpdateInput, StockMovementUncheckedUpdateInput>
  }

  /**
   * StockMovement delete
   */
  export type StockMovementDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StockMovement
     */
    select?: StockMovementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StockMovement
     */
    omit?: StockMovementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StockMovementInclude<ExtArgs> | null
    /**
     * Filter which StockMovement to delete.
     */
    where: StockMovementWhereUniqueInput
  }

  /**
   * StockMovement deleteMany
   */
  export type StockMovementDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which StockMovements to delete
     */
    where?: StockMovementWhereInput
    /**
     * Limit how many StockMovements to delete.
     */
    limit?: number
  }

  /**
   * StockMovement without action
   */
  export type StockMovementDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StockMovement
     */
    select?: StockMovementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StockMovement
     */
    omit?: StockMovementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StockMovementInclude<ExtArgs> | null
  }


  /**
   * Model Purchase
   */

  export type AggregatePurchase = {
    _count: PurchaseCountAggregateOutputType | null
    _avg: PurchaseAvgAggregateOutputType | null
    _sum: PurchaseSumAggregateOutputType | null
    _min: PurchaseMinAggregateOutputType | null
    _max: PurchaseMaxAggregateOutputType | null
  }

  export type PurchaseAvgAggregateOutputType = {
    id: number | null
    supplierId: number | null
    subtotal: Decimal | null
    discount: Decimal | null
    total: Decimal | null
    paid: Decimal | null
  }

  export type PurchaseSumAggregateOutputType = {
    id: number | null
    supplierId: number | null
    subtotal: Decimal | null
    discount: Decimal | null
    total: Decimal | null
    paid: Decimal | null
  }

  export type PurchaseMinAggregateOutputType = {
    id: number | null
    purchaseNumber: string | null
    supplierId: number | null
    purchaseDate: Date | null
    subtotal: Decimal | null
    discount: Decimal | null
    total: Decimal | null
    paid: Decimal | null
    paymentMethod: $Enums.PaymentMethod | null
    notes: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PurchaseMaxAggregateOutputType = {
    id: number | null
    purchaseNumber: string | null
    supplierId: number | null
    purchaseDate: Date | null
    subtotal: Decimal | null
    discount: Decimal | null
    total: Decimal | null
    paid: Decimal | null
    paymentMethod: $Enums.PaymentMethod | null
    notes: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PurchaseCountAggregateOutputType = {
    id: number
    purchaseNumber: number
    supplierId: number
    purchaseDate: number
    subtotal: number
    discount: number
    total: number
    paid: number
    paymentMethod: number
    notes: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type PurchaseAvgAggregateInputType = {
    id?: true
    supplierId?: true
    subtotal?: true
    discount?: true
    total?: true
    paid?: true
  }

  export type PurchaseSumAggregateInputType = {
    id?: true
    supplierId?: true
    subtotal?: true
    discount?: true
    total?: true
    paid?: true
  }

  export type PurchaseMinAggregateInputType = {
    id?: true
    purchaseNumber?: true
    supplierId?: true
    purchaseDate?: true
    subtotal?: true
    discount?: true
    total?: true
    paid?: true
    paymentMethod?: true
    notes?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PurchaseMaxAggregateInputType = {
    id?: true
    purchaseNumber?: true
    supplierId?: true
    purchaseDate?: true
    subtotal?: true
    discount?: true
    total?: true
    paid?: true
    paymentMethod?: true
    notes?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PurchaseCountAggregateInputType = {
    id?: true
    purchaseNumber?: true
    supplierId?: true
    purchaseDate?: true
    subtotal?: true
    discount?: true
    total?: true
    paid?: true
    paymentMethod?: true
    notes?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type PurchaseAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Purchase to aggregate.
     */
    where?: PurchaseWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Purchases to fetch.
     */
    orderBy?: PurchaseOrderByWithRelationInput | PurchaseOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PurchaseWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Purchases from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Purchases.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Purchases
    **/
    _count?: true | PurchaseCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PurchaseAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PurchaseSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PurchaseMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PurchaseMaxAggregateInputType
  }

  export type GetPurchaseAggregateType<T extends PurchaseAggregateArgs> = {
        [P in keyof T & keyof AggregatePurchase]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePurchase[P]>
      : GetScalarType<T[P], AggregatePurchase[P]>
  }




  export type PurchaseGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PurchaseWhereInput
    orderBy?: PurchaseOrderByWithAggregationInput | PurchaseOrderByWithAggregationInput[]
    by: PurchaseScalarFieldEnum[] | PurchaseScalarFieldEnum
    having?: PurchaseScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PurchaseCountAggregateInputType | true
    _avg?: PurchaseAvgAggregateInputType
    _sum?: PurchaseSumAggregateInputType
    _min?: PurchaseMinAggregateInputType
    _max?: PurchaseMaxAggregateInputType
  }

  export type PurchaseGroupByOutputType = {
    id: number
    purchaseNumber: string
    supplierId: number | null
    purchaseDate: Date
    subtotal: Decimal
    discount: Decimal
    total: Decimal
    paid: Decimal
    paymentMethod: $Enums.PaymentMethod
    notes: string | null
    createdAt: Date
    updatedAt: Date
    _count: PurchaseCountAggregateOutputType | null
    _avg: PurchaseAvgAggregateOutputType | null
    _sum: PurchaseSumAggregateOutputType | null
    _min: PurchaseMinAggregateOutputType | null
    _max: PurchaseMaxAggregateOutputType | null
  }

  type GetPurchaseGroupByPayload<T extends PurchaseGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PurchaseGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PurchaseGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PurchaseGroupByOutputType[P]>
            : GetScalarType<T[P], PurchaseGroupByOutputType[P]>
        }
      >
    >


  export type PurchaseSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    purchaseNumber?: boolean
    supplierId?: boolean
    purchaseDate?: boolean
    subtotal?: boolean
    discount?: boolean
    total?: boolean
    paid?: boolean
    paymentMethod?: boolean
    notes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    supplier?: boolean | Purchase$supplierArgs<ExtArgs>
    items?: boolean | Purchase$itemsArgs<ExtArgs>
    _count?: boolean | PurchaseCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["purchase"]>



  export type PurchaseSelectScalar = {
    id?: boolean
    purchaseNumber?: boolean
    supplierId?: boolean
    purchaseDate?: boolean
    subtotal?: boolean
    discount?: boolean
    total?: boolean
    paid?: boolean
    paymentMethod?: boolean
    notes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type PurchaseOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "purchaseNumber" | "supplierId" | "purchaseDate" | "subtotal" | "discount" | "total" | "paid" | "paymentMethod" | "notes" | "createdAt" | "updatedAt", ExtArgs["result"]["purchase"]>
  export type PurchaseInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    supplier?: boolean | Purchase$supplierArgs<ExtArgs>
    items?: boolean | Purchase$itemsArgs<ExtArgs>
    _count?: boolean | PurchaseCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $PurchasePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Purchase"
    objects: {
      supplier: Prisma.$SupplierPayload<ExtArgs> | null
      items: Prisma.$PurchaseItemPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      purchaseNumber: string
      supplierId: number | null
      purchaseDate: Date
      subtotal: Prisma.Decimal
      discount: Prisma.Decimal
      total: Prisma.Decimal
      paid: Prisma.Decimal
      paymentMethod: $Enums.PaymentMethod
      notes: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["purchase"]>
    composites: {}
  }

  type PurchaseGetPayload<S extends boolean | null | undefined | PurchaseDefaultArgs> = $Result.GetResult<Prisma.$PurchasePayload, S>

  type PurchaseCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PurchaseFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PurchaseCountAggregateInputType | true
    }

  export interface PurchaseDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Purchase'], meta: { name: 'Purchase' } }
    /**
     * Find zero or one Purchase that matches the filter.
     * @param {PurchaseFindUniqueArgs} args - Arguments to find a Purchase
     * @example
     * // Get one Purchase
     * const purchase = await prisma.purchase.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PurchaseFindUniqueArgs>(args: SelectSubset<T, PurchaseFindUniqueArgs<ExtArgs>>): Prisma__PurchaseClient<$Result.GetResult<Prisma.$PurchasePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Purchase that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PurchaseFindUniqueOrThrowArgs} args - Arguments to find a Purchase
     * @example
     * // Get one Purchase
     * const purchase = await prisma.purchase.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PurchaseFindUniqueOrThrowArgs>(args: SelectSubset<T, PurchaseFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PurchaseClient<$Result.GetResult<Prisma.$PurchasePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Purchase that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PurchaseFindFirstArgs} args - Arguments to find a Purchase
     * @example
     * // Get one Purchase
     * const purchase = await prisma.purchase.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PurchaseFindFirstArgs>(args?: SelectSubset<T, PurchaseFindFirstArgs<ExtArgs>>): Prisma__PurchaseClient<$Result.GetResult<Prisma.$PurchasePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Purchase that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PurchaseFindFirstOrThrowArgs} args - Arguments to find a Purchase
     * @example
     * // Get one Purchase
     * const purchase = await prisma.purchase.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PurchaseFindFirstOrThrowArgs>(args?: SelectSubset<T, PurchaseFindFirstOrThrowArgs<ExtArgs>>): Prisma__PurchaseClient<$Result.GetResult<Prisma.$PurchasePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Purchases that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PurchaseFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Purchases
     * const purchases = await prisma.purchase.findMany()
     * 
     * // Get first 10 Purchases
     * const purchases = await prisma.purchase.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const purchaseWithIdOnly = await prisma.purchase.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PurchaseFindManyArgs>(args?: SelectSubset<T, PurchaseFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PurchasePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Purchase.
     * @param {PurchaseCreateArgs} args - Arguments to create a Purchase.
     * @example
     * // Create one Purchase
     * const Purchase = await prisma.purchase.create({
     *   data: {
     *     // ... data to create a Purchase
     *   }
     * })
     * 
     */
    create<T extends PurchaseCreateArgs>(args: SelectSubset<T, PurchaseCreateArgs<ExtArgs>>): Prisma__PurchaseClient<$Result.GetResult<Prisma.$PurchasePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Purchases.
     * @param {PurchaseCreateManyArgs} args - Arguments to create many Purchases.
     * @example
     * // Create many Purchases
     * const purchase = await prisma.purchase.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PurchaseCreateManyArgs>(args?: SelectSubset<T, PurchaseCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Purchase.
     * @param {PurchaseDeleteArgs} args - Arguments to delete one Purchase.
     * @example
     * // Delete one Purchase
     * const Purchase = await prisma.purchase.delete({
     *   where: {
     *     // ... filter to delete one Purchase
     *   }
     * })
     * 
     */
    delete<T extends PurchaseDeleteArgs>(args: SelectSubset<T, PurchaseDeleteArgs<ExtArgs>>): Prisma__PurchaseClient<$Result.GetResult<Prisma.$PurchasePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Purchase.
     * @param {PurchaseUpdateArgs} args - Arguments to update one Purchase.
     * @example
     * // Update one Purchase
     * const purchase = await prisma.purchase.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PurchaseUpdateArgs>(args: SelectSubset<T, PurchaseUpdateArgs<ExtArgs>>): Prisma__PurchaseClient<$Result.GetResult<Prisma.$PurchasePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Purchases.
     * @param {PurchaseDeleteManyArgs} args - Arguments to filter Purchases to delete.
     * @example
     * // Delete a few Purchases
     * const { count } = await prisma.purchase.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PurchaseDeleteManyArgs>(args?: SelectSubset<T, PurchaseDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Purchases.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PurchaseUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Purchases
     * const purchase = await prisma.purchase.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PurchaseUpdateManyArgs>(args: SelectSubset<T, PurchaseUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Purchase.
     * @param {PurchaseUpsertArgs} args - Arguments to update or create a Purchase.
     * @example
     * // Update or create a Purchase
     * const purchase = await prisma.purchase.upsert({
     *   create: {
     *     // ... data to create a Purchase
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Purchase we want to update
     *   }
     * })
     */
    upsert<T extends PurchaseUpsertArgs>(args: SelectSubset<T, PurchaseUpsertArgs<ExtArgs>>): Prisma__PurchaseClient<$Result.GetResult<Prisma.$PurchasePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Purchases.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PurchaseCountArgs} args - Arguments to filter Purchases to count.
     * @example
     * // Count the number of Purchases
     * const count = await prisma.purchase.count({
     *   where: {
     *     // ... the filter for the Purchases we want to count
     *   }
     * })
    **/
    count<T extends PurchaseCountArgs>(
      args?: Subset<T, PurchaseCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PurchaseCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Purchase.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PurchaseAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PurchaseAggregateArgs>(args: Subset<T, PurchaseAggregateArgs>): Prisma.PrismaPromise<GetPurchaseAggregateType<T>>

    /**
     * Group by Purchase.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PurchaseGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PurchaseGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PurchaseGroupByArgs['orderBy'] }
        : { orderBy?: PurchaseGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PurchaseGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPurchaseGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Purchase model
   */
  readonly fields: PurchaseFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Purchase.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PurchaseClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    supplier<T extends Purchase$supplierArgs<ExtArgs> = {}>(args?: Subset<T, Purchase$supplierArgs<ExtArgs>>): Prisma__SupplierClient<$Result.GetResult<Prisma.$SupplierPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    items<T extends Purchase$itemsArgs<ExtArgs> = {}>(args?: Subset<T, Purchase$itemsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PurchaseItemPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Purchase model
   */
  interface PurchaseFieldRefs {
    readonly id: FieldRef<"Purchase", 'Int'>
    readonly purchaseNumber: FieldRef<"Purchase", 'String'>
    readonly supplierId: FieldRef<"Purchase", 'Int'>
    readonly purchaseDate: FieldRef<"Purchase", 'DateTime'>
    readonly subtotal: FieldRef<"Purchase", 'Decimal'>
    readonly discount: FieldRef<"Purchase", 'Decimal'>
    readonly total: FieldRef<"Purchase", 'Decimal'>
    readonly paid: FieldRef<"Purchase", 'Decimal'>
    readonly paymentMethod: FieldRef<"Purchase", 'PaymentMethod'>
    readonly notes: FieldRef<"Purchase", 'String'>
    readonly createdAt: FieldRef<"Purchase", 'DateTime'>
    readonly updatedAt: FieldRef<"Purchase", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Purchase findUnique
   */
  export type PurchaseFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Purchase
     */
    select?: PurchaseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Purchase
     */
    omit?: PurchaseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PurchaseInclude<ExtArgs> | null
    /**
     * Filter, which Purchase to fetch.
     */
    where: PurchaseWhereUniqueInput
  }

  /**
   * Purchase findUniqueOrThrow
   */
  export type PurchaseFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Purchase
     */
    select?: PurchaseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Purchase
     */
    omit?: PurchaseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PurchaseInclude<ExtArgs> | null
    /**
     * Filter, which Purchase to fetch.
     */
    where: PurchaseWhereUniqueInput
  }

  /**
   * Purchase findFirst
   */
  export type PurchaseFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Purchase
     */
    select?: PurchaseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Purchase
     */
    omit?: PurchaseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PurchaseInclude<ExtArgs> | null
    /**
     * Filter, which Purchase to fetch.
     */
    where?: PurchaseWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Purchases to fetch.
     */
    orderBy?: PurchaseOrderByWithRelationInput | PurchaseOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Purchases.
     */
    cursor?: PurchaseWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Purchases from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Purchases.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Purchases.
     */
    distinct?: PurchaseScalarFieldEnum | PurchaseScalarFieldEnum[]
  }

  /**
   * Purchase findFirstOrThrow
   */
  export type PurchaseFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Purchase
     */
    select?: PurchaseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Purchase
     */
    omit?: PurchaseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PurchaseInclude<ExtArgs> | null
    /**
     * Filter, which Purchase to fetch.
     */
    where?: PurchaseWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Purchases to fetch.
     */
    orderBy?: PurchaseOrderByWithRelationInput | PurchaseOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Purchases.
     */
    cursor?: PurchaseWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Purchases from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Purchases.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Purchases.
     */
    distinct?: PurchaseScalarFieldEnum | PurchaseScalarFieldEnum[]
  }

  /**
   * Purchase findMany
   */
  export type PurchaseFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Purchase
     */
    select?: PurchaseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Purchase
     */
    omit?: PurchaseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PurchaseInclude<ExtArgs> | null
    /**
     * Filter, which Purchases to fetch.
     */
    where?: PurchaseWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Purchases to fetch.
     */
    orderBy?: PurchaseOrderByWithRelationInput | PurchaseOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Purchases.
     */
    cursor?: PurchaseWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Purchases from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Purchases.
     */
    skip?: number
    distinct?: PurchaseScalarFieldEnum | PurchaseScalarFieldEnum[]
  }

  /**
   * Purchase create
   */
  export type PurchaseCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Purchase
     */
    select?: PurchaseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Purchase
     */
    omit?: PurchaseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PurchaseInclude<ExtArgs> | null
    /**
     * The data needed to create a Purchase.
     */
    data: XOR<PurchaseCreateInput, PurchaseUncheckedCreateInput>
  }

  /**
   * Purchase createMany
   */
  export type PurchaseCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Purchases.
     */
    data: PurchaseCreateManyInput | PurchaseCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Purchase update
   */
  export type PurchaseUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Purchase
     */
    select?: PurchaseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Purchase
     */
    omit?: PurchaseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PurchaseInclude<ExtArgs> | null
    /**
     * The data needed to update a Purchase.
     */
    data: XOR<PurchaseUpdateInput, PurchaseUncheckedUpdateInput>
    /**
     * Choose, which Purchase to update.
     */
    where: PurchaseWhereUniqueInput
  }

  /**
   * Purchase updateMany
   */
  export type PurchaseUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Purchases.
     */
    data: XOR<PurchaseUpdateManyMutationInput, PurchaseUncheckedUpdateManyInput>
    /**
     * Filter which Purchases to update
     */
    where?: PurchaseWhereInput
    /**
     * Limit how many Purchases to update.
     */
    limit?: number
  }

  /**
   * Purchase upsert
   */
  export type PurchaseUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Purchase
     */
    select?: PurchaseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Purchase
     */
    omit?: PurchaseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PurchaseInclude<ExtArgs> | null
    /**
     * The filter to search for the Purchase to update in case it exists.
     */
    where: PurchaseWhereUniqueInput
    /**
     * In case the Purchase found by the `where` argument doesn't exist, create a new Purchase with this data.
     */
    create: XOR<PurchaseCreateInput, PurchaseUncheckedCreateInput>
    /**
     * In case the Purchase was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PurchaseUpdateInput, PurchaseUncheckedUpdateInput>
  }

  /**
   * Purchase delete
   */
  export type PurchaseDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Purchase
     */
    select?: PurchaseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Purchase
     */
    omit?: PurchaseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PurchaseInclude<ExtArgs> | null
    /**
     * Filter which Purchase to delete.
     */
    where: PurchaseWhereUniqueInput
  }

  /**
   * Purchase deleteMany
   */
  export type PurchaseDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Purchases to delete
     */
    where?: PurchaseWhereInput
    /**
     * Limit how many Purchases to delete.
     */
    limit?: number
  }

  /**
   * Purchase.supplier
   */
  export type Purchase$supplierArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Supplier
     */
    select?: SupplierSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Supplier
     */
    omit?: SupplierOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SupplierInclude<ExtArgs> | null
    where?: SupplierWhereInput
  }

  /**
   * Purchase.items
   */
  export type Purchase$itemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PurchaseItem
     */
    select?: PurchaseItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PurchaseItem
     */
    omit?: PurchaseItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PurchaseItemInclude<ExtArgs> | null
    where?: PurchaseItemWhereInput
    orderBy?: PurchaseItemOrderByWithRelationInput | PurchaseItemOrderByWithRelationInput[]
    cursor?: PurchaseItemWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PurchaseItemScalarFieldEnum | PurchaseItemScalarFieldEnum[]
  }

  /**
   * Purchase without action
   */
  export type PurchaseDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Purchase
     */
    select?: PurchaseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Purchase
     */
    omit?: PurchaseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PurchaseInclude<ExtArgs> | null
  }


  /**
   * Model PurchaseItem
   */

  export type AggregatePurchaseItem = {
    _count: PurchaseItemCountAggregateOutputType | null
    _avg: PurchaseItemAvgAggregateOutputType | null
    _sum: PurchaseItemSumAggregateOutputType | null
    _min: PurchaseItemMinAggregateOutputType | null
    _max: PurchaseItemMaxAggregateOutputType | null
  }

  export type PurchaseItemAvgAggregateOutputType = {
    id: number | null
    purchaseId: number | null
    productId: number | null
    quantity: number | null
    unitCost: Decimal | null
    lineTotal: Decimal | null
  }

  export type PurchaseItemSumAggregateOutputType = {
    id: number | null
    purchaseId: number | null
    productId: number | null
    quantity: number | null
    unitCost: Decimal | null
    lineTotal: Decimal | null
  }

  export type PurchaseItemMinAggregateOutputType = {
    id: number | null
    purchaseId: number | null
    productId: number | null
    quantity: number | null
    unitCost: Decimal | null
    lineTotal: Decimal | null
  }

  export type PurchaseItemMaxAggregateOutputType = {
    id: number | null
    purchaseId: number | null
    productId: number | null
    quantity: number | null
    unitCost: Decimal | null
    lineTotal: Decimal | null
  }

  export type PurchaseItemCountAggregateOutputType = {
    id: number
    purchaseId: number
    productId: number
    quantity: number
    unitCost: number
    lineTotal: number
    _all: number
  }


  export type PurchaseItemAvgAggregateInputType = {
    id?: true
    purchaseId?: true
    productId?: true
    quantity?: true
    unitCost?: true
    lineTotal?: true
  }

  export type PurchaseItemSumAggregateInputType = {
    id?: true
    purchaseId?: true
    productId?: true
    quantity?: true
    unitCost?: true
    lineTotal?: true
  }

  export type PurchaseItemMinAggregateInputType = {
    id?: true
    purchaseId?: true
    productId?: true
    quantity?: true
    unitCost?: true
    lineTotal?: true
  }

  export type PurchaseItemMaxAggregateInputType = {
    id?: true
    purchaseId?: true
    productId?: true
    quantity?: true
    unitCost?: true
    lineTotal?: true
  }

  export type PurchaseItemCountAggregateInputType = {
    id?: true
    purchaseId?: true
    productId?: true
    quantity?: true
    unitCost?: true
    lineTotal?: true
    _all?: true
  }

  export type PurchaseItemAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PurchaseItem to aggregate.
     */
    where?: PurchaseItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PurchaseItems to fetch.
     */
    orderBy?: PurchaseItemOrderByWithRelationInput | PurchaseItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PurchaseItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PurchaseItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PurchaseItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PurchaseItems
    **/
    _count?: true | PurchaseItemCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PurchaseItemAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PurchaseItemSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PurchaseItemMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PurchaseItemMaxAggregateInputType
  }

  export type GetPurchaseItemAggregateType<T extends PurchaseItemAggregateArgs> = {
        [P in keyof T & keyof AggregatePurchaseItem]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePurchaseItem[P]>
      : GetScalarType<T[P], AggregatePurchaseItem[P]>
  }




  export type PurchaseItemGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PurchaseItemWhereInput
    orderBy?: PurchaseItemOrderByWithAggregationInput | PurchaseItemOrderByWithAggregationInput[]
    by: PurchaseItemScalarFieldEnum[] | PurchaseItemScalarFieldEnum
    having?: PurchaseItemScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PurchaseItemCountAggregateInputType | true
    _avg?: PurchaseItemAvgAggregateInputType
    _sum?: PurchaseItemSumAggregateInputType
    _min?: PurchaseItemMinAggregateInputType
    _max?: PurchaseItemMaxAggregateInputType
  }

  export type PurchaseItemGroupByOutputType = {
    id: number
    purchaseId: number
    productId: number
    quantity: number
    unitCost: Decimal
    lineTotal: Decimal
    _count: PurchaseItemCountAggregateOutputType | null
    _avg: PurchaseItemAvgAggregateOutputType | null
    _sum: PurchaseItemSumAggregateOutputType | null
    _min: PurchaseItemMinAggregateOutputType | null
    _max: PurchaseItemMaxAggregateOutputType | null
  }

  type GetPurchaseItemGroupByPayload<T extends PurchaseItemGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PurchaseItemGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PurchaseItemGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PurchaseItemGroupByOutputType[P]>
            : GetScalarType<T[P], PurchaseItemGroupByOutputType[P]>
        }
      >
    >


  export type PurchaseItemSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    purchaseId?: boolean
    productId?: boolean
    quantity?: boolean
    unitCost?: boolean
    lineTotal?: boolean
    purchase?: boolean | PurchaseDefaultArgs<ExtArgs>
    product?: boolean | ProductDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["purchaseItem"]>



  export type PurchaseItemSelectScalar = {
    id?: boolean
    purchaseId?: boolean
    productId?: boolean
    quantity?: boolean
    unitCost?: boolean
    lineTotal?: boolean
  }

  export type PurchaseItemOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "purchaseId" | "productId" | "quantity" | "unitCost" | "lineTotal", ExtArgs["result"]["purchaseItem"]>
  export type PurchaseItemInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    purchase?: boolean | PurchaseDefaultArgs<ExtArgs>
    product?: boolean | ProductDefaultArgs<ExtArgs>
  }

  export type $PurchaseItemPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PurchaseItem"
    objects: {
      purchase: Prisma.$PurchasePayload<ExtArgs>
      product: Prisma.$ProductPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      purchaseId: number
      productId: number
      quantity: number
      unitCost: Prisma.Decimal
      lineTotal: Prisma.Decimal
    }, ExtArgs["result"]["purchaseItem"]>
    composites: {}
  }

  type PurchaseItemGetPayload<S extends boolean | null | undefined | PurchaseItemDefaultArgs> = $Result.GetResult<Prisma.$PurchaseItemPayload, S>

  type PurchaseItemCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PurchaseItemFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PurchaseItemCountAggregateInputType | true
    }

  export interface PurchaseItemDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PurchaseItem'], meta: { name: 'PurchaseItem' } }
    /**
     * Find zero or one PurchaseItem that matches the filter.
     * @param {PurchaseItemFindUniqueArgs} args - Arguments to find a PurchaseItem
     * @example
     * // Get one PurchaseItem
     * const purchaseItem = await prisma.purchaseItem.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PurchaseItemFindUniqueArgs>(args: SelectSubset<T, PurchaseItemFindUniqueArgs<ExtArgs>>): Prisma__PurchaseItemClient<$Result.GetResult<Prisma.$PurchaseItemPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one PurchaseItem that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PurchaseItemFindUniqueOrThrowArgs} args - Arguments to find a PurchaseItem
     * @example
     * // Get one PurchaseItem
     * const purchaseItem = await prisma.purchaseItem.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PurchaseItemFindUniqueOrThrowArgs>(args: SelectSubset<T, PurchaseItemFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PurchaseItemClient<$Result.GetResult<Prisma.$PurchaseItemPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PurchaseItem that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PurchaseItemFindFirstArgs} args - Arguments to find a PurchaseItem
     * @example
     * // Get one PurchaseItem
     * const purchaseItem = await prisma.purchaseItem.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PurchaseItemFindFirstArgs>(args?: SelectSubset<T, PurchaseItemFindFirstArgs<ExtArgs>>): Prisma__PurchaseItemClient<$Result.GetResult<Prisma.$PurchaseItemPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PurchaseItem that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PurchaseItemFindFirstOrThrowArgs} args - Arguments to find a PurchaseItem
     * @example
     * // Get one PurchaseItem
     * const purchaseItem = await prisma.purchaseItem.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PurchaseItemFindFirstOrThrowArgs>(args?: SelectSubset<T, PurchaseItemFindFirstOrThrowArgs<ExtArgs>>): Prisma__PurchaseItemClient<$Result.GetResult<Prisma.$PurchaseItemPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more PurchaseItems that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PurchaseItemFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PurchaseItems
     * const purchaseItems = await prisma.purchaseItem.findMany()
     * 
     * // Get first 10 PurchaseItems
     * const purchaseItems = await prisma.purchaseItem.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const purchaseItemWithIdOnly = await prisma.purchaseItem.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PurchaseItemFindManyArgs>(args?: SelectSubset<T, PurchaseItemFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PurchaseItemPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a PurchaseItem.
     * @param {PurchaseItemCreateArgs} args - Arguments to create a PurchaseItem.
     * @example
     * // Create one PurchaseItem
     * const PurchaseItem = await prisma.purchaseItem.create({
     *   data: {
     *     // ... data to create a PurchaseItem
     *   }
     * })
     * 
     */
    create<T extends PurchaseItemCreateArgs>(args: SelectSubset<T, PurchaseItemCreateArgs<ExtArgs>>): Prisma__PurchaseItemClient<$Result.GetResult<Prisma.$PurchaseItemPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many PurchaseItems.
     * @param {PurchaseItemCreateManyArgs} args - Arguments to create many PurchaseItems.
     * @example
     * // Create many PurchaseItems
     * const purchaseItem = await prisma.purchaseItem.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PurchaseItemCreateManyArgs>(args?: SelectSubset<T, PurchaseItemCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a PurchaseItem.
     * @param {PurchaseItemDeleteArgs} args - Arguments to delete one PurchaseItem.
     * @example
     * // Delete one PurchaseItem
     * const PurchaseItem = await prisma.purchaseItem.delete({
     *   where: {
     *     // ... filter to delete one PurchaseItem
     *   }
     * })
     * 
     */
    delete<T extends PurchaseItemDeleteArgs>(args: SelectSubset<T, PurchaseItemDeleteArgs<ExtArgs>>): Prisma__PurchaseItemClient<$Result.GetResult<Prisma.$PurchaseItemPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one PurchaseItem.
     * @param {PurchaseItemUpdateArgs} args - Arguments to update one PurchaseItem.
     * @example
     * // Update one PurchaseItem
     * const purchaseItem = await prisma.purchaseItem.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PurchaseItemUpdateArgs>(args: SelectSubset<T, PurchaseItemUpdateArgs<ExtArgs>>): Prisma__PurchaseItemClient<$Result.GetResult<Prisma.$PurchaseItemPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more PurchaseItems.
     * @param {PurchaseItemDeleteManyArgs} args - Arguments to filter PurchaseItems to delete.
     * @example
     * // Delete a few PurchaseItems
     * const { count } = await prisma.purchaseItem.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PurchaseItemDeleteManyArgs>(args?: SelectSubset<T, PurchaseItemDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PurchaseItems.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PurchaseItemUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PurchaseItems
     * const purchaseItem = await prisma.purchaseItem.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PurchaseItemUpdateManyArgs>(args: SelectSubset<T, PurchaseItemUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one PurchaseItem.
     * @param {PurchaseItemUpsertArgs} args - Arguments to update or create a PurchaseItem.
     * @example
     * // Update or create a PurchaseItem
     * const purchaseItem = await prisma.purchaseItem.upsert({
     *   create: {
     *     // ... data to create a PurchaseItem
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PurchaseItem we want to update
     *   }
     * })
     */
    upsert<T extends PurchaseItemUpsertArgs>(args: SelectSubset<T, PurchaseItemUpsertArgs<ExtArgs>>): Prisma__PurchaseItemClient<$Result.GetResult<Prisma.$PurchaseItemPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of PurchaseItems.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PurchaseItemCountArgs} args - Arguments to filter PurchaseItems to count.
     * @example
     * // Count the number of PurchaseItems
     * const count = await prisma.purchaseItem.count({
     *   where: {
     *     // ... the filter for the PurchaseItems we want to count
     *   }
     * })
    **/
    count<T extends PurchaseItemCountArgs>(
      args?: Subset<T, PurchaseItemCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PurchaseItemCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PurchaseItem.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PurchaseItemAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PurchaseItemAggregateArgs>(args: Subset<T, PurchaseItemAggregateArgs>): Prisma.PrismaPromise<GetPurchaseItemAggregateType<T>>

    /**
     * Group by PurchaseItem.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PurchaseItemGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PurchaseItemGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PurchaseItemGroupByArgs['orderBy'] }
        : { orderBy?: PurchaseItemGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PurchaseItemGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPurchaseItemGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PurchaseItem model
   */
  readonly fields: PurchaseItemFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PurchaseItem.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PurchaseItemClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    purchase<T extends PurchaseDefaultArgs<ExtArgs> = {}>(args?: Subset<T, PurchaseDefaultArgs<ExtArgs>>): Prisma__PurchaseClient<$Result.GetResult<Prisma.$PurchasePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    product<T extends ProductDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ProductDefaultArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the PurchaseItem model
   */
  interface PurchaseItemFieldRefs {
    readonly id: FieldRef<"PurchaseItem", 'Int'>
    readonly purchaseId: FieldRef<"PurchaseItem", 'Int'>
    readonly productId: FieldRef<"PurchaseItem", 'Int'>
    readonly quantity: FieldRef<"PurchaseItem", 'Int'>
    readonly unitCost: FieldRef<"PurchaseItem", 'Decimal'>
    readonly lineTotal: FieldRef<"PurchaseItem", 'Decimal'>
  }
    

  // Custom InputTypes
  /**
   * PurchaseItem findUnique
   */
  export type PurchaseItemFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PurchaseItem
     */
    select?: PurchaseItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PurchaseItem
     */
    omit?: PurchaseItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PurchaseItemInclude<ExtArgs> | null
    /**
     * Filter, which PurchaseItem to fetch.
     */
    where: PurchaseItemWhereUniqueInput
  }

  /**
   * PurchaseItem findUniqueOrThrow
   */
  export type PurchaseItemFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PurchaseItem
     */
    select?: PurchaseItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PurchaseItem
     */
    omit?: PurchaseItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PurchaseItemInclude<ExtArgs> | null
    /**
     * Filter, which PurchaseItem to fetch.
     */
    where: PurchaseItemWhereUniqueInput
  }

  /**
   * PurchaseItem findFirst
   */
  export type PurchaseItemFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PurchaseItem
     */
    select?: PurchaseItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PurchaseItem
     */
    omit?: PurchaseItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PurchaseItemInclude<ExtArgs> | null
    /**
     * Filter, which PurchaseItem to fetch.
     */
    where?: PurchaseItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PurchaseItems to fetch.
     */
    orderBy?: PurchaseItemOrderByWithRelationInput | PurchaseItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PurchaseItems.
     */
    cursor?: PurchaseItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PurchaseItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PurchaseItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PurchaseItems.
     */
    distinct?: PurchaseItemScalarFieldEnum | PurchaseItemScalarFieldEnum[]
  }

  /**
   * PurchaseItem findFirstOrThrow
   */
  export type PurchaseItemFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PurchaseItem
     */
    select?: PurchaseItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PurchaseItem
     */
    omit?: PurchaseItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PurchaseItemInclude<ExtArgs> | null
    /**
     * Filter, which PurchaseItem to fetch.
     */
    where?: PurchaseItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PurchaseItems to fetch.
     */
    orderBy?: PurchaseItemOrderByWithRelationInput | PurchaseItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PurchaseItems.
     */
    cursor?: PurchaseItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PurchaseItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PurchaseItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PurchaseItems.
     */
    distinct?: PurchaseItemScalarFieldEnum | PurchaseItemScalarFieldEnum[]
  }

  /**
   * PurchaseItem findMany
   */
  export type PurchaseItemFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PurchaseItem
     */
    select?: PurchaseItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PurchaseItem
     */
    omit?: PurchaseItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PurchaseItemInclude<ExtArgs> | null
    /**
     * Filter, which PurchaseItems to fetch.
     */
    where?: PurchaseItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PurchaseItems to fetch.
     */
    orderBy?: PurchaseItemOrderByWithRelationInput | PurchaseItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PurchaseItems.
     */
    cursor?: PurchaseItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PurchaseItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PurchaseItems.
     */
    skip?: number
    distinct?: PurchaseItemScalarFieldEnum | PurchaseItemScalarFieldEnum[]
  }

  /**
   * PurchaseItem create
   */
  export type PurchaseItemCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PurchaseItem
     */
    select?: PurchaseItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PurchaseItem
     */
    omit?: PurchaseItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PurchaseItemInclude<ExtArgs> | null
    /**
     * The data needed to create a PurchaseItem.
     */
    data: XOR<PurchaseItemCreateInput, PurchaseItemUncheckedCreateInput>
  }

  /**
   * PurchaseItem createMany
   */
  export type PurchaseItemCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PurchaseItems.
     */
    data: PurchaseItemCreateManyInput | PurchaseItemCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PurchaseItem update
   */
  export type PurchaseItemUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PurchaseItem
     */
    select?: PurchaseItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PurchaseItem
     */
    omit?: PurchaseItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PurchaseItemInclude<ExtArgs> | null
    /**
     * The data needed to update a PurchaseItem.
     */
    data: XOR<PurchaseItemUpdateInput, PurchaseItemUncheckedUpdateInput>
    /**
     * Choose, which PurchaseItem to update.
     */
    where: PurchaseItemWhereUniqueInput
  }

  /**
   * PurchaseItem updateMany
   */
  export type PurchaseItemUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PurchaseItems.
     */
    data: XOR<PurchaseItemUpdateManyMutationInput, PurchaseItemUncheckedUpdateManyInput>
    /**
     * Filter which PurchaseItems to update
     */
    where?: PurchaseItemWhereInput
    /**
     * Limit how many PurchaseItems to update.
     */
    limit?: number
  }

  /**
   * PurchaseItem upsert
   */
  export type PurchaseItemUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PurchaseItem
     */
    select?: PurchaseItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PurchaseItem
     */
    omit?: PurchaseItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PurchaseItemInclude<ExtArgs> | null
    /**
     * The filter to search for the PurchaseItem to update in case it exists.
     */
    where: PurchaseItemWhereUniqueInput
    /**
     * In case the PurchaseItem found by the `where` argument doesn't exist, create a new PurchaseItem with this data.
     */
    create: XOR<PurchaseItemCreateInput, PurchaseItemUncheckedCreateInput>
    /**
     * In case the PurchaseItem was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PurchaseItemUpdateInput, PurchaseItemUncheckedUpdateInput>
  }

  /**
   * PurchaseItem delete
   */
  export type PurchaseItemDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PurchaseItem
     */
    select?: PurchaseItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PurchaseItem
     */
    omit?: PurchaseItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PurchaseItemInclude<ExtArgs> | null
    /**
     * Filter which PurchaseItem to delete.
     */
    where: PurchaseItemWhereUniqueInput
  }

  /**
   * PurchaseItem deleteMany
   */
  export type PurchaseItemDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PurchaseItems to delete
     */
    where?: PurchaseItemWhereInput
    /**
     * Limit how many PurchaseItems to delete.
     */
    limit?: number
  }

  /**
   * PurchaseItem without action
   */
  export type PurchaseItemDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PurchaseItem
     */
    select?: PurchaseItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PurchaseItem
     */
    omit?: PurchaseItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PurchaseItemInclude<ExtArgs> | null
  }


  /**
   * Model Sale
   */

  export type AggregateSale = {
    _count: SaleCountAggregateOutputType | null
    _avg: SaleAvgAggregateOutputType | null
    _sum: SaleSumAggregateOutputType | null
    _min: SaleMinAggregateOutputType | null
    _max: SaleMaxAggregateOutputType | null
  }

  export type SaleAvgAggregateOutputType = {
    id: number | null
    customerId: number | null
    subtotal: Decimal | null
    discount: Decimal | null
    gstRate: Decimal | null
    gstAmount: Decimal | null
    total: Decimal | null
    urdOffset: Decimal | null
    paid: Decimal | null
    cashPaid: Decimal | null
    upiPaid: Decimal | null
    balance: Decimal | null
  }

  export type SaleSumAggregateOutputType = {
    id: number | null
    customerId: number | null
    subtotal: Decimal | null
    discount: Decimal | null
    gstRate: Decimal | null
    gstAmount: Decimal | null
    total: Decimal | null
    urdOffset: Decimal | null
    paid: Decimal | null
    cashPaid: Decimal | null
    upiPaid: Decimal | null
    balance: Decimal | null
  }

  export type SaleMinAggregateOutputType = {
    id: number | null
    invoiceNumber: string | null
    customerId: number | null
    saleDate: Date | null
    subtotal: Decimal | null
    discount: Decimal | null
    gstRate: Decimal | null
    gstAmount: Decimal | null
    total: Decimal | null
    urdOffset: Decimal | null
    paid: Decimal | null
    cashPaid: Decimal | null
    upiPaid: Decimal | null
    balance: Decimal | null
    paymentMethod: $Enums.PaymentMethod | null
    notes: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SaleMaxAggregateOutputType = {
    id: number | null
    invoiceNumber: string | null
    customerId: number | null
    saleDate: Date | null
    subtotal: Decimal | null
    discount: Decimal | null
    gstRate: Decimal | null
    gstAmount: Decimal | null
    total: Decimal | null
    urdOffset: Decimal | null
    paid: Decimal | null
    cashPaid: Decimal | null
    upiPaid: Decimal | null
    balance: Decimal | null
    paymentMethod: $Enums.PaymentMethod | null
    notes: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SaleCountAggregateOutputType = {
    id: number
    invoiceNumber: number
    customerId: number
    saleDate: number
    subtotal: number
    discount: number
    gstRate: number
    gstAmount: number
    total: number
    urdOffset: number
    paid: number
    cashPaid: number
    upiPaid: number
    balance: number
    paymentMethod: number
    notes: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type SaleAvgAggregateInputType = {
    id?: true
    customerId?: true
    subtotal?: true
    discount?: true
    gstRate?: true
    gstAmount?: true
    total?: true
    urdOffset?: true
    paid?: true
    cashPaid?: true
    upiPaid?: true
    balance?: true
  }

  export type SaleSumAggregateInputType = {
    id?: true
    customerId?: true
    subtotal?: true
    discount?: true
    gstRate?: true
    gstAmount?: true
    total?: true
    urdOffset?: true
    paid?: true
    cashPaid?: true
    upiPaid?: true
    balance?: true
  }

  export type SaleMinAggregateInputType = {
    id?: true
    invoiceNumber?: true
    customerId?: true
    saleDate?: true
    subtotal?: true
    discount?: true
    gstRate?: true
    gstAmount?: true
    total?: true
    urdOffset?: true
    paid?: true
    cashPaid?: true
    upiPaid?: true
    balance?: true
    paymentMethod?: true
    notes?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SaleMaxAggregateInputType = {
    id?: true
    invoiceNumber?: true
    customerId?: true
    saleDate?: true
    subtotal?: true
    discount?: true
    gstRate?: true
    gstAmount?: true
    total?: true
    urdOffset?: true
    paid?: true
    cashPaid?: true
    upiPaid?: true
    balance?: true
    paymentMethod?: true
    notes?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SaleCountAggregateInputType = {
    id?: true
    invoiceNumber?: true
    customerId?: true
    saleDate?: true
    subtotal?: true
    discount?: true
    gstRate?: true
    gstAmount?: true
    total?: true
    urdOffset?: true
    paid?: true
    cashPaid?: true
    upiPaid?: true
    balance?: true
    paymentMethod?: true
    notes?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type SaleAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Sale to aggregate.
     */
    where?: SaleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sales to fetch.
     */
    orderBy?: SaleOrderByWithRelationInput | SaleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SaleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sales from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sales.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Sales
    **/
    _count?: true | SaleCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: SaleAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: SaleSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SaleMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SaleMaxAggregateInputType
  }

  export type GetSaleAggregateType<T extends SaleAggregateArgs> = {
        [P in keyof T & keyof AggregateSale]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSale[P]>
      : GetScalarType<T[P], AggregateSale[P]>
  }




  export type SaleGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SaleWhereInput
    orderBy?: SaleOrderByWithAggregationInput | SaleOrderByWithAggregationInput[]
    by: SaleScalarFieldEnum[] | SaleScalarFieldEnum
    having?: SaleScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SaleCountAggregateInputType | true
    _avg?: SaleAvgAggregateInputType
    _sum?: SaleSumAggregateInputType
    _min?: SaleMinAggregateInputType
    _max?: SaleMaxAggregateInputType
  }

  export type SaleGroupByOutputType = {
    id: number
    invoiceNumber: string
    customerId: number | null
    saleDate: Date
    subtotal: Decimal
    discount: Decimal
    gstRate: Decimal
    gstAmount: Decimal
    total: Decimal
    urdOffset: Decimal
    paid: Decimal
    cashPaid: Decimal
    upiPaid: Decimal
    balance: Decimal
    paymentMethod: $Enums.PaymentMethod
    notes: string | null
    createdAt: Date
    updatedAt: Date
    _count: SaleCountAggregateOutputType | null
    _avg: SaleAvgAggregateOutputType | null
    _sum: SaleSumAggregateOutputType | null
    _min: SaleMinAggregateOutputType | null
    _max: SaleMaxAggregateOutputType | null
  }

  type GetSaleGroupByPayload<T extends SaleGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SaleGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SaleGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SaleGroupByOutputType[P]>
            : GetScalarType<T[P], SaleGroupByOutputType[P]>
        }
      >
    >


  export type SaleSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    invoiceNumber?: boolean
    customerId?: boolean
    saleDate?: boolean
    subtotal?: boolean
    discount?: boolean
    gstRate?: boolean
    gstAmount?: boolean
    total?: boolean
    urdOffset?: boolean
    paid?: boolean
    cashPaid?: boolean
    upiPaid?: boolean
    balance?: boolean
    paymentMethod?: boolean
    notes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    customer?: boolean | Sale$customerArgs<ExtArgs>
    items?: boolean | Sale$itemsArgs<ExtArgs>
    ledgerEntries?: boolean | Sale$ledgerEntriesArgs<ExtArgs>
    urdPurchase?: boolean | Sale$urdPurchaseArgs<ExtArgs>
    _count?: boolean | SaleCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["sale"]>



  export type SaleSelectScalar = {
    id?: boolean
    invoiceNumber?: boolean
    customerId?: boolean
    saleDate?: boolean
    subtotal?: boolean
    discount?: boolean
    gstRate?: boolean
    gstAmount?: boolean
    total?: boolean
    urdOffset?: boolean
    paid?: boolean
    cashPaid?: boolean
    upiPaid?: boolean
    balance?: boolean
    paymentMethod?: boolean
    notes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type SaleOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "invoiceNumber" | "customerId" | "saleDate" | "subtotal" | "discount" | "gstRate" | "gstAmount" | "total" | "urdOffset" | "paid" | "cashPaid" | "upiPaid" | "balance" | "paymentMethod" | "notes" | "createdAt" | "updatedAt", ExtArgs["result"]["sale"]>
  export type SaleInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    customer?: boolean | Sale$customerArgs<ExtArgs>
    items?: boolean | Sale$itemsArgs<ExtArgs>
    ledgerEntries?: boolean | Sale$ledgerEntriesArgs<ExtArgs>
    urdPurchase?: boolean | Sale$urdPurchaseArgs<ExtArgs>
    _count?: boolean | SaleCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $SalePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Sale"
    objects: {
      customer: Prisma.$CustomerPayload<ExtArgs> | null
      items: Prisma.$SaleItemPayload<ExtArgs>[]
      ledgerEntries: Prisma.$CustomerLedgerPayload<ExtArgs>[]
      urdPurchase: Prisma.$UrdPurchasePayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      invoiceNumber: string
      customerId: number | null
      saleDate: Date
      subtotal: Prisma.Decimal
      discount: Prisma.Decimal
      gstRate: Prisma.Decimal
      gstAmount: Prisma.Decimal
      total: Prisma.Decimal
      urdOffset: Prisma.Decimal
      paid: Prisma.Decimal
      cashPaid: Prisma.Decimal
      upiPaid: Prisma.Decimal
      balance: Prisma.Decimal
      paymentMethod: $Enums.PaymentMethod
      notes: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["sale"]>
    composites: {}
  }

  type SaleGetPayload<S extends boolean | null | undefined | SaleDefaultArgs> = $Result.GetResult<Prisma.$SalePayload, S>

  type SaleCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SaleFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SaleCountAggregateInputType | true
    }

  export interface SaleDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Sale'], meta: { name: 'Sale' } }
    /**
     * Find zero or one Sale that matches the filter.
     * @param {SaleFindUniqueArgs} args - Arguments to find a Sale
     * @example
     * // Get one Sale
     * const sale = await prisma.sale.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SaleFindUniqueArgs>(args: SelectSubset<T, SaleFindUniqueArgs<ExtArgs>>): Prisma__SaleClient<$Result.GetResult<Prisma.$SalePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Sale that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SaleFindUniqueOrThrowArgs} args - Arguments to find a Sale
     * @example
     * // Get one Sale
     * const sale = await prisma.sale.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SaleFindUniqueOrThrowArgs>(args: SelectSubset<T, SaleFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SaleClient<$Result.GetResult<Prisma.$SalePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Sale that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SaleFindFirstArgs} args - Arguments to find a Sale
     * @example
     * // Get one Sale
     * const sale = await prisma.sale.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SaleFindFirstArgs>(args?: SelectSubset<T, SaleFindFirstArgs<ExtArgs>>): Prisma__SaleClient<$Result.GetResult<Prisma.$SalePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Sale that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SaleFindFirstOrThrowArgs} args - Arguments to find a Sale
     * @example
     * // Get one Sale
     * const sale = await prisma.sale.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SaleFindFirstOrThrowArgs>(args?: SelectSubset<T, SaleFindFirstOrThrowArgs<ExtArgs>>): Prisma__SaleClient<$Result.GetResult<Prisma.$SalePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Sales that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SaleFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Sales
     * const sales = await prisma.sale.findMany()
     * 
     * // Get first 10 Sales
     * const sales = await prisma.sale.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const saleWithIdOnly = await prisma.sale.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SaleFindManyArgs>(args?: SelectSubset<T, SaleFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SalePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Sale.
     * @param {SaleCreateArgs} args - Arguments to create a Sale.
     * @example
     * // Create one Sale
     * const Sale = await prisma.sale.create({
     *   data: {
     *     // ... data to create a Sale
     *   }
     * })
     * 
     */
    create<T extends SaleCreateArgs>(args: SelectSubset<T, SaleCreateArgs<ExtArgs>>): Prisma__SaleClient<$Result.GetResult<Prisma.$SalePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Sales.
     * @param {SaleCreateManyArgs} args - Arguments to create many Sales.
     * @example
     * // Create many Sales
     * const sale = await prisma.sale.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SaleCreateManyArgs>(args?: SelectSubset<T, SaleCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Sale.
     * @param {SaleDeleteArgs} args - Arguments to delete one Sale.
     * @example
     * // Delete one Sale
     * const Sale = await prisma.sale.delete({
     *   where: {
     *     // ... filter to delete one Sale
     *   }
     * })
     * 
     */
    delete<T extends SaleDeleteArgs>(args: SelectSubset<T, SaleDeleteArgs<ExtArgs>>): Prisma__SaleClient<$Result.GetResult<Prisma.$SalePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Sale.
     * @param {SaleUpdateArgs} args - Arguments to update one Sale.
     * @example
     * // Update one Sale
     * const sale = await prisma.sale.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SaleUpdateArgs>(args: SelectSubset<T, SaleUpdateArgs<ExtArgs>>): Prisma__SaleClient<$Result.GetResult<Prisma.$SalePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Sales.
     * @param {SaleDeleteManyArgs} args - Arguments to filter Sales to delete.
     * @example
     * // Delete a few Sales
     * const { count } = await prisma.sale.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SaleDeleteManyArgs>(args?: SelectSubset<T, SaleDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Sales.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SaleUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Sales
     * const sale = await prisma.sale.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SaleUpdateManyArgs>(args: SelectSubset<T, SaleUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Sale.
     * @param {SaleUpsertArgs} args - Arguments to update or create a Sale.
     * @example
     * // Update or create a Sale
     * const sale = await prisma.sale.upsert({
     *   create: {
     *     // ... data to create a Sale
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Sale we want to update
     *   }
     * })
     */
    upsert<T extends SaleUpsertArgs>(args: SelectSubset<T, SaleUpsertArgs<ExtArgs>>): Prisma__SaleClient<$Result.GetResult<Prisma.$SalePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Sales.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SaleCountArgs} args - Arguments to filter Sales to count.
     * @example
     * // Count the number of Sales
     * const count = await prisma.sale.count({
     *   where: {
     *     // ... the filter for the Sales we want to count
     *   }
     * })
    **/
    count<T extends SaleCountArgs>(
      args?: Subset<T, SaleCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SaleCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Sale.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SaleAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SaleAggregateArgs>(args: Subset<T, SaleAggregateArgs>): Prisma.PrismaPromise<GetSaleAggregateType<T>>

    /**
     * Group by Sale.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SaleGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SaleGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SaleGroupByArgs['orderBy'] }
        : { orderBy?: SaleGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SaleGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSaleGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Sale model
   */
  readonly fields: SaleFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Sale.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SaleClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    customer<T extends Sale$customerArgs<ExtArgs> = {}>(args?: Subset<T, Sale$customerArgs<ExtArgs>>): Prisma__CustomerClient<$Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    items<T extends Sale$itemsArgs<ExtArgs> = {}>(args?: Subset<T, Sale$itemsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SaleItemPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    ledgerEntries<T extends Sale$ledgerEntriesArgs<ExtArgs> = {}>(args?: Subset<T, Sale$ledgerEntriesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CustomerLedgerPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    urdPurchase<T extends Sale$urdPurchaseArgs<ExtArgs> = {}>(args?: Subset<T, Sale$urdPurchaseArgs<ExtArgs>>): Prisma__UrdPurchaseClient<$Result.GetResult<Prisma.$UrdPurchasePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Sale model
   */
  interface SaleFieldRefs {
    readonly id: FieldRef<"Sale", 'Int'>
    readonly invoiceNumber: FieldRef<"Sale", 'String'>
    readonly customerId: FieldRef<"Sale", 'Int'>
    readonly saleDate: FieldRef<"Sale", 'DateTime'>
    readonly subtotal: FieldRef<"Sale", 'Decimal'>
    readonly discount: FieldRef<"Sale", 'Decimal'>
    readonly gstRate: FieldRef<"Sale", 'Decimal'>
    readonly gstAmount: FieldRef<"Sale", 'Decimal'>
    readonly total: FieldRef<"Sale", 'Decimal'>
    readonly urdOffset: FieldRef<"Sale", 'Decimal'>
    readonly paid: FieldRef<"Sale", 'Decimal'>
    readonly cashPaid: FieldRef<"Sale", 'Decimal'>
    readonly upiPaid: FieldRef<"Sale", 'Decimal'>
    readonly balance: FieldRef<"Sale", 'Decimal'>
    readonly paymentMethod: FieldRef<"Sale", 'PaymentMethod'>
    readonly notes: FieldRef<"Sale", 'String'>
    readonly createdAt: FieldRef<"Sale", 'DateTime'>
    readonly updatedAt: FieldRef<"Sale", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Sale findUnique
   */
  export type SaleFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Sale
     */
    select?: SaleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Sale
     */
    omit?: SaleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SaleInclude<ExtArgs> | null
    /**
     * Filter, which Sale to fetch.
     */
    where: SaleWhereUniqueInput
  }

  /**
   * Sale findUniqueOrThrow
   */
  export type SaleFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Sale
     */
    select?: SaleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Sale
     */
    omit?: SaleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SaleInclude<ExtArgs> | null
    /**
     * Filter, which Sale to fetch.
     */
    where: SaleWhereUniqueInput
  }

  /**
   * Sale findFirst
   */
  export type SaleFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Sale
     */
    select?: SaleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Sale
     */
    omit?: SaleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SaleInclude<ExtArgs> | null
    /**
     * Filter, which Sale to fetch.
     */
    where?: SaleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sales to fetch.
     */
    orderBy?: SaleOrderByWithRelationInput | SaleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Sales.
     */
    cursor?: SaleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sales from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sales.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Sales.
     */
    distinct?: SaleScalarFieldEnum | SaleScalarFieldEnum[]
  }

  /**
   * Sale findFirstOrThrow
   */
  export type SaleFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Sale
     */
    select?: SaleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Sale
     */
    omit?: SaleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SaleInclude<ExtArgs> | null
    /**
     * Filter, which Sale to fetch.
     */
    where?: SaleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sales to fetch.
     */
    orderBy?: SaleOrderByWithRelationInput | SaleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Sales.
     */
    cursor?: SaleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sales from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sales.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Sales.
     */
    distinct?: SaleScalarFieldEnum | SaleScalarFieldEnum[]
  }

  /**
   * Sale findMany
   */
  export type SaleFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Sale
     */
    select?: SaleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Sale
     */
    omit?: SaleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SaleInclude<ExtArgs> | null
    /**
     * Filter, which Sales to fetch.
     */
    where?: SaleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sales to fetch.
     */
    orderBy?: SaleOrderByWithRelationInput | SaleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Sales.
     */
    cursor?: SaleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sales from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sales.
     */
    skip?: number
    distinct?: SaleScalarFieldEnum | SaleScalarFieldEnum[]
  }

  /**
   * Sale create
   */
  export type SaleCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Sale
     */
    select?: SaleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Sale
     */
    omit?: SaleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SaleInclude<ExtArgs> | null
    /**
     * The data needed to create a Sale.
     */
    data: XOR<SaleCreateInput, SaleUncheckedCreateInput>
  }

  /**
   * Sale createMany
   */
  export type SaleCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Sales.
     */
    data: SaleCreateManyInput | SaleCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Sale update
   */
  export type SaleUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Sale
     */
    select?: SaleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Sale
     */
    omit?: SaleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SaleInclude<ExtArgs> | null
    /**
     * The data needed to update a Sale.
     */
    data: XOR<SaleUpdateInput, SaleUncheckedUpdateInput>
    /**
     * Choose, which Sale to update.
     */
    where: SaleWhereUniqueInput
  }

  /**
   * Sale updateMany
   */
  export type SaleUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Sales.
     */
    data: XOR<SaleUpdateManyMutationInput, SaleUncheckedUpdateManyInput>
    /**
     * Filter which Sales to update
     */
    where?: SaleWhereInput
    /**
     * Limit how many Sales to update.
     */
    limit?: number
  }

  /**
   * Sale upsert
   */
  export type SaleUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Sale
     */
    select?: SaleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Sale
     */
    omit?: SaleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SaleInclude<ExtArgs> | null
    /**
     * The filter to search for the Sale to update in case it exists.
     */
    where: SaleWhereUniqueInput
    /**
     * In case the Sale found by the `where` argument doesn't exist, create a new Sale with this data.
     */
    create: XOR<SaleCreateInput, SaleUncheckedCreateInput>
    /**
     * In case the Sale was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SaleUpdateInput, SaleUncheckedUpdateInput>
  }

  /**
   * Sale delete
   */
  export type SaleDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Sale
     */
    select?: SaleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Sale
     */
    omit?: SaleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SaleInclude<ExtArgs> | null
    /**
     * Filter which Sale to delete.
     */
    where: SaleWhereUniqueInput
  }

  /**
   * Sale deleteMany
   */
  export type SaleDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Sales to delete
     */
    where?: SaleWhereInput
    /**
     * Limit how many Sales to delete.
     */
    limit?: number
  }

  /**
   * Sale.customer
   */
  export type Sale$customerArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Customer
     */
    select?: CustomerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Customer
     */
    omit?: CustomerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerInclude<ExtArgs> | null
    where?: CustomerWhereInput
  }

  /**
   * Sale.items
   */
  export type Sale$itemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SaleItem
     */
    select?: SaleItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SaleItem
     */
    omit?: SaleItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SaleItemInclude<ExtArgs> | null
    where?: SaleItemWhereInput
    orderBy?: SaleItemOrderByWithRelationInput | SaleItemOrderByWithRelationInput[]
    cursor?: SaleItemWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SaleItemScalarFieldEnum | SaleItemScalarFieldEnum[]
  }

  /**
   * Sale.ledgerEntries
   */
  export type Sale$ledgerEntriesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomerLedger
     */
    select?: CustomerLedgerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CustomerLedger
     */
    omit?: CustomerLedgerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerLedgerInclude<ExtArgs> | null
    where?: CustomerLedgerWhereInput
    orderBy?: CustomerLedgerOrderByWithRelationInput | CustomerLedgerOrderByWithRelationInput[]
    cursor?: CustomerLedgerWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CustomerLedgerScalarFieldEnum | CustomerLedgerScalarFieldEnum[]
  }

  /**
   * Sale.urdPurchase
   */
  export type Sale$urdPurchaseArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UrdPurchase
     */
    select?: UrdPurchaseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UrdPurchase
     */
    omit?: UrdPurchaseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UrdPurchaseInclude<ExtArgs> | null
    where?: UrdPurchaseWhereInput
  }

  /**
   * Sale without action
   */
  export type SaleDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Sale
     */
    select?: SaleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Sale
     */
    omit?: SaleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SaleInclude<ExtArgs> | null
  }


  /**
   * Model SaleItem
   */

  export type AggregateSaleItem = {
    _count: SaleItemCountAggregateOutputType | null
    _avg: SaleItemAvgAggregateOutputType | null
    _sum: SaleItemSumAggregateOutputType | null
    _min: SaleItemMinAggregateOutputType | null
    _max: SaleItemMaxAggregateOutputType | null
  }

  export type SaleItemAvgAggregateOutputType = {
    id: number | null
    saleId: number | null
    productId: number | null
    quantity: number | null
    weight: Decimal | null
    unitPrice: Decimal | null
    metalRate: Decimal | null
    metalAmount: Decimal | null
    makingCharge: Decimal | null
    makingChargeValue: Decimal | null
    taxableAmount: Decimal | null
    lineTotal: Decimal | null
  }

  export type SaleItemSumAggregateOutputType = {
    id: number | null
    saleId: number | null
    productId: number | null
    quantity: number | null
    weight: Decimal | null
    unitPrice: Decimal | null
    metalRate: Decimal | null
    metalAmount: Decimal | null
    makingCharge: Decimal | null
    makingChargeValue: Decimal | null
    taxableAmount: Decimal | null
    lineTotal: Decimal | null
  }

  export type SaleItemMinAggregateOutputType = {
    id: number | null
    saleId: number | null
    productId: number | null
    quantity: number | null
    weight: Decimal | null
    unitPrice: Decimal | null
    metalRate: Decimal | null
    metalAmount: Decimal | null
    makingCharge: Decimal | null
    makingChargeType: $Enums.MakingChargeType | null
    makingChargeValue: Decimal | null
    taxableAmount: Decimal | null
    lineTotal: Decimal | null
  }

  export type SaleItemMaxAggregateOutputType = {
    id: number | null
    saleId: number | null
    productId: number | null
    quantity: number | null
    weight: Decimal | null
    unitPrice: Decimal | null
    metalRate: Decimal | null
    metalAmount: Decimal | null
    makingCharge: Decimal | null
    makingChargeType: $Enums.MakingChargeType | null
    makingChargeValue: Decimal | null
    taxableAmount: Decimal | null
    lineTotal: Decimal | null
  }

  export type SaleItemCountAggregateOutputType = {
    id: number
    saleId: number
    productId: number
    quantity: number
    weight: number
    unitPrice: number
    metalRate: number
    metalAmount: number
    makingCharge: number
    makingChargeType: number
    makingChargeValue: number
    taxableAmount: number
    lineTotal: number
    _all: number
  }


  export type SaleItemAvgAggregateInputType = {
    id?: true
    saleId?: true
    productId?: true
    quantity?: true
    weight?: true
    unitPrice?: true
    metalRate?: true
    metalAmount?: true
    makingCharge?: true
    makingChargeValue?: true
    taxableAmount?: true
    lineTotal?: true
  }

  export type SaleItemSumAggregateInputType = {
    id?: true
    saleId?: true
    productId?: true
    quantity?: true
    weight?: true
    unitPrice?: true
    metalRate?: true
    metalAmount?: true
    makingCharge?: true
    makingChargeValue?: true
    taxableAmount?: true
    lineTotal?: true
  }

  export type SaleItemMinAggregateInputType = {
    id?: true
    saleId?: true
    productId?: true
    quantity?: true
    weight?: true
    unitPrice?: true
    metalRate?: true
    metalAmount?: true
    makingCharge?: true
    makingChargeType?: true
    makingChargeValue?: true
    taxableAmount?: true
    lineTotal?: true
  }

  export type SaleItemMaxAggregateInputType = {
    id?: true
    saleId?: true
    productId?: true
    quantity?: true
    weight?: true
    unitPrice?: true
    metalRate?: true
    metalAmount?: true
    makingCharge?: true
    makingChargeType?: true
    makingChargeValue?: true
    taxableAmount?: true
    lineTotal?: true
  }

  export type SaleItemCountAggregateInputType = {
    id?: true
    saleId?: true
    productId?: true
    quantity?: true
    weight?: true
    unitPrice?: true
    metalRate?: true
    metalAmount?: true
    makingCharge?: true
    makingChargeType?: true
    makingChargeValue?: true
    taxableAmount?: true
    lineTotal?: true
    _all?: true
  }

  export type SaleItemAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SaleItem to aggregate.
     */
    where?: SaleItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SaleItems to fetch.
     */
    orderBy?: SaleItemOrderByWithRelationInput | SaleItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SaleItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SaleItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SaleItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned SaleItems
    **/
    _count?: true | SaleItemCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: SaleItemAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: SaleItemSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SaleItemMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SaleItemMaxAggregateInputType
  }

  export type GetSaleItemAggregateType<T extends SaleItemAggregateArgs> = {
        [P in keyof T & keyof AggregateSaleItem]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSaleItem[P]>
      : GetScalarType<T[P], AggregateSaleItem[P]>
  }




  export type SaleItemGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SaleItemWhereInput
    orderBy?: SaleItemOrderByWithAggregationInput | SaleItemOrderByWithAggregationInput[]
    by: SaleItemScalarFieldEnum[] | SaleItemScalarFieldEnum
    having?: SaleItemScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SaleItemCountAggregateInputType | true
    _avg?: SaleItemAvgAggregateInputType
    _sum?: SaleItemSumAggregateInputType
    _min?: SaleItemMinAggregateInputType
    _max?: SaleItemMaxAggregateInputType
  }

  export type SaleItemGroupByOutputType = {
    id: number
    saleId: number
    productId: number
    quantity: number
    weight: Decimal
    unitPrice: Decimal
    metalRate: Decimal
    metalAmount: Decimal
    makingCharge: Decimal
    makingChargeType: $Enums.MakingChargeType
    makingChargeValue: Decimal
    taxableAmount: Decimal
    lineTotal: Decimal
    _count: SaleItemCountAggregateOutputType | null
    _avg: SaleItemAvgAggregateOutputType | null
    _sum: SaleItemSumAggregateOutputType | null
    _min: SaleItemMinAggregateOutputType | null
    _max: SaleItemMaxAggregateOutputType | null
  }

  type GetSaleItemGroupByPayload<T extends SaleItemGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SaleItemGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SaleItemGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SaleItemGroupByOutputType[P]>
            : GetScalarType<T[P], SaleItemGroupByOutputType[P]>
        }
      >
    >


  export type SaleItemSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    saleId?: boolean
    productId?: boolean
    quantity?: boolean
    weight?: boolean
    unitPrice?: boolean
    metalRate?: boolean
    metalAmount?: boolean
    makingCharge?: boolean
    makingChargeType?: boolean
    makingChargeValue?: boolean
    taxableAmount?: boolean
    lineTotal?: boolean
    sale?: boolean | SaleDefaultArgs<ExtArgs>
    product?: boolean | ProductDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["saleItem"]>



  export type SaleItemSelectScalar = {
    id?: boolean
    saleId?: boolean
    productId?: boolean
    quantity?: boolean
    weight?: boolean
    unitPrice?: boolean
    metalRate?: boolean
    metalAmount?: boolean
    makingCharge?: boolean
    makingChargeType?: boolean
    makingChargeValue?: boolean
    taxableAmount?: boolean
    lineTotal?: boolean
  }

  export type SaleItemOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "saleId" | "productId" | "quantity" | "weight" | "unitPrice" | "metalRate" | "metalAmount" | "makingCharge" | "makingChargeType" | "makingChargeValue" | "taxableAmount" | "lineTotal", ExtArgs["result"]["saleItem"]>
  export type SaleItemInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    sale?: boolean | SaleDefaultArgs<ExtArgs>
    product?: boolean | ProductDefaultArgs<ExtArgs>
  }

  export type $SaleItemPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "SaleItem"
    objects: {
      sale: Prisma.$SalePayload<ExtArgs>
      product: Prisma.$ProductPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      saleId: number
      productId: number
      quantity: number
      weight: Prisma.Decimal
      unitPrice: Prisma.Decimal
      metalRate: Prisma.Decimal
      metalAmount: Prisma.Decimal
      makingCharge: Prisma.Decimal
      makingChargeType: $Enums.MakingChargeType
      makingChargeValue: Prisma.Decimal
      taxableAmount: Prisma.Decimal
      lineTotal: Prisma.Decimal
    }, ExtArgs["result"]["saleItem"]>
    composites: {}
  }

  type SaleItemGetPayload<S extends boolean | null | undefined | SaleItemDefaultArgs> = $Result.GetResult<Prisma.$SaleItemPayload, S>

  type SaleItemCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SaleItemFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SaleItemCountAggregateInputType | true
    }

  export interface SaleItemDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['SaleItem'], meta: { name: 'SaleItem' } }
    /**
     * Find zero or one SaleItem that matches the filter.
     * @param {SaleItemFindUniqueArgs} args - Arguments to find a SaleItem
     * @example
     * // Get one SaleItem
     * const saleItem = await prisma.saleItem.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SaleItemFindUniqueArgs>(args: SelectSubset<T, SaleItemFindUniqueArgs<ExtArgs>>): Prisma__SaleItemClient<$Result.GetResult<Prisma.$SaleItemPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one SaleItem that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SaleItemFindUniqueOrThrowArgs} args - Arguments to find a SaleItem
     * @example
     * // Get one SaleItem
     * const saleItem = await prisma.saleItem.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SaleItemFindUniqueOrThrowArgs>(args: SelectSubset<T, SaleItemFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SaleItemClient<$Result.GetResult<Prisma.$SaleItemPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SaleItem that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SaleItemFindFirstArgs} args - Arguments to find a SaleItem
     * @example
     * // Get one SaleItem
     * const saleItem = await prisma.saleItem.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SaleItemFindFirstArgs>(args?: SelectSubset<T, SaleItemFindFirstArgs<ExtArgs>>): Prisma__SaleItemClient<$Result.GetResult<Prisma.$SaleItemPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SaleItem that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SaleItemFindFirstOrThrowArgs} args - Arguments to find a SaleItem
     * @example
     * // Get one SaleItem
     * const saleItem = await prisma.saleItem.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SaleItemFindFirstOrThrowArgs>(args?: SelectSubset<T, SaleItemFindFirstOrThrowArgs<ExtArgs>>): Prisma__SaleItemClient<$Result.GetResult<Prisma.$SaleItemPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more SaleItems that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SaleItemFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SaleItems
     * const saleItems = await prisma.saleItem.findMany()
     * 
     * // Get first 10 SaleItems
     * const saleItems = await prisma.saleItem.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const saleItemWithIdOnly = await prisma.saleItem.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SaleItemFindManyArgs>(args?: SelectSubset<T, SaleItemFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SaleItemPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a SaleItem.
     * @param {SaleItemCreateArgs} args - Arguments to create a SaleItem.
     * @example
     * // Create one SaleItem
     * const SaleItem = await prisma.saleItem.create({
     *   data: {
     *     // ... data to create a SaleItem
     *   }
     * })
     * 
     */
    create<T extends SaleItemCreateArgs>(args: SelectSubset<T, SaleItemCreateArgs<ExtArgs>>): Prisma__SaleItemClient<$Result.GetResult<Prisma.$SaleItemPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many SaleItems.
     * @param {SaleItemCreateManyArgs} args - Arguments to create many SaleItems.
     * @example
     * // Create many SaleItems
     * const saleItem = await prisma.saleItem.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SaleItemCreateManyArgs>(args?: SelectSubset<T, SaleItemCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a SaleItem.
     * @param {SaleItemDeleteArgs} args - Arguments to delete one SaleItem.
     * @example
     * // Delete one SaleItem
     * const SaleItem = await prisma.saleItem.delete({
     *   where: {
     *     // ... filter to delete one SaleItem
     *   }
     * })
     * 
     */
    delete<T extends SaleItemDeleteArgs>(args: SelectSubset<T, SaleItemDeleteArgs<ExtArgs>>): Prisma__SaleItemClient<$Result.GetResult<Prisma.$SaleItemPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one SaleItem.
     * @param {SaleItemUpdateArgs} args - Arguments to update one SaleItem.
     * @example
     * // Update one SaleItem
     * const saleItem = await prisma.saleItem.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SaleItemUpdateArgs>(args: SelectSubset<T, SaleItemUpdateArgs<ExtArgs>>): Prisma__SaleItemClient<$Result.GetResult<Prisma.$SaleItemPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more SaleItems.
     * @param {SaleItemDeleteManyArgs} args - Arguments to filter SaleItems to delete.
     * @example
     * // Delete a few SaleItems
     * const { count } = await prisma.saleItem.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SaleItemDeleteManyArgs>(args?: SelectSubset<T, SaleItemDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SaleItems.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SaleItemUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SaleItems
     * const saleItem = await prisma.saleItem.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SaleItemUpdateManyArgs>(args: SelectSubset<T, SaleItemUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one SaleItem.
     * @param {SaleItemUpsertArgs} args - Arguments to update or create a SaleItem.
     * @example
     * // Update or create a SaleItem
     * const saleItem = await prisma.saleItem.upsert({
     *   create: {
     *     // ... data to create a SaleItem
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SaleItem we want to update
     *   }
     * })
     */
    upsert<T extends SaleItemUpsertArgs>(args: SelectSubset<T, SaleItemUpsertArgs<ExtArgs>>): Prisma__SaleItemClient<$Result.GetResult<Prisma.$SaleItemPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of SaleItems.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SaleItemCountArgs} args - Arguments to filter SaleItems to count.
     * @example
     * // Count the number of SaleItems
     * const count = await prisma.saleItem.count({
     *   where: {
     *     // ... the filter for the SaleItems we want to count
     *   }
     * })
    **/
    count<T extends SaleItemCountArgs>(
      args?: Subset<T, SaleItemCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SaleItemCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SaleItem.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SaleItemAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SaleItemAggregateArgs>(args: Subset<T, SaleItemAggregateArgs>): Prisma.PrismaPromise<GetSaleItemAggregateType<T>>

    /**
     * Group by SaleItem.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SaleItemGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SaleItemGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SaleItemGroupByArgs['orderBy'] }
        : { orderBy?: SaleItemGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SaleItemGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSaleItemGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the SaleItem model
   */
  readonly fields: SaleItemFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for SaleItem.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SaleItemClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    sale<T extends SaleDefaultArgs<ExtArgs> = {}>(args?: Subset<T, SaleDefaultArgs<ExtArgs>>): Prisma__SaleClient<$Result.GetResult<Prisma.$SalePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    product<T extends ProductDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ProductDefaultArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the SaleItem model
   */
  interface SaleItemFieldRefs {
    readonly id: FieldRef<"SaleItem", 'Int'>
    readonly saleId: FieldRef<"SaleItem", 'Int'>
    readonly productId: FieldRef<"SaleItem", 'Int'>
    readonly quantity: FieldRef<"SaleItem", 'Int'>
    readonly weight: FieldRef<"SaleItem", 'Decimal'>
    readonly unitPrice: FieldRef<"SaleItem", 'Decimal'>
    readonly metalRate: FieldRef<"SaleItem", 'Decimal'>
    readonly metalAmount: FieldRef<"SaleItem", 'Decimal'>
    readonly makingCharge: FieldRef<"SaleItem", 'Decimal'>
    readonly makingChargeType: FieldRef<"SaleItem", 'MakingChargeType'>
    readonly makingChargeValue: FieldRef<"SaleItem", 'Decimal'>
    readonly taxableAmount: FieldRef<"SaleItem", 'Decimal'>
    readonly lineTotal: FieldRef<"SaleItem", 'Decimal'>
  }
    

  // Custom InputTypes
  /**
   * SaleItem findUnique
   */
  export type SaleItemFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SaleItem
     */
    select?: SaleItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SaleItem
     */
    omit?: SaleItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SaleItemInclude<ExtArgs> | null
    /**
     * Filter, which SaleItem to fetch.
     */
    where: SaleItemWhereUniqueInput
  }

  /**
   * SaleItem findUniqueOrThrow
   */
  export type SaleItemFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SaleItem
     */
    select?: SaleItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SaleItem
     */
    omit?: SaleItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SaleItemInclude<ExtArgs> | null
    /**
     * Filter, which SaleItem to fetch.
     */
    where: SaleItemWhereUniqueInput
  }

  /**
   * SaleItem findFirst
   */
  export type SaleItemFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SaleItem
     */
    select?: SaleItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SaleItem
     */
    omit?: SaleItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SaleItemInclude<ExtArgs> | null
    /**
     * Filter, which SaleItem to fetch.
     */
    where?: SaleItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SaleItems to fetch.
     */
    orderBy?: SaleItemOrderByWithRelationInput | SaleItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SaleItems.
     */
    cursor?: SaleItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SaleItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SaleItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SaleItems.
     */
    distinct?: SaleItemScalarFieldEnum | SaleItemScalarFieldEnum[]
  }

  /**
   * SaleItem findFirstOrThrow
   */
  export type SaleItemFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SaleItem
     */
    select?: SaleItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SaleItem
     */
    omit?: SaleItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SaleItemInclude<ExtArgs> | null
    /**
     * Filter, which SaleItem to fetch.
     */
    where?: SaleItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SaleItems to fetch.
     */
    orderBy?: SaleItemOrderByWithRelationInput | SaleItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SaleItems.
     */
    cursor?: SaleItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SaleItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SaleItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SaleItems.
     */
    distinct?: SaleItemScalarFieldEnum | SaleItemScalarFieldEnum[]
  }

  /**
   * SaleItem findMany
   */
  export type SaleItemFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SaleItem
     */
    select?: SaleItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SaleItem
     */
    omit?: SaleItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SaleItemInclude<ExtArgs> | null
    /**
     * Filter, which SaleItems to fetch.
     */
    where?: SaleItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SaleItems to fetch.
     */
    orderBy?: SaleItemOrderByWithRelationInput | SaleItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing SaleItems.
     */
    cursor?: SaleItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SaleItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SaleItems.
     */
    skip?: number
    distinct?: SaleItemScalarFieldEnum | SaleItemScalarFieldEnum[]
  }

  /**
   * SaleItem create
   */
  export type SaleItemCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SaleItem
     */
    select?: SaleItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SaleItem
     */
    omit?: SaleItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SaleItemInclude<ExtArgs> | null
    /**
     * The data needed to create a SaleItem.
     */
    data: XOR<SaleItemCreateInput, SaleItemUncheckedCreateInput>
  }

  /**
   * SaleItem createMany
   */
  export type SaleItemCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many SaleItems.
     */
    data: SaleItemCreateManyInput | SaleItemCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SaleItem update
   */
  export type SaleItemUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SaleItem
     */
    select?: SaleItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SaleItem
     */
    omit?: SaleItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SaleItemInclude<ExtArgs> | null
    /**
     * The data needed to update a SaleItem.
     */
    data: XOR<SaleItemUpdateInput, SaleItemUncheckedUpdateInput>
    /**
     * Choose, which SaleItem to update.
     */
    where: SaleItemWhereUniqueInput
  }

  /**
   * SaleItem updateMany
   */
  export type SaleItemUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update SaleItems.
     */
    data: XOR<SaleItemUpdateManyMutationInput, SaleItemUncheckedUpdateManyInput>
    /**
     * Filter which SaleItems to update
     */
    where?: SaleItemWhereInput
    /**
     * Limit how many SaleItems to update.
     */
    limit?: number
  }

  /**
   * SaleItem upsert
   */
  export type SaleItemUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SaleItem
     */
    select?: SaleItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SaleItem
     */
    omit?: SaleItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SaleItemInclude<ExtArgs> | null
    /**
     * The filter to search for the SaleItem to update in case it exists.
     */
    where: SaleItemWhereUniqueInput
    /**
     * In case the SaleItem found by the `where` argument doesn't exist, create a new SaleItem with this data.
     */
    create: XOR<SaleItemCreateInput, SaleItemUncheckedCreateInput>
    /**
     * In case the SaleItem was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SaleItemUpdateInput, SaleItemUncheckedUpdateInput>
  }

  /**
   * SaleItem delete
   */
  export type SaleItemDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SaleItem
     */
    select?: SaleItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SaleItem
     */
    omit?: SaleItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SaleItemInclude<ExtArgs> | null
    /**
     * Filter which SaleItem to delete.
     */
    where: SaleItemWhereUniqueInput
  }

  /**
   * SaleItem deleteMany
   */
  export type SaleItemDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SaleItems to delete
     */
    where?: SaleItemWhereInput
    /**
     * Limit how many SaleItems to delete.
     */
    limit?: number
  }

  /**
   * SaleItem without action
   */
  export type SaleItemDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SaleItem
     */
    select?: SaleItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SaleItem
     */
    omit?: SaleItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SaleItemInclude<ExtArgs> | null
  }


  /**
   * Model DailyRate
   */

  export type AggregateDailyRate = {
    _count: DailyRateCountAggregateOutputType | null
    _avg: DailyRateAvgAggregateOutputType | null
    _sum: DailyRateSumAggregateOutputType | null
    _min: DailyRateMinAggregateOutputType | null
    _max: DailyRateMaxAggregateOutputType | null
  }

  export type DailyRateAvgAggregateOutputType = {
    id: number | null
    gold22k: Decimal | null
    gold24k: Decimal | null
    silver: Decimal | null
  }

  export type DailyRateSumAggregateOutputType = {
    id: number | null
    gold22k: Decimal | null
    gold24k: Decimal | null
    silver: Decimal | null
  }

  export type DailyRateMinAggregateOutputType = {
    id: number | null
    rateDate: string | null
    gold22k: Decimal | null
    gold24k: Decimal | null
    silver: Decimal | null
    note: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type DailyRateMaxAggregateOutputType = {
    id: number | null
    rateDate: string | null
    gold22k: Decimal | null
    gold24k: Decimal | null
    silver: Decimal | null
    note: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type DailyRateCountAggregateOutputType = {
    id: number
    rateDate: number
    gold22k: number
    gold24k: number
    silver: number
    note: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type DailyRateAvgAggregateInputType = {
    id?: true
    gold22k?: true
    gold24k?: true
    silver?: true
  }

  export type DailyRateSumAggregateInputType = {
    id?: true
    gold22k?: true
    gold24k?: true
    silver?: true
  }

  export type DailyRateMinAggregateInputType = {
    id?: true
    rateDate?: true
    gold22k?: true
    gold24k?: true
    silver?: true
    note?: true
    createdAt?: true
    updatedAt?: true
  }

  export type DailyRateMaxAggregateInputType = {
    id?: true
    rateDate?: true
    gold22k?: true
    gold24k?: true
    silver?: true
    note?: true
    createdAt?: true
    updatedAt?: true
  }

  export type DailyRateCountAggregateInputType = {
    id?: true
    rateDate?: true
    gold22k?: true
    gold24k?: true
    silver?: true
    note?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type DailyRateAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DailyRate to aggregate.
     */
    where?: DailyRateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DailyRates to fetch.
     */
    orderBy?: DailyRateOrderByWithRelationInput | DailyRateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: DailyRateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DailyRates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DailyRates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned DailyRates
    **/
    _count?: true | DailyRateCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: DailyRateAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: DailyRateSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DailyRateMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DailyRateMaxAggregateInputType
  }

  export type GetDailyRateAggregateType<T extends DailyRateAggregateArgs> = {
        [P in keyof T & keyof AggregateDailyRate]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDailyRate[P]>
      : GetScalarType<T[P], AggregateDailyRate[P]>
  }




  export type DailyRateGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DailyRateWhereInput
    orderBy?: DailyRateOrderByWithAggregationInput | DailyRateOrderByWithAggregationInput[]
    by: DailyRateScalarFieldEnum[] | DailyRateScalarFieldEnum
    having?: DailyRateScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DailyRateCountAggregateInputType | true
    _avg?: DailyRateAvgAggregateInputType
    _sum?: DailyRateSumAggregateInputType
    _min?: DailyRateMinAggregateInputType
    _max?: DailyRateMaxAggregateInputType
  }

  export type DailyRateGroupByOutputType = {
    id: number
    rateDate: string
    gold22k: Decimal
    gold24k: Decimal
    silver: Decimal
    note: string | null
    createdAt: Date
    updatedAt: Date
    _count: DailyRateCountAggregateOutputType | null
    _avg: DailyRateAvgAggregateOutputType | null
    _sum: DailyRateSumAggregateOutputType | null
    _min: DailyRateMinAggregateOutputType | null
    _max: DailyRateMaxAggregateOutputType | null
  }

  type GetDailyRateGroupByPayload<T extends DailyRateGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DailyRateGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DailyRateGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DailyRateGroupByOutputType[P]>
            : GetScalarType<T[P], DailyRateGroupByOutputType[P]>
        }
      >
    >


  export type DailyRateSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    rateDate?: boolean
    gold22k?: boolean
    gold24k?: boolean
    silver?: boolean
    note?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["dailyRate"]>



  export type DailyRateSelectScalar = {
    id?: boolean
    rateDate?: boolean
    gold22k?: boolean
    gold24k?: boolean
    silver?: boolean
    note?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type DailyRateOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "rateDate" | "gold22k" | "gold24k" | "silver" | "note" | "createdAt" | "updatedAt", ExtArgs["result"]["dailyRate"]>

  export type $DailyRatePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "DailyRate"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      rateDate: string
      gold22k: Prisma.Decimal
      gold24k: Prisma.Decimal
      silver: Prisma.Decimal
      note: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["dailyRate"]>
    composites: {}
  }

  type DailyRateGetPayload<S extends boolean | null | undefined | DailyRateDefaultArgs> = $Result.GetResult<Prisma.$DailyRatePayload, S>

  type DailyRateCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<DailyRateFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: DailyRateCountAggregateInputType | true
    }

  export interface DailyRateDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['DailyRate'], meta: { name: 'DailyRate' } }
    /**
     * Find zero or one DailyRate that matches the filter.
     * @param {DailyRateFindUniqueArgs} args - Arguments to find a DailyRate
     * @example
     * // Get one DailyRate
     * const dailyRate = await prisma.dailyRate.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends DailyRateFindUniqueArgs>(args: SelectSubset<T, DailyRateFindUniqueArgs<ExtArgs>>): Prisma__DailyRateClient<$Result.GetResult<Prisma.$DailyRatePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one DailyRate that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {DailyRateFindUniqueOrThrowArgs} args - Arguments to find a DailyRate
     * @example
     * // Get one DailyRate
     * const dailyRate = await prisma.dailyRate.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends DailyRateFindUniqueOrThrowArgs>(args: SelectSubset<T, DailyRateFindUniqueOrThrowArgs<ExtArgs>>): Prisma__DailyRateClient<$Result.GetResult<Prisma.$DailyRatePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first DailyRate that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DailyRateFindFirstArgs} args - Arguments to find a DailyRate
     * @example
     * // Get one DailyRate
     * const dailyRate = await prisma.dailyRate.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends DailyRateFindFirstArgs>(args?: SelectSubset<T, DailyRateFindFirstArgs<ExtArgs>>): Prisma__DailyRateClient<$Result.GetResult<Prisma.$DailyRatePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first DailyRate that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DailyRateFindFirstOrThrowArgs} args - Arguments to find a DailyRate
     * @example
     * // Get one DailyRate
     * const dailyRate = await prisma.dailyRate.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends DailyRateFindFirstOrThrowArgs>(args?: SelectSubset<T, DailyRateFindFirstOrThrowArgs<ExtArgs>>): Prisma__DailyRateClient<$Result.GetResult<Prisma.$DailyRatePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more DailyRates that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DailyRateFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all DailyRates
     * const dailyRates = await prisma.dailyRate.findMany()
     * 
     * // Get first 10 DailyRates
     * const dailyRates = await prisma.dailyRate.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const dailyRateWithIdOnly = await prisma.dailyRate.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends DailyRateFindManyArgs>(args?: SelectSubset<T, DailyRateFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DailyRatePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a DailyRate.
     * @param {DailyRateCreateArgs} args - Arguments to create a DailyRate.
     * @example
     * // Create one DailyRate
     * const DailyRate = await prisma.dailyRate.create({
     *   data: {
     *     // ... data to create a DailyRate
     *   }
     * })
     * 
     */
    create<T extends DailyRateCreateArgs>(args: SelectSubset<T, DailyRateCreateArgs<ExtArgs>>): Prisma__DailyRateClient<$Result.GetResult<Prisma.$DailyRatePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many DailyRates.
     * @param {DailyRateCreateManyArgs} args - Arguments to create many DailyRates.
     * @example
     * // Create many DailyRates
     * const dailyRate = await prisma.dailyRate.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends DailyRateCreateManyArgs>(args?: SelectSubset<T, DailyRateCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a DailyRate.
     * @param {DailyRateDeleteArgs} args - Arguments to delete one DailyRate.
     * @example
     * // Delete one DailyRate
     * const DailyRate = await prisma.dailyRate.delete({
     *   where: {
     *     // ... filter to delete one DailyRate
     *   }
     * })
     * 
     */
    delete<T extends DailyRateDeleteArgs>(args: SelectSubset<T, DailyRateDeleteArgs<ExtArgs>>): Prisma__DailyRateClient<$Result.GetResult<Prisma.$DailyRatePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one DailyRate.
     * @param {DailyRateUpdateArgs} args - Arguments to update one DailyRate.
     * @example
     * // Update one DailyRate
     * const dailyRate = await prisma.dailyRate.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends DailyRateUpdateArgs>(args: SelectSubset<T, DailyRateUpdateArgs<ExtArgs>>): Prisma__DailyRateClient<$Result.GetResult<Prisma.$DailyRatePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more DailyRates.
     * @param {DailyRateDeleteManyArgs} args - Arguments to filter DailyRates to delete.
     * @example
     * // Delete a few DailyRates
     * const { count } = await prisma.dailyRate.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends DailyRateDeleteManyArgs>(args?: SelectSubset<T, DailyRateDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more DailyRates.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DailyRateUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many DailyRates
     * const dailyRate = await prisma.dailyRate.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends DailyRateUpdateManyArgs>(args: SelectSubset<T, DailyRateUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one DailyRate.
     * @param {DailyRateUpsertArgs} args - Arguments to update or create a DailyRate.
     * @example
     * // Update or create a DailyRate
     * const dailyRate = await prisma.dailyRate.upsert({
     *   create: {
     *     // ... data to create a DailyRate
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the DailyRate we want to update
     *   }
     * })
     */
    upsert<T extends DailyRateUpsertArgs>(args: SelectSubset<T, DailyRateUpsertArgs<ExtArgs>>): Prisma__DailyRateClient<$Result.GetResult<Prisma.$DailyRatePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of DailyRates.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DailyRateCountArgs} args - Arguments to filter DailyRates to count.
     * @example
     * // Count the number of DailyRates
     * const count = await prisma.dailyRate.count({
     *   where: {
     *     // ... the filter for the DailyRates we want to count
     *   }
     * })
    **/
    count<T extends DailyRateCountArgs>(
      args?: Subset<T, DailyRateCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DailyRateCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a DailyRate.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DailyRateAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends DailyRateAggregateArgs>(args: Subset<T, DailyRateAggregateArgs>): Prisma.PrismaPromise<GetDailyRateAggregateType<T>>

    /**
     * Group by DailyRate.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DailyRateGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends DailyRateGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: DailyRateGroupByArgs['orderBy'] }
        : { orderBy?: DailyRateGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, DailyRateGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDailyRateGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the DailyRate model
   */
  readonly fields: DailyRateFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for DailyRate.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__DailyRateClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the DailyRate model
   */
  interface DailyRateFieldRefs {
    readonly id: FieldRef<"DailyRate", 'Int'>
    readonly rateDate: FieldRef<"DailyRate", 'String'>
    readonly gold22k: FieldRef<"DailyRate", 'Decimal'>
    readonly gold24k: FieldRef<"DailyRate", 'Decimal'>
    readonly silver: FieldRef<"DailyRate", 'Decimal'>
    readonly note: FieldRef<"DailyRate", 'String'>
    readonly createdAt: FieldRef<"DailyRate", 'DateTime'>
    readonly updatedAt: FieldRef<"DailyRate", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * DailyRate findUnique
   */
  export type DailyRateFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DailyRate
     */
    select?: DailyRateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DailyRate
     */
    omit?: DailyRateOmit<ExtArgs> | null
    /**
     * Filter, which DailyRate to fetch.
     */
    where: DailyRateWhereUniqueInput
  }

  /**
   * DailyRate findUniqueOrThrow
   */
  export type DailyRateFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DailyRate
     */
    select?: DailyRateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DailyRate
     */
    omit?: DailyRateOmit<ExtArgs> | null
    /**
     * Filter, which DailyRate to fetch.
     */
    where: DailyRateWhereUniqueInput
  }

  /**
   * DailyRate findFirst
   */
  export type DailyRateFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DailyRate
     */
    select?: DailyRateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DailyRate
     */
    omit?: DailyRateOmit<ExtArgs> | null
    /**
     * Filter, which DailyRate to fetch.
     */
    where?: DailyRateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DailyRates to fetch.
     */
    orderBy?: DailyRateOrderByWithRelationInput | DailyRateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DailyRates.
     */
    cursor?: DailyRateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DailyRates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DailyRates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DailyRates.
     */
    distinct?: DailyRateScalarFieldEnum | DailyRateScalarFieldEnum[]
  }

  /**
   * DailyRate findFirstOrThrow
   */
  export type DailyRateFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DailyRate
     */
    select?: DailyRateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DailyRate
     */
    omit?: DailyRateOmit<ExtArgs> | null
    /**
     * Filter, which DailyRate to fetch.
     */
    where?: DailyRateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DailyRates to fetch.
     */
    orderBy?: DailyRateOrderByWithRelationInput | DailyRateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DailyRates.
     */
    cursor?: DailyRateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DailyRates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DailyRates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DailyRates.
     */
    distinct?: DailyRateScalarFieldEnum | DailyRateScalarFieldEnum[]
  }

  /**
   * DailyRate findMany
   */
  export type DailyRateFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DailyRate
     */
    select?: DailyRateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DailyRate
     */
    omit?: DailyRateOmit<ExtArgs> | null
    /**
     * Filter, which DailyRates to fetch.
     */
    where?: DailyRateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DailyRates to fetch.
     */
    orderBy?: DailyRateOrderByWithRelationInput | DailyRateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing DailyRates.
     */
    cursor?: DailyRateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DailyRates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DailyRates.
     */
    skip?: number
    distinct?: DailyRateScalarFieldEnum | DailyRateScalarFieldEnum[]
  }

  /**
   * DailyRate create
   */
  export type DailyRateCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DailyRate
     */
    select?: DailyRateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DailyRate
     */
    omit?: DailyRateOmit<ExtArgs> | null
    /**
     * The data needed to create a DailyRate.
     */
    data: XOR<DailyRateCreateInput, DailyRateUncheckedCreateInput>
  }

  /**
   * DailyRate createMany
   */
  export type DailyRateCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many DailyRates.
     */
    data: DailyRateCreateManyInput | DailyRateCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * DailyRate update
   */
  export type DailyRateUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DailyRate
     */
    select?: DailyRateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DailyRate
     */
    omit?: DailyRateOmit<ExtArgs> | null
    /**
     * The data needed to update a DailyRate.
     */
    data: XOR<DailyRateUpdateInput, DailyRateUncheckedUpdateInput>
    /**
     * Choose, which DailyRate to update.
     */
    where: DailyRateWhereUniqueInput
  }

  /**
   * DailyRate updateMany
   */
  export type DailyRateUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update DailyRates.
     */
    data: XOR<DailyRateUpdateManyMutationInput, DailyRateUncheckedUpdateManyInput>
    /**
     * Filter which DailyRates to update
     */
    where?: DailyRateWhereInput
    /**
     * Limit how many DailyRates to update.
     */
    limit?: number
  }

  /**
   * DailyRate upsert
   */
  export type DailyRateUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DailyRate
     */
    select?: DailyRateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DailyRate
     */
    omit?: DailyRateOmit<ExtArgs> | null
    /**
     * The filter to search for the DailyRate to update in case it exists.
     */
    where: DailyRateWhereUniqueInput
    /**
     * In case the DailyRate found by the `where` argument doesn't exist, create a new DailyRate with this data.
     */
    create: XOR<DailyRateCreateInput, DailyRateUncheckedCreateInput>
    /**
     * In case the DailyRate was found with the provided `where` argument, update it with this data.
     */
    update: XOR<DailyRateUpdateInput, DailyRateUncheckedUpdateInput>
  }

  /**
   * DailyRate delete
   */
  export type DailyRateDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DailyRate
     */
    select?: DailyRateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DailyRate
     */
    omit?: DailyRateOmit<ExtArgs> | null
    /**
     * Filter which DailyRate to delete.
     */
    where: DailyRateWhereUniqueInput
  }

  /**
   * DailyRate deleteMany
   */
  export type DailyRateDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DailyRates to delete
     */
    where?: DailyRateWhereInput
    /**
     * Limit how many DailyRates to delete.
     */
    limit?: number
  }

  /**
   * DailyRate without action
   */
  export type DailyRateDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DailyRate
     */
    select?: DailyRateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DailyRate
     */
    omit?: DailyRateOmit<ExtArgs> | null
  }


  /**
   * Model BarcodeSequence
   */

  export type AggregateBarcodeSequence = {
    _count: BarcodeSequenceCountAggregateOutputType | null
    _avg: BarcodeSequenceAvgAggregateOutputType | null
    _sum: BarcodeSequenceSumAggregateOutputType | null
    _min: BarcodeSequenceMinAggregateOutputType | null
    _max: BarcodeSequenceMaxAggregateOutputType | null
  }

  export type BarcodeSequenceAvgAggregateOutputType = {
    lastNumber: number | null
  }

  export type BarcodeSequenceSumAggregateOutputType = {
    lastNumber: number | null
  }

  export type BarcodeSequenceMinAggregateOutputType = {
    prefix: string | null
    lastNumber: number | null
    updatedAt: Date | null
  }

  export type BarcodeSequenceMaxAggregateOutputType = {
    prefix: string | null
    lastNumber: number | null
    updatedAt: Date | null
  }

  export type BarcodeSequenceCountAggregateOutputType = {
    prefix: number
    lastNumber: number
    updatedAt: number
    _all: number
  }


  export type BarcodeSequenceAvgAggregateInputType = {
    lastNumber?: true
  }

  export type BarcodeSequenceSumAggregateInputType = {
    lastNumber?: true
  }

  export type BarcodeSequenceMinAggregateInputType = {
    prefix?: true
    lastNumber?: true
    updatedAt?: true
  }

  export type BarcodeSequenceMaxAggregateInputType = {
    prefix?: true
    lastNumber?: true
    updatedAt?: true
  }

  export type BarcodeSequenceCountAggregateInputType = {
    prefix?: true
    lastNumber?: true
    updatedAt?: true
    _all?: true
  }

  export type BarcodeSequenceAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which BarcodeSequence to aggregate.
     */
    where?: BarcodeSequenceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BarcodeSequences to fetch.
     */
    orderBy?: BarcodeSequenceOrderByWithRelationInput | BarcodeSequenceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: BarcodeSequenceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BarcodeSequences from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BarcodeSequences.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned BarcodeSequences
    **/
    _count?: true | BarcodeSequenceCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: BarcodeSequenceAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: BarcodeSequenceSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: BarcodeSequenceMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: BarcodeSequenceMaxAggregateInputType
  }

  export type GetBarcodeSequenceAggregateType<T extends BarcodeSequenceAggregateArgs> = {
        [P in keyof T & keyof AggregateBarcodeSequence]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateBarcodeSequence[P]>
      : GetScalarType<T[P], AggregateBarcodeSequence[P]>
  }




  export type BarcodeSequenceGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BarcodeSequenceWhereInput
    orderBy?: BarcodeSequenceOrderByWithAggregationInput | BarcodeSequenceOrderByWithAggregationInput[]
    by: BarcodeSequenceScalarFieldEnum[] | BarcodeSequenceScalarFieldEnum
    having?: BarcodeSequenceScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: BarcodeSequenceCountAggregateInputType | true
    _avg?: BarcodeSequenceAvgAggregateInputType
    _sum?: BarcodeSequenceSumAggregateInputType
    _min?: BarcodeSequenceMinAggregateInputType
    _max?: BarcodeSequenceMaxAggregateInputType
  }

  export type BarcodeSequenceGroupByOutputType = {
    prefix: string
    lastNumber: number
    updatedAt: Date
    _count: BarcodeSequenceCountAggregateOutputType | null
    _avg: BarcodeSequenceAvgAggregateOutputType | null
    _sum: BarcodeSequenceSumAggregateOutputType | null
    _min: BarcodeSequenceMinAggregateOutputType | null
    _max: BarcodeSequenceMaxAggregateOutputType | null
  }

  type GetBarcodeSequenceGroupByPayload<T extends BarcodeSequenceGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<BarcodeSequenceGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof BarcodeSequenceGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], BarcodeSequenceGroupByOutputType[P]>
            : GetScalarType<T[P], BarcodeSequenceGroupByOutputType[P]>
        }
      >
    >


  export type BarcodeSequenceSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    prefix?: boolean
    lastNumber?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["barcodeSequence"]>



  export type BarcodeSequenceSelectScalar = {
    prefix?: boolean
    lastNumber?: boolean
    updatedAt?: boolean
  }

  export type BarcodeSequenceOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"prefix" | "lastNumber" | "updatedAt", ExtArgs["result"]["barcodeSequence"]>

  export type $BarcodeSequencePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "BarcodeSequence"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      prefix: string
      lastNumber: number
      updatedAt: Date
    }, ExtArgs["result"]["barcodeSequence"]>
    composites: {}
  }

  type BarcodeSequenceGetPayload<S extends boolean | null | undefined | BarcodeSequenceDefaultArgs> = $Result.GetResult<Prisma.$BarcodeSequencePayload, S>

  type BarcodeSequenceCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<BarcodeSequenceFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: BarcodeSequenceCountAggregateInputType | true
    }

  export interface BarcodeSequenceDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['BarcodeSequence'], meta: { name: 'BarcodeSequence' } }
    /**
     * Find zero or one BarcodeSequence that matches the filter.
     * @param {BarcodeSequenceFindUniqueArgs} args - Arguments to find a BarcodeSequence
     * @example
     * // Get one BarcodeSequence
     * const barcodeSequence = await prisma.barcodeSequence.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends BarcodeSequenceFindUniqueArgs>(args: SelectSubset<T, BarcodeSequenceFindUniqueArgs<ExtArgs>>): Prisma__BarcodeSequenceClient<$Result.GetResult<Prisma.$BarcodeSequencePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one BarcodeSequence that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {BarcodeSequenceFindUniqueOrThrowArgs} args - Arguments to find a BarcodeSequence
     * @example
     * // Get one BarcodeSequence
     * const barcodeSequence = await prisma.barcodeSequence.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends BarcodeSequenceFindUniqueOrThrowArgs>(args: SelectSubset<T, BarcodeSequenceFindUniqueOrThrowArgs<ExtArgs>>): Prisma__BarcodeSequenceClient<$Result.GetResult<Prisma.$BarcodeSequencePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first BarcodeSequence that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BarcodeSequenceFindFirstArgs} args - Arguments to find a BarcodeSequence
     * @example
     * // Get one BarcodeSequence
     * const barcodeSequence = await prisma.barcodeSequence.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends BarcodeSequenceFindFirstArgs>(args?: SelectSubset<T, BarcodeSequenceFindFirstArgs<ExtArgs>>): Prisma__BarcodeSequenceClient<$Result.GetResult<Prisma.$BarcodeSequencePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first BarcodeSequence that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BarcodeSequenceFindFirstOrThrowArgs} args - Arguments to find a BarcodeSequence
     * @example
     * // Get one BarcodeSequence
     * const barcodeSequence = await prisma.barcodeSequence.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends BarcodeSequenceFindFirstOrThrowArgs>(args?: SelectSubset<T, BarcodeSequenceFindFirstOrThrowArgs<ExtArgs>>): Prisma__BarcodeSequenceClient<$Result.GetResult<Prisma.$BarcodeSequencePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more BarcodeSequences that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BarcodeSequenceFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all BarcodeSequences
     * const barcodeSequences = await prisma.barcodeSequence.findMany()
     * 
     * // Get first 10 BarcodeSequences
     * const barcodeSequences = await prisma.barcodeSequence.findMany({ take: 10 })
     * 
     * // Only select the `prefix`
     * const barcodeSequenceWithPrefixOnly = await prisma.barcodeSequence.findMany({ select: { prefix: true } })
     * 
     */
    findMany<T extends BarcodeSequenceFindManyArgs>(args?: SelectSubset<T, BarcodeSequenceFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BarcodeSequencePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a BarcodeSequence.
     * @param {BarcodeSequenceCreateArgs} args - Arguments to create a BarcodeSequence.
     * @example
     * // Create one BarcodeSequence
     * const BarcodeSequence = await prisma.barcodeSequence.create({
     *   data: {
     *     // ... data to create a BarcodeSequence
     *   }
     * })
     * 
     */
    create<T extends BarcodeSequenceCreateArgs>(args: SelectSubset<T, BarcodeSequenceCreateArgs<ExtArgs>>): Prisma__BarcodeSequenceClient<$Result.GetResult<Prisma.$BarcodeSequencePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many BarcodeSequences.
     * @param {BarcodeSequenceCreateManyArgs} args - Arguments to create many BarcodeSequences.
     * @example
     * // Create many BarcodeSequences
     * const barcodeSequence = await prisma.barcodeSequence.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends BarcodeSequenceCreateManyArgs>(args?: SelectSubset<T, BarcodeSequenceCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a BarcodeSequence.
     * @param {BarcodeSequenceDeleteArgs} args - Arguments to delete one BarcodeSequence.
     * @example
     * // Delete one BarcodeSequence
     * const BarcodeSequence = await prisma.barcodeSequence.delete({
     *   where: {
     *     // ... filter to delete one BarcodeSequence
     *   }
     * })
     * 
     */
    delete<T extends BarcodeSequenceDeleteArgs>(args: SelectSubset<T, BarcodeSequenceDeleteArgs<ExtArgs>>): Prisma__BarcodeSequenceClient<$Result.GetResult<Prisma.$BarcodeSequencePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one BarcodeSequence.
     * @param {BarcodeSequenceUpdateArgs} args - Arguments to update one BarcodeSequence.
     * @example
     * // Update one BarcodeSequence
     * const barcodeSequence = await prisma.barcodeSequence.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends BarcodeSequenceUpdateArgs>(args: SelectSubset<T, BarcodeSequenceUpdateArgs<ExtArgs>>): Prisma__BarcodeSequenceClient<$Result.GetResult<Prisma.$BarcodeSequencePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more BarcodeSequences.
     * @param {BarcodeSequenceDeleteManyArgs} args - Arguments to filter BarcodeSequences to delete.
     * @example
     * // Delete a few BarcodeSequences
     * const { count } = await prisma.barcodeSequence.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends BarcodeSequenceDeleteManyArgs>(args?: SelectSubset<T, BarcodeSequenceDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more BarcodeSequences.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BarcodeSequenceUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many BarcodeSequences
     * const barcodeSequence = await prisma.barcodeSequence.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends BarcodeSequenceUpdateManyArgs>(args: SelectSubset<T, BarcodeSequenceUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one BarcodeSequence.
     * @param {BarcodeSequenceUpsertArgs} args - Arguments to update or create a BarcodeSequence.
     * @example
     * // Update or create a BarcodeSequence
     * const barcodeSequence = await prisma.barcodeSequence.upsert({
     *   create: {
     *     // ... data to create a BarcodeSequence
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the BarcodeSequence we want to update
     *   }
     * })
     */
    upsert<T extends BarcodeSequenceUpsertArgs>(args: SelectSubset<T, BarcodeSequenceUpsertArgs<ExtArgs>>): Prisma__BarcodeSequenceClient<$Result.GetResult<Prisma.$BarcodeSequencePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of BarcodeSequences.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BarcodeSequenceCountArgs} args - Arguments to filter BarcodeSequences to count.
     * @example
     * // Count the number of BarcodeSequences
     * const count = await prisma.barcodeSequence.count({
     *   where: {
     *     // ... the filter for the BarcodeSequences we want to count
     *   }
     * })
    **/
    count<T extends BarcodeSequenceCountArgs>(
      args?: Subset<T, BarcodeSequenceCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], BarcodeSequenceCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a BarcodeSequence.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BarcodeSequenceAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends BarcodeSequenceAggregateArgs>(args: Subset<T, BarcodeSequenceAggregateArgs>): Prisma.PrismaPromise<GetBarcodeSequenceAggregateType<T>>

    /**
     * Group by BarcodeSequence.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BarcodeSequenceGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends BarcodeSequenceGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: BarcodeSequenceGroupByArgs['orderBy'] }
        : { orderBy?: BarcodeSequenceGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, BarcodeSequenceGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBarcodeSequenceGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the BarcodeSequence model
   */
  readonly fields: BarcodeSequenceFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for BarcodeSequence.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__BarcodeSequenceClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the BarcodeSequence model
   */
  interface BarcodeSequenceFieldRefs {
    readonly prefix: FieldRef<"BarcodeSequence", 'String'>
    readonly lastNumber: FieldRef<"BarcodeSequence", 'Int'>
    readonly updatedAt: FieldRef<"BarcodeSequence", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * BarcodeSequence findUnique
   */
  export type BarcodeSequenceFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BarcodeSequence
     */
    select?: BarcodeSequenceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BarcodeSequence
     */
    omit?: BarcodeSequenceOmit<ExtArgs> | null
    /**
     * Filter, which BarcodeSequence to fetch.
     */
    where: BarcodeSequenceWhereUniqueInput
  }

  /**
   * BarcodeSequence findUniqueOrThrow
   */
  export type BarcodeSequenceFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BarcodeSequence
     */
    select?: BarcodeSequenceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BarcodeSequence
     */
    omit?: BarcodeSequenceOmit<ExtArgs> | null
    /**
     * Filter, which BarcodeSequence to fetch.
     */
    where: BarcodeSequenceWhereUniqueInput
  }

  /**
   * BarcodeSequence findFirst
   */
  export type BarcodeSequenceFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BarcodeSequence
     */
    select?: BarcodeSequenceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BarcodeSequence
     */
    omit?: BarcodeSequenceOmit<ExtArgs> | null
    /**
     * Filter, which BarcodeSequence to fetch.
     */
    where?: BarcodeSequenceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BarcodeSequences to fetch.
     */
    orderBy?: BarcodeSequenceOrderByWithRelationInput | BarcodeSequenceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for BarcodeSequences.
     */
    cursor?: BarcodeSequenceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BarcodeSequences from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BarcodeSequences.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of BarcodeSequences.
     */
    distinct?: BarcodeSequenceScalarFieldEnum | BarcodeSequenceScalarFieldEnum[]
  }

  /**
   * BarcodeSequence findFirstOrThrow
   */
  export type BarcodeSequenceFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BarcodeSequence
     */
    select?: BarcodeSequenceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BarcodeSequence
     */
    omit?: BarcodeSequenceOmit<ExtArgs> | null
    /**
     * Filter, which BarcodeSequence to fetch.
     */
    where?: BarcodeSequenceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BarcodeSequences to fetch.
     */
    orderBy?: BarcodeSequenceOrderByWithRelationInput | BarcodeSequenceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for BarcodeSequences.
     */
    cursor?: BarcodeSequenceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BarcodeSequences from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BarcodeSequences.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of BarcodeSequences.
     */
    distinct?: BarcodeSequenceScalarFieldEnum | BarcodeSequenceScalarFieldEnum[]
  }

  /**
   * BarcodeSequence findMany
   */
  export type BarcodeSequenceFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BarcodeSequence
     */
    select?: BarcodeSequenceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BarcodeSequence
     */
    omit?: BarcodeSequenceOmit<ExtArgs> | null
    /**
     * Filter, which BarcodeSequences to fetch.
     */
    where?: BarcodeSequenceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BarcodeSequences to fetch.
     */
    orderBy?: BarcodeSequenceOrderByWithRelationInput | BarcodeSequenceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing BarcodeSequences.
     */
    cursor?: BarcodeSequenceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BarcodeSequences from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BarcodeSequences.
     */
    skip?: number
    distinct?: BarcodeSequenceScalarFieldEnum | BarcodeSequenceScalarFieldEnum[]
  }

  /**
   * BarcodeSequence create
   */
  export type BarcodeSequenceCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BarcodeSequence
     */
    select?: BarcodeSequenceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BarcodeSequence
     */
    omit?: BarcodeSequenceOmit<ExtArgs> | null
    /**
     * The data needed to create a BarcodeSequence.
     */
    data: XOR<BarcodeSequenceCreateInput, BarcodeSequenceUncheckedCreateInput>
  }

  /**
   * BarcodeSequence createMany
   */
  export type BarcodeSequenceCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many BarcodeSequences.
     */
    data: BarcodeSequenceCreateManyInput | BarcodeSequenceCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * BarcodeSequence update
   */
  export type BarcodeSequenceUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BarcodeSequence
     */
    select?: BarcodeSequenceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BarcodeSequence
     */
    omit?: BarcodeSequenceOmit<ExtArgs> | null
    /**
     * The data needed to update a BarcodeSequence.
     */
    data: XOR<BarcodeSequenceUpdateInput, BarcodeSequenceUncheckedUpdateInput>
    /**
     * Choose, which BarcodeSequence to update.
     */
    where: BarcodeSequenceWhereUniqueInput
  }

  /**
   * BarcodeSequence updateMany
   */
  export type BarcodeSequenceUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update BarcodeSequences.
     */
    data: XOR<BarcodeSequenceUpdateManyMutationInput, BarcodeSequenceUncheckedUpdateManyInput>
    /**
     * Filter which BarcodeSequences to update
     */
    where?: BarcodeSequenceWhereInput
    /**
     * Limit how many BarcodeSequences to update.
     */
    limit?: number
  }

  /**
   * BarcodeSequence upsert
   */
  export type BarcodeSequenceUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BarcodeSequence
     */
    select?: BarcodeSequenceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BarcodeSequence
     */
    omit?: BarcodeSequenceOmit<ExtArgs> | null
    /**
     * The filter to search for the BarcodeSequence to update in case it exists.
     */
    where: BarcodeSequenceWhereUniqueInput
    /**
     * In case the BarcodeSequence found by the `where` argument doesn't exist, create a new BarcodeSequence with this data.
     */
    create: XOR<BarcodeSequenceCreateInput, BarcodeSequenceUncheckedCreateInput>
    /**
     * In case the BarcodeSequence was found with the provided `where` argument, update it with this data.
     */
    update: XOR<BarcodeSequenceUpdateInput, BarcodeSequenceUncheckedUpdateInput>
  }

  /**
   * BarcodeSequence delete
   */
  export type BarcodeSequenceDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BarcodeSequence
     */
    select?: BarcodeSequenceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BarcodeSequence
     */
    omit?: BarcodeSequenceOmit<ExtArgs> | null
    /**
     * Filter which BarcodeSequence to delete.
     */
    where: BarcodeSequenceWhereUniqueInput
  }

  /**
   * BarcodeSequence deleteMany
   */
  export type BarcodeSequenceDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which BarcodeSequences to delete
     */
    where?: BarcodeSequenceWhereInput
    /**
     * Limit how many BarcodeSequences to delete.
     */
    limit?: number
  }

  /**
   * BarcodeSequence without action
   */
  export type BarcodeSequenceDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BarcodeSequence
     */
    select?: BarcodeSequenceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BarcodeSequence
     */
    omit?: BarcodeSequenceOmit<ExtArgs> | null
  }


  /**
   * Model CustomerLedger
   */

  export type AggregateCustomerLedger = {
    _count: CustomerLedgerCountAggregateOutputType | null
    _avg: CustomerLedgerAvgAggregateOutputType | null
    _sum: CustomerLedgerSumAggregateOutputType | null
    _min: CustomerLedgerMinAggregateOutputType | null
    _max: CustomerLedgerMaxAggregateOutputType | null
  }

  export type CustomerLedgerAvgAggregateOutputType = {
    id: number | null
    customerId: number | null
    saleId: number | null
    amount: Decimal | null
  }

  export type CustomerLedgerSumAggregateOutputType = {
    id: number | null
    customerId: number | null
    saleId: number | null
    amount: Decimal | null
  }

  export type CustomerLedgerMinAggregateOutputType = {
    id: number | null
    customerId: number | null
    saleId: number | null
    type: $Enums.LedgerEntryType | null
    amount: Decimal | null
    paymentMethod: $Enums.PaymentMethod | null
    reference: string | null
    note: string | null
    createdAt: Date | null
  }

  export type CustomerLedgerMaxAggregateOutputType = {
    id: number | null
    customerId: number | null
    saleId: number | null
    type: $Enums.LedgerEntryType | null
    amount: Decimal | null
    paymentMethod: $Enums.PaymentMethod | null
    reference: string | null
    note: string | null
    createdAt: Date | null
  }

  export type CustomerLedgerCountAggregateOutputType = {
    id: number
    customerId: number
    saleId: number
    type: number
    amount: number
    paymentMethod: number
    reference: number
    note: number
    createdAt: number
    _all: number
  }


  export type CustomerLedgerAvgAggregateInputType = {
    id?: true
    customerId?: true
    saleId?: true
    amount?: true
  }

  export type CustomerLedgerSumAggregateInputType = {
    id?: true
    customerId?: true
    saleId?: true
    amount?: true
  }

  export type CustomerLedgerMinAggregateInputType = {
    id?: true
    customerId?: true
    saleId?: true
    type?: true
    amount?: true
    paymentMethod?: true
    reference?: true
    note?: true
    createdAt?: true
  }

  export type CustomerLedgerMaxAggregateInputType = {
    id?: true
    customerId?: true
    saleId?: true
    type?: true
    amount?: true
    paymentMethod?: true
    reference?: true
    note?: true
    createdAt?: true
  }

  export type CustomerLedgerCountAggregateInputType = {
    id?: true
    customerId?: true
    saleId?: true
    type?: true
    amount?: true
    paymentMethod?: true
    reference?: true
    note?: true
    createdAt?: true
    _all?: true
  }

  export type CustomerLedgerAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CustomerLedger to aggregate.
     */
    where?: CustomerLedgerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CustomerLedgers to fetch.
     */
    orderBy?: CustomerLedgerOrderByWithRelationInput | CustomerLedgerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CustomerLedgerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CustomerLedgers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CustomerLedgers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned CustomerLedgers
    **/
    _count?: true | CustomerLedgerCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: CustomerLedgerAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: CustomerLedgerSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CustomerLedgerMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CustomerLedgerMaxAggregateInputType
  }

  export type GetCustomerLedgerAggregateType<T extends CustomerLedgerAggregateArgs> = {
        [P in keyof T & keyof AggregateCustomerLedger]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCustomerLedger[P]>
      : GetScalarType<T[P], AggregateCustomerLedger[P]>
  }




  export type CustomerLedgerGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CustomerLedgerWhereInput
    orderBy?: CustomerLedgerOrderByWithAggregationInput | CustomerLedgerOrderByWithAggregationInput[]
    by: CustomerLedgerScalarFieldEnum[] | CustomerLedgerScalarFieldEnum
    having?: CustomerLedgerScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CustomerLedgerCountAggregateInputType | true
    _avg?: CustomerLedgerAvgAggregateInputType
    _sum?: CustomerLedgerSumAggregateInputType
    _min?: CustomerLedgerMinAggregateInputType
    _max?: CustomerLedgerMaxAggregateInputType
  }

  export type CustomerLedgerGroupByOutputType = {
    id: number
    customerId: number
    saleId: number | null
    type: $Enums.LedgerEntryType
    amount: Decimal
    paymentMethod: $Enums.PaymentMethod | null
    reference: string | null
    note: string | null
    createdAt: Date
    _count: CustomerLedgerCountAggregateOutputType | null
    _avg: CustomerLedgerAvgAggregateOutputType | null
    _sum: CustomerLedgerSumAggregateOutputType | null
    _min: CustomerLedgerMinAggregateOutputType | null
    _max: CustomerLedgerMaxAggregateOutputType | null
  }

  type GetCustomerLedgerGroupByPayload<T extends CustomerLedgerGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CustomerLedgerGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CustomerLedgerGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CustomerLedgerGroupByOutputType[P]>
            : GetScalarType<T[P], CustomerLedgerGroupByOutputType[P]>
        }
      >
    >


  export type CustomerLedgerSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    customerId?: boolean
    saleId?: boolean
    type?: boolean
    amount?: boolean
    paymentMethod?: boolean
    reference?: boolean
    note?: boolean
    createdAt?: boolean
    customer?: boolean | CustomerDefaultArgs<ExtArgs>
    sale?: boolean | CustomerLedger$saleArgs<ExtArgs>
  }, ExtArgs["result"]["customerLedger"]>



  export type CustomerLedgerSelectScalar = {
    id?: boolean
    customerId?: boolean
    saleId?: boolean
    type?: boolean
    amount?: boolean
    paymentMethod?: boolean
    reference?: boolean
    note?: boolean
    createdAt?: boolean
  }

  export type CustomerLedgerOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "customerId" | "saleId" | "type" | "amount" | "paymentMethod" | "reference" | "note" | "createdAt", ExtArgs["result"]["customerLedger"]>
  export type CustomerLedgerInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    customer?: boolean | CustomerDefaultArgs<ExtArgs>
    sale?: boolean | CustomerLedger$saleArgs<ExtArgs>
  }

  export type $CustomerLedgerPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "CustomerLedger"
    objects: {
      customer: Prisma.$CustomerPayload<ExtArgs>
      sale: Prisma.$SalePayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      customerId: number
      saleId: number | null
      type: $Enums.LedgerEntryType
      amount: Prisma.Decimal
      paymentMethod: $Enums.PaymentMethod | null
      reference: string | null
      note: string | null
      createdAt: Date
    }, ExtArgs["result"]["customerLedger"]>
    composites: {}
  }

  type CustomerLedgerGetPayload<S extends boolean | null | undefined | CustomerLedgerDefaultArgs> = $Result.GetResult<Prisma.$CustomerLedgerPayload, S>

  type CustomerLedgerCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CustomerLedgerFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CustomerLedgerCountAggregateInputType | true
    }

  export interface CustomerLedgerDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['CustomerLedger'], meta: { name: 'CustomerLedger' } }
    /**
     * Find zero or one CustomerLedger that matches the filter.
     * @param {CustomerLedgerFindUniqueArgs} args - Arguments to find a CustomerLedger
     * @example
     * // Get one CustomerLedger
     * const customerLedger = await prisma.customerLedger.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CustomerLedgerFindUniqueArgs>(args: SelectSubset<T, CustomerLedgerFindUniqueArgs<ExtArgs>>): Prisma__CustomerLedgerClient<$Result.GetResult<Prisma.$CustomerLedgerPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one CustomerLedger that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CustomerLedgerFindUniqueOrThrowArgs} args - Arguments to find a CustomerLedger
     * @example
     * // Get one CustomerLedger
     * const customerLedger = await prisma.customerLedger.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CustomerLedgerFindUniqueOrThrowArgs>(args: SelectSubset<T, CustomerLedgerFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CustomerLedgerClient<$Result.GetResult<Prisma.$CustomerLedgerPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CustomerLedger that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomerLedgerFindFirstArgs} args - Arguments to find a CustomerLedger
     * @example
     * // Get one CustomerLedger
     * const customerLedger = await prisma.customerLedger.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CustomerLedgerFindFirstArgs>(args?: SelectSubset<T, CustomerLedgerFindFirstArgs<ExtArgs>>): Prisma__CustomerLedgerClient<$Result.GetResult<Prisma.$CustomerLedgerPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CustomerLedger that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomerLedgerFindFirstOrThrowArgs} args - Arguments to find a CustomerLedger
     * @example
     * // Get one CustomerLedger
     * const customerLedger = await prisma.customerLedger.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CustomerLedgerFindFirstOrThrowArgs>(args?: SelectSubset<T, CustomerLedgerFindFirstOrThrowArgs<ExtArgs>>): Prisma__CustomerLedgerClient<$Result.GetResult<Prisma.$CustomerLedgerPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more CustomerLedgers that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomerLedgerFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all CustomerLedgers
     * const customerLedgers = await prisma.customerLedger.findMany()
     * 
     * // Get first 10 CustomerLedgers
     * const customerLedgers = await prisma.customerLedger.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const customerLedgerWithIdOnly = await prisma.customerLedger.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CustomerLedgerFindManyArgs>(args?: SelectSubset<T, CustomerLedgerFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CustomerLedgerPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a CustomerLedger.
     * @param {CustomerLedgerCreateArgs} args - Arguments to create a CustomerLedger.
     * @example
     * // Create one CustomerLedger
     * const CustomerLedger = await prisma.customerLedger.create({
     *   data: {
     *     // ... data to create a CustomerLedger
     *   }
     * })
     * 
     */
    create<T extends CustomerLedgerCreateArgs>(args: SelectSubset<T, CustomerLedgerCreateArgs<ExtArgs>>): Prisma__CustomerLedgerClient<$Result.GetResult<Prisma.$CustomerLedgerPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many CustomerLedgers.
     * @param {CustomerLedgerCreateManyArgs} args - Arguments to create many CustomerLedgers.
     * @example
     * // Create many CustomerLedgers
     * const customerLedger = await prisma.customerLedger.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CustomerLedgerCreateManyArgs>(args?: SelectSubset<T, CustomerLedgerCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a CustomerLedger.
     * @param {CustomerLedgerDeleteArgs} args - Arguments to delete one CustomerLedger.
     * @example
     * // Delete one CustomerLedger
     * const CustomerLedger = await prisma.customerLedger.delete({
     *   where: {
     *     // ... filter to delete one CustomerLedger
     *   }
     * })
     * 
     */
    delete<T extends CustomerLedgerDeleteArgs>(args: SelectSubset<T, CustomerLedgerDeleteArgs<ExtArgs>>): Prisma__CustomerLedgerClient<$Result.GetResult<Prisma.$CustomerLedgerPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one CustomerLedger.
     * @param {CustomerLedgerUpdateArgs} args - Arguments to update one CustomerLedger.
     * @example
     * // Update one CustomerLedger
     * const customerLedger = await prisma.customerLedger.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CustomerLedgerUpdateArgs>(args: SelectSubset<T, CustomerLedgerUpdateArgs<ExtArgs>>): Prisma__CustomerLedgerClient<$Result.GetResult<Prisma.$CustomerLedgerPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more CustomerLedgers.
     * @param {CustomerLedgerDeleteManyArgs} args - Arguments to filter CustomerLedgers to delete.
     * @example
     * // Delete a few CustomerLedgers
     * const { count } = await prisma.customerLedger.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CustomerLedgerDeleteManyArgs>(args?: SelectSubset<T, CustomerLedgerDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CustomerLedgers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomerLedgerUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many CustomerLedgers
     * const customerLedger = await prisma.customerLedger.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CustomerLedgerUpdateManyArgs>(args: SelectSubset<T, CustomerLedgerUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one CustomerLedger.
     * @param {CustomerLedgerUpsertArgs} args - Arguments to update or create a CustomerLedger.
     * @example
     * // Update or create a CustomerLedger
     * const customerLedger = await prisma.customerLedger.upsert({
     *   create: {
     *     // ... data to create a CustomerLedger
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the CustomerLedger we want to update
     *   }
     * })
     */
    upsert<T extends CustomerLedgerUpsertArgs>(args: SelectSubset<T, CustomerLedgerUpsertArgs<ExtArgs>>): Prisma__CustomerLedgerClient<$Result.GetResult<Prisma.$CustomerLedgerPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of CustomerLedgers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomerLedgerCountArgs} args - Arguments to filter CustomerLedgers to count.
     * @example
     * // Count the number of CustomerLedgers
     * const count = await prisma.customerLedger.count({
     *   where: {
     *     // ... the filter for the CustomerLedgers we want to count
     *   }
     * })
    **/
    count<T extends CustomerLedgerCountArgs>(
      args?: Subset<T, CustomerLedgerCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CustomerLedgerCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a CustomerLedger.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomerLedgerAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CustomerLedgerAggregateArgs>(args: Subset<T, CustomerLedgerAggregateArgs>): Prisma.PrismaPromise<GetCustomerLedgerAggregateType<T>>

    /**
     * Group by CustomerLedger.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomerLedgerGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CustomerLedgerGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CustomerLedgerGroupByArgs['orderBy'] }
        : { orderBy?: CustomerLedgerGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CustomerLedgerGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCustomerLedgerGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the CustomerLedger model
   */
  readonly fields: CustomerLedgerFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for CustomerLedger.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CustomerLedgerClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    customer<T extends CustomerDefaultArgs<ExtArgs> = {}>(args?: Subset<T, CustomerDefaultArgs<ExtArgs>>): Prisma__CustomerClient<$Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    sale<T extends CustomerLedger$saleArgs<ExtArgs> = {}>(args?: Subset<T, CustomerLedger$saleArgs<ExtArgs>>): Prisma__SaleClient<$Result.GetResult<Prisma.$SalePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the CustomerLedger model
   */
  interface CustomerLedgerFieldRefs {
    readonly id: FieldRef<"CustomerLedger", 'Int'>
    readonly customerId: FieldRef<"CustomerLedger", 'Int'>
    readonly saleId: FieldRef<"CustomerLedger", 'Int'>
    readonly type: FieldRef<"CustomerLedger", 'LedgerEntryType'>
    readonly amount: FieldRef<"CustomerLedger", 'Decimal'>
    readonly paymentMethod: FieldRef<"CustomerLedger", 'PaymentMethod'>
    readonly reference: FieldRef<"CustomerLedger", 'String'>
    readonly note: FieldRef<"CustomerLedger", 'String'>
    readonly createdAt: FieldRef<"CustomerLedger", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * CustomerLedger findUnique
   */
  export type CustomerLedgerFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomerLedger
     */
    select?: CustomerLedgerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CustomerLedger
     */
    omit?: CustomerLedgerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerLedgerInclude<ExtArgs> | null
    /**
     * Filter, which CustomerLedger to fetch.
     */
    where: CustomerLedgerWhereUniqueInput
  }

  /**
   * CustomerLedger findUniqueOrThrow
   */
  export type CustomerLedgerFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomerLedger
     */
    select?: CustomerLedgerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CustomerLedger
     */
    omit?: CustomerLedgerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerLedgerInclude<ExtArgs> | null
    /**
     * Filter, which CustomerLedger to fetch.
     */
    where: CustomerLedgerWhereUniqueInput
  }

  /**
   * CustomerLedger findFirst
   */
  export type CustomerLedgerFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomerLedger
     */
    select?: CustomerLedgerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CustomerLedger
     */
    omit?: CustomerLedgerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerLedgerInclude<ExtArgs> | null
    /**
     * Filter, which CustomerLedger to fetch.
     */
    where?: CustomerLedgerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CustomerLedgers to fetch.
     */
    orderBy?: CustomerLedgerOrderByWithRelationInput | CustomerLedgerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CustomerLedgers.
     */
    cursor?: CustomerLedgerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CustomerLedgers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CustomerLedgers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CustomerLedgers.
     */
    distinct?: CustomerLedgerScalarFieldEnum | CustomerLedgerScalarFieldEnum[]
  }

  /**
   * CustomerLedger findFirstOrThrow
   */
  export type CustomerLedgerFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomerLedger
     */
    select?: CustomerLedgerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CustomerLedger
     */
    omit?: CustomerLedgerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerLedgerInclude<ExtArgs> | null
    /**
     * Filter, which CustomerLedger to fetch.
     */
    where?: CustomerLedgerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CustomerLedgers to fetch.
     */
    orderBy?: CustomerLedgerOrderByWithRelationInput | CustomerLedgerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CustomerLedgers.
     */
    cursor?: CustomerLedgerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CustomerLedgers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CustomerLedgers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CustomerLedgers.
     */
    distinct?: CustomerLedgerScalarFieldEnum | CustomerLedgerScalarFieldEnum[]
  }

  /**
   * CustomerLedger findMany
   */
  export type CustomerLedgerFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomerLedger
     */
    select?: CustomerLedgerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CustomerLedger
     */
    omit?: CustomerLedgerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerLedgerInclude<ExtArgs> | null
    /**
     * Filter, which CustomerLedgers to fetch.
     */
    where?: CustomerLedgerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CustomerLedgers to fetch.
     */
    orderBy?: CustomerLedgerOrderByWithRelationInput | CustomerLedgerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing CustomerLedgers.
     */
    cursor?: CustomerLedgerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CustomerLedgers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CustomerLedgers.
     */
    skip?: number
    distinct?: CustomerLedgerScalarFieldEnum | CustomerLedgerScalarFieldEnum[]
  }

  /**
   * CustomerLedger create
   */
  export type CustomerLedgerCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomerLedger
     */
    select?: CustomerLedgerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CustomerLedger
     */
    omit?: CustomerLedgerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerLedgerInclude<ExtArgs> | null
    /**
     * The data needed to create a CustomerLedger.
     */
    data: XOR<CustomerLedgerCreateInput, CustomerLedgerUncheckedCreateInput>
  }

  /**
   * CustomerLedger createMany
   */
  export type CustomerLedgerCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many CustomerLedgers.
     */
    data: CustomerLedgerCreateManyInput | CustomerLedgerCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * CustomerLedger update
   */
  export type CustomerLedgerUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomerLedger
     */
    select?: CustomerLedgerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CustomerLedger
     */
    omit?: CustomerLedgerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerLedgerInclude<ExtArgs> | null
    /**
     * The data needed to update a CustomerLedger.
     */
    data: XOR<CustomerLedgerUpdateInput, CustomerLedgerUncheckedUpdateInput>
    /**
     * Choose, which CustomerLedger to update.
     */
    where: CustomerLedgerWhereUniqueInput
  }

  /**
   * CustomerLedger updateMany
   */
  export type CustomerLedgerUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update CustomerLedgers.
     */
    data: XOR<CustomerLedgerUpdateManyMutationInput, CustomerLedgerUncheckedUpdateManyInput>
    /**
     * Filter which CustomerLedgers to update
     */
    where?: CustomerLedgerWhereInput
    /**
     * Limit how many CustomerLedgers to update.
     */
    limit?: number
  }

  /**
   * CustomerLedger upsert
   */
  export type CustomerLedgerUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomerLedger
     */
    select?: CustomerLedgerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CustomerLedger
     */
    omit?: CustomerLedgerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerLedgerInclude<ExtArgs> | null
    /**
     * The filter to search for the CustomerLedger to update in case it exists.
     */
    where: CustomerLedgerWhereUniqueInput
    /**
     * In case the CustomerLedger found by the `where` argument doesn't exist, create a new CustomerLedger with this data.
     */
    create: XOR<CustomerLedgerCreateInput, CustomerLedgerUncheckedCreateInput>
    /**
     * In case the CustomerLedger was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CustomerLedgerUpdateInput, CustomerLedgerUncheckedUpdateInput>
  }

  /**
   * CustomerLedger delete
   */
  export type CustomerLedgerDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomerLedger
     */
    select?: CustomerLedgerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CustomerLedger
     */
    omit?: CustomerLedgerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerLedgerInclude<ExtArgs> | null
    /**
     * Filter which CustomerLedger to delete.
     */
    where: CustomerLedgerWhereUniqueInput
  }

  /**
   * CustomerLedger deleteMany
   */
  export type CustomerLedgerDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CustomerLedgers to delete
     */
    where?: CustomerLedgerWhereInput
    /**
     * Limit how many CustomerLedgers to delete.
     */
    limit?: number
  }

  /**
   * CustomerLedger.sale
   */
  export type CustomerLedger$saleArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Sale
     */
    select?: SaleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Sale
     */
    omit?: SaleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SaleInclude<ExtArgs> | null
    where?: SaleWhereInput
  }

  /**
   * CustomerLedger without action
   */
  export type CustomerLedgerDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomerLedger
     */
    select?: CustomerLedgerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CustomerLedger
     */
    omit?: CustomerLedgerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerLedgerInclude<ExtArgs> | null
  }


  /**
   * Model Repair
   */

  export type AggregateRepair = {
    _count: RepairCountAggregateOutputType | null
    _avg: RepairAvgAggregateOutputType | null
    _sum: RepairSumAggregateOutputType | null
    _min: RepairMinAggregateOutputType | null
    _max: RepairMaxAggregateOutputType | null
  }

  export type RepairAvgAggregateOutputType = {
    id: number | null
    customerId: number | null
    grossWeight: Decimal | null
    estimatedCharge: Decimal | null
    finalCharge: Decimal | null
    advancePaid: Decimal | null
  }

  export type RepairSumAggregateOutputType = {
    id: number | null
    customerId: number | null
    grossWeight: Decimal | null
    estimatedCharge: Decimal | null
    finalCharge: Decimal | null
    advancePaid: Decimal | null
  }

  export type RepairMinAggregateOutputType = {
    id: number | null
    repairNumber: string | null
    customerId: number | null
    itemDescription: string | null
    metal: $Enums.MetalType | null
    grossWeight: Decimal | null
    issueDescription: string | null
    estimatedCharge: Decimal | null
    finalCharge: Decimal | null
    advancePaid: Decimal | null
    advancePaymentMethod: $Enums.PaymentMethod | null
    dueDate: Date | null
    status: $Enums.RepairStatus | null
    receivedAt: Date | null
    deliveredAt: Date | null
    notes: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type RepairMaxAggregateOutputType = {
    id: number | null
    repairNumber: string | null
    customerId: number | null
    itemDescription: string | null
    metal: $Enums.MetalType | null
    grossWeight: Decimal | null
    issueDescription: string | null
    estimatedCharge: Decimal | null
    finalCharge: Decimal | null
    advancePaid: Decimal | null
    advancePaymentMethod: $Enums.PaymentMethod | null
    dueDate: Date | null
    status: $Enums.RepairStatus | null
    receivedAt: Date | null
    deliveredAt: Date | null
    notes: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type RepairCountAggregateOutputType = {
    id: number
    repairNumber: number
    customerId: number
    itemDescription: number
    metal: number
    grossWeight: number
    issueDescription: number
    estimatedCharge: number
    finalCharge: number
    advancePaid: number
    advancePaymentMethod: number
    dueDate: number
    status: number
    receivedAt: number
    deliveredAt: number
    notes: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type RepairAvgAggregateInputType = {
    id?: true
    customerId?: true
    grossWeight?: true
    estimatedCharge?: true
    finalCharge?: true
    advancePaid?: true
  }

  export type RepairSumAggregateInputType = {
    id?: true
    customerId?: true
    grossWeight?: true
    estimatedCharge?: true
    finalCharge?: true
    advancePaid?: true
  }

  export type RepairMinAggregateInputType = {
    id?: true
    repairNumber?: true
    customerId?: true
    itemDescription?: true
    metal?: true
    grossWeight?: true
    issueDescription?: true
    estimatedCharge?: true
    finalCharge?: true
    advancePaid?: true
    advancePaymentMethod?: true
    dueDate?: true
    status?: true
    receivedAt?: true
    deliveredAt?: true
    notes?: true
    createdAt?: true
    updatedAt?: true
  }

  export type RepairMaxAggregateInputType = {
    id?: true
    repairNumber?: true
    customerId?: true
    itemDescription?: true
    metal?: true
    grossWeight?: true
    issueDescription?: true
    estimatedCharge?: true
    finalCharge?: true
    advancePaid?: true
    advancePaymentMethod?: true
    dueDate?: true
    status?: true
    receivedAt?: true
    deliveredAt?: true
    notes?: true
    createdAt?: true
    updatedAt?: true
  }

  export type RepairCountAggregateInputType = {
    id?: true
    repairNumber?: true
    customerId?: true
    itemDescription?: true
    metal?: true
    grossWeight?: true
    issueDescription?: true
    estimatedCharge?: true
    finalCharge?: true
    advancePaid?: true
    advancePaymentMethod?: true
    dueDate?: true
    status?: true
    receivedAt?: true
    deliveredAt?: true
    notes?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type RepairAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Repair to aggregate.
     */
    where?: RepairWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Repairs to fetch.
     */
    orderBy?: RepairOrderByWithRelationInput | RepairOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: RepairWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Repairs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Repairs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Repairs
    **/
    _count?: true | RepairCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: RepairAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: RepairSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: RepairMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: RepairMaxAggregateInputType
  }

  export type GetRepairAggregateType<T extends RepairAggregateArgs> = {
        [P in keyof T & keyof AggregateRepair]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRepair[P]>
      : GetScalarType<T[P], AggregateRepair[P]>
  }




  export type RepairGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RepairWhereInput
    orderBy?: RepairOrderByWithAggregationInput | RepairOrderByWithAggregationInput[]
    by: RepairScalarFieldEnum[] | RepairScalarFieldEnum
    having?: RepairScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: RepairCountAggregateInputType | true
    _avg?: RepairAvgAggregateInputType
    _sum?: RepairSumAggregateInputType
    _min?: RepairMinAggregateInputType
    _max?: RepairMaxAggregateInputType
  }

  export type RepairGroupByOutputType = {
    id: number
    repairNumber: string
    customerId: number
    itemDescription: string
    metal: $Enums.MetalType | null
    grossWeight: Decimal | null
    issueDescription: string | null
    estimatedCharge: Decimal
    finalCharge: Decimal | null
    advancePaid: Decimal
    advancePaymentMethod: $Enums.PaymentMethod
    dueDate: Date | null
    status: $Enums.RepairStatus
    receivedAt: Date
    deliveredAt: Date | null
    notes: string | null
    createdAt: Date
    updatedAt: Date
    _count: RepairCountAggregateOutputType | null
    _avg: RepairAvgAggregateOutputType | null
    _sum: RepairSumAggregateOutputType | null
    _min: RepairMinAggregateOutputType | null
    _max: RepairMaxAggregateOutputType | null
  }

  type GetRepairGroupByPayload<T extends RepairGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<RepairGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof RepairGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], RepairGroupByOutputType[P]>
            : GetScalarType<T[P], RepairGroupByOutputType[P]>
        }
      >
    >


  export type RepairSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    repairNumber?: boolean
    customerId?: boolean
    itemDescription?: boolean
    metal?: boolean
    grossWeight?: boolean
    issueDescription?: boolean
    estimatedCharge?: boolean
    finalCharge?: boolean
    advancePaid?: boolean
    advancePaymentMethod?: boolean
    dueDate?: boolean
    status?: boolean
    receivedAt?: boolean
    deliveredAt?: boolean
    notes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    customer?: boolean | CustomerDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["repair"]>



  export type RepairSelectScalar = {
    id?: boolean
    repairNumber?: boolean
    customerId?: boolean
    itemDescription?: boolean
    metal?: boolean
    grossWeight?: boolean
    issueDescription?: boolean
    estimatedCharge?: boolean
    finalCharge?: boolean
    advancePaid?: boolean
    advancePaymentMethod?: boolean
    dueDate?: boolean
    status?: boolean
    receivedAt?: boolean
    deliveredAt?: boolean
    notes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type RepairOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "repairNumber" | "customerId" | "itemDescription" | "metal" | "grossWeight" | "issueDescription" | "estimatedCharge" | "finalCharge" | "advancePaid" | "advancePaymentMethod" | "dueDate" | "status" | "receivedAt" | "deliveredAt" | "notes" | "createdAt" | "updatedAt", ExtArgs["result"]["repair"]>
  export type RepairInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    customer?: boolean | CustomerDefaultArgs<ExtArgs>
  }

  export type $RepairPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Repair"
    objects: {
      customer: Prisma.$CustomerPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      repairNumber: string
      customerId: number
      itemDescription: string
      metal: $Enums.MetalType | null
      grossWeight: Prisma.Decimal | null
      issueDescription: string | null
      estimatedCharge: Prisma.Decimal
      finalCharge: Prisma.Decimal | null
      advancePaid: Prisma.Decimal
      advancePaymentMethod: $Enums.PaymentMethod
      dueDate: Date | null
      status: $Enums.RepairStatus
      receivedAt: Date
      deliveredAt: Date | null
      notes: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["repair"]>
    composites: {}
  }

  type RepairGetPayload<S extends boolean | null | undefined | RepairDefaultArgs> = $Result.GetResult<Prisma.$RepairPayload, S>

  type RepairCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<RepairFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: RepairCountAggregateInputType | true
    }

  export interface RepairDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Repair'], meta: { name: 'Repair' } }
    /**
     * Find zero or one Repair that matches the filter.
     * @param {RepairFindUniqueArgs} args - Arguments to find a Repair
     * @example
     * // Get one Repair
     * const repair = await prisma.repair.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends RepairFindUniqueArgs>(args: SelectSubset<T, RepairFindUniqueArgs<ExtArgs>>): Prisma__RepairClient<$Result.GetResult<Prisma.$RepairPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Repair that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {RepairFindUniqueOrThrowArgs} args - Arguments to find a Repair
     * @example
     * // Get one Repair
     * const repair = await prisma.repair.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends RepairFindUniqueOrThrowArgs>(args: SelectSubset<T, RepairFindUniqueOrThrowArgs<ExtArgs>>): Prisma__RepairClient<$Result.GetResult<Prisma.$RepairPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Repair that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RepairFindFirstArgs} args - Arguments to find a Repair
     * @example
     * // Get one Repair
     * const repair = await prisma.repair.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends RepairFindFirstArgs>(args?: SelectSubset<T, RepairFindFirstArgs<ExtArgs>>): Prisma__RepairClient<$Result.GetResult<Prisma.$RepairPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Repair that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RepairFindFirstOrThrowArgs} args - Arguments to find a Repair
     * @example
     * // Get one Repair
     * const repair = await prisma.repair.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends RepairFindFirstOrThrowArgs>(args?: SelectSubset<T, RepairFindFirstOrThrowArgs<ExtArgs>>): Prisma__RepairClient<$Result.GetResult<Prisma.$RepairPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Repairs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RepairFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Repairs
     * const repairs = await prisma.repair.findMany()
     * 
     * // Get first 10 Repairs
     * const repairs = await prisma.repair.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const repairWithIdOnly = await prisma.repair.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends RepairFindManyArgs>(args?: SelectSubset<T, RepairFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RepairPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Repair.
     * @param {RepairCreateArgs} args - Arguments to create a Repair.
     * @example
     * // Create one Repair
     * const Repair = await prisma.repair.create({
     *   data: {
     *     // ... data to create a Repair
     *   }
     * })
     * 
     */
    create<T extends RepairCreateArgs>(args: SelectSubset<T, RepairCreateArgs<ExtArgs>>): Prisma__RepairClient<$Result.GetResult<Prisma.$RepairPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Repairs.
     * @param {RepairCreateManyArgs} args - Arguments to create many Repairs.
     * @example
     * // Create many Repairs
     * const repair = await prisma.repair.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends RepairCreateManyArgs>(args?: SelectSubset<T, RepairCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Repair.
     * @param {RepairDeleteArgs} args - Arguments to delete one Repair.
     * @example
     * // Delete one Repair
     * const Repair = await prisma.repair.delete({
     *   where: {
     *     // ... filter to delete one Repair
     *   }
     * })
     * 
     */
    delete<T extends RepairDeleteArgs>(args: SelectSubset<T, RepairDeleteArgs<ExtArgs>>): Prisma__RepairClient<$Result.GetResult<Prisma.$RepairPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Repair.
     * @param {RepairUpdateArgs} args - Arguments to update one Repair.
     * @example
     * // Update one Repair
     * const repair = await prisma.repair.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends RepairUpdateArgs>(args: SelectSubset<T, RepairUpdateArgs<ExtArgs>>): Prisma__RepairClient<$Result.GetResult<Prisma.$RepairPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Repairs.
     * @param {RepairDeleteManyArgs} args - Arguments to filter Repairs to delete.
     * @example
     * // Delete a few Repairs
     * const { count } = await prisma.repair.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends RepairDeleteManyArgs>(args?: SelectSubset<T, RepairDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Repairs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RepairUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Repairs
     * const repair = await prisma.repair.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends RepairUpdateManyArgs>(args: SelectSubset<T, RepairUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Repair.
     * @param {RepairUpsertArgs} args - Arguments to update or create a Repair.
     * @example
     * // Update or create a Repair
     * const repair = await prisma.repair.upsert({
     *   create: {
     *     // ... data to create a Repair
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Repair we want to update
     *   }
     * })
     */
    upsert<T extends RepairUpsertArgs>(args: SelectSubset<T, RepairUpsertArgs<ExtArgs>>): Prisma__RepairClient<$Result.GetResult<Prisma.$RepairPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Repairs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RepairCountArgs} args - Arguments to filter Repairs to count.
     * @example
     * // Count the number of Repairs
     * const count = await prisma.repair.count({
     *   where: {
     *     // ... the filter for the Repairs we want to count
     *   }
     * })
    **/
    count<T extends RepairCountArgs>(
      args?: Subset<T, RepairCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RepairCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Repair.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RepairAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends RepairAggregateArgs>(args: Subset<T, RepairAggregateArgs>): Prisma.PrismaPromise<GetRepairAggregateType<T>>

    /**
     * Group by Repair.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RepairGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends RepairGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: RepairGroupByArgs['orderBy'] }
        : { orderBy?: RepairGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, RepairGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRepairGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Repair model
   */
  readonly fields: RepairFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Repair.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__RepairClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    customer<T extends CustomerDefaultArgs<ExtArgs> = {}>(args?: Subset<T, CustomerDefaultArgs<ExtArgs>>): Prisma__CustomerClient<$Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Repair model
   */
  interface RepairFieldRefs {
    readonly id: FieldRef<"Repair", 'Int'>
    readonly repairNumber: FieldRef<"Repair", 'String'>
    readonly customerId: FieldRef<"Repair", 'Int'>
    readonly itemDescription: FieldRef<"Repair", 'String'>
    readonly metal: FieldRef<"Repair", 'MetalType'>
    readonly grossWeight: FieldRef<"Repair", 'Decimal'>
    readonly issueDescription: FieldRef<"Repair", 'String'>
    readonly estimatedCharge: FieldRef<"Repair", 'Decimal'>
    readonly finalCharge: FieldRef<"Repair", 'Decimal'>
    readonly advancePaid: FieldRef<"Repair", 'Decimal'>
    readonly advancePaymentMethod: FieldRef<"Repair", 'PaymentMethod'>
    readonly dueDate: FieldRef<"Repair", 'DateTime'>
    readonly status: FieldRef<"Repair", 'RepairStatus'>
    readonly receivedAt: FieldRef<"Repair", 'DateTime'>
    readonly deliveredAt: FieldRef<"Repair", 'DateTime'>
    readonly notes: FieldRef<"Repair", 'String'>
    readonly createdAt: FieldRef<"Repair", 'DateTime'>
    readonly updatedAt: FieldRef<"Repair", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Repair findUnique
   */
  export type RepairFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Repair
     */
    select?: RepairSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Repair
     */
    omit?: RepairOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RepairInclude<ExtArgs> | null
    /**
     * Filter, which Repair to fetch.
     */
    where: RepairWhereUniqueInput
  }

  /**
   * Repair findUniqueOrThrow
   */
  export type RepairFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Repair
     */
    select?: RepairSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Repair
     */
    omit?: RepairOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RepairInclude<ExtArgs> | null
    /**
     * Filter, which Repair to fetch.
     */
    where: RepairWhereUniqueInput
  }

  /**
   * Repair findFirst
   */
  export type RepairFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Repair
     */
    select?: RepairSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Repair
     */
    omit?: RepairOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RepairInclude<ExtArgs> | null
    /**
     * Filter, which Repair to fetch.
     */
    where?: RepairWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Repairs to fetch.
     */
    orderBy?: RepairOrderByWithRelationInput | RepairOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Repairs.
     */
    cursor?: RepairWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Repairs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Repairs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Repairs.
     */
    distinct?: RepairScalarFieldEnum | RepairScalarFieldEnum[]
  }

  /**
   * Repair findFirstOrThrow
   */
  export type RepairFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Repair
     */
    select?: RepairSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Repair
     */
    omit?: RepairOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RepairInclude<ExtArgs> | null
    /**
     * Filter, which Repair to fetch.
     */
    where?: RepairWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Repairs to fetch.
     */
    orderBy?: RepairOrderByWithRelationInput | RepairOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Repairs.
     */
    cursor?: RepairWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Repairs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Repairs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Repairs.
     */
    distinct?: RepairScalarFieldEnum | RepairScalarFieldEnum[]
  }

  /**
   * Repair findMany
   */
  export type RepairFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Repair
     */
    select?: RepairSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Repair
     */
    omit?: RepairOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RepairInclude<ExtArgs> | null
    /**
     * Filter, which Repairs to fetch.
     */
    where?: RepairWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Repairs to fetch.
     */
    orderBy?: RepairOrderByWithRelationInput | RepairOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Repairs.
     */
    cursor?: RepairWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Repairs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Repairs.
     */
    skip?: number
    distinct?: RepairScalarFieldEnum | RepairScalarFieldEnum[]
  }

  /**
   * Repair create
   */
  export type RepairCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Repair
     */
    select?: RepairSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Repair
     */
    omit?: RepairOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RepairInclude<ExtArgs> | null
    /**
     * The data needed to create a Repair.
     */
    data: XOR<RepairCreateInput, RepairUncheckedCreateInput>
  }

  /**
   * Repair createMany
   */
  export type RepairCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Repairs.
     */
    data: RepairCreateManyInput | RepairCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Repair update
   */
  export type RepairUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Repair
     */
    select?: RepairSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Repair
     */
    omit?: RepairOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RepairInclude<ExtArgs> | null
    /**
     * The data needed to update a Repair.
     */
    data: XOR<RepairUpdateInput, RepairUncheckedUpdateInput>
    /**
     * Choose, which Repair to update.
     */
    where: RepairWhereUniqueInput
  }

  /**
   * Repair updateMany
   */
  export type RepairUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Repairs.
     */
    data: XOR<RepairUpdateManyMutationInput, RepairUncheckedUpdateManyInput>
    /**
     * Filter which Repairs to update
     */
    where?: RepairWhereInput
    /**
     * Limit how many Repairs to update.
     */
    limit?: number
  }

  /**
   * Repair upsert
   */
  export type RepairUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Repair
     */
    select?: RepairSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Repair
     */
    omit?: RepairOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RepairInclude<ExtArgs> | null
    /**
     * The filter to search for the Repair to update in case it exists.
     */
    where: RepairWhereUniqueInput
    /**
     * In case the Repair found by the `where` argument doesn't exist, create a new Repair with this data.
     */
    create: XOR<RepairCreateInput, RepairUncheckedCreateInput>
    /**
     * In case the Repair was found with the provided `where` argument, update it with this data.
     */
    update: XOR<RepairUpdateInput, RepairUncheckedUpdateInput>
  }

  /**
   * Repair delete
   */
  export type RepairDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Repair
     */
    select?: RepairSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Repair
     */
    omit?: RepairOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RepairInclude<ExtArgs> | null
    /**
     * Filter which Repair to delete.
     */
    where: RepairWhereUniqueInput
  }

  /**
   * Repair deleteMany
   */
  export type RepairDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Repairs to delete
     */
    where?: RepairWhereInput
    /**
     * Limit how many Repairs to delete.
     */
    limit?: number
  }

  /**
   * Repair without action
   */
  export type RepairDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Repair
     */
    select?: RepairSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Repair
     */
    omit?: RepairOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RepairInclude<ExtArgs> | null
  }


  /**
   * Model CashbookEntry
   */

  export type AggregateCashbookEntry = {
    _count: CashbookEntryCountAggregateOutputType | null
    _avg: CashbookEntryAvgAggregateOutputType | null
    _sum: CashbookEntrySumAggregateOutputType | null
    _min: CashbookEntryMinAggregateOutputType | null
    _max: CashbookEntryMaxAggregateOutputType | null
  }

  export type CashbookEntryAvgAggregateOutputType = {
    id: number | null
    amount: Decimal | null
    customerId: number | null
  }

  export type CashbookEntrySumAggregateOutputType = {
    id: number | null
    amount: Decimal | null
    customerId: number | null
  }

  export type CashbookEntryMinAggregateOutputType = {
    id: number | null
    entryDate: string | null
    type: $Enums.CashbookType | null
    paymentMethod: $Enums.PaymentMethod | null
    description: string | null
    amount: Decimal | null
    reference: string | null
    notes: string | null
    customerId: number | null
    syncLedger: boolean | null
    createdAt: Date | null
  }

  export type CashbookEntryMaxAggregateOutputType = {
    id: number | null
    entryDate: string | null
    type: $Enums.CashbookType | null
    paymentMethod: $Enums.PaymentMethod | null
    description: string | null
    amount: Decimal | null
    reference: string | null
    notes: string | null
    customerId: number | null
    syncLedger: boolean | null
    createdAt: Date | null
  }

  export type CashbookEntryCountAggregateOutputType = {
    id: number
    entryDate: number
    type: number
    paymentMethod: number
    description: number
    amount: number
    reference: number
    notes: number
    customerId: number
    syncLedger: number
    createdAt: number
    _all: number
  }


  export type CashbookEntryAvgAggregateInputType = {
    id?: true
    amount?: true
    customerId?: true
  }

  export type CashbookEntrySumAggregateInputType = {
    id?: true
    amount?: true
    customerId?: true
  }

  export type CashbookEntryMinAggregateInputType = {
    id?: true
    entryDate?: true
    type?: true
    paymentMethod?: true
    description?: true
    amount?: true
    reference?: true
    notes?: true
    customerId?: true
    syncLedger?: true
    createdAt?: true
  }

  export type CashbookEntryMaxAggregateInputType = {
    id?: true
    entryDate?: true
    type?: true
    paymentMethod?: true
    description?: true
    amount?: true
    reference?: true
    notes?: true
    customerId?: true
    syncLedger?: true
    createdAt?: true
  }

  export type CashbookEntryCountAggregateInputType = {
    id?: true
    entryDate?: true
    type?: true
    paymentMethod?: true
    description?: true
    amount?: true
    reference?: true
    notes?: true
    customerId?: true
    syncLedger?: true
    createdAt?: true
    _all?: true
  }

  export type CashbookEntryAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CashbookEntry to aggregate.
     */
    where?: CashbookEntryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CashbookEntries to fetch.
     */
    orderBy?: CashbookEntryOrderByWithRelationInput | CashbookEntryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CashbookEntryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CashbookEntries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CashbookEntries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned CashbookEntries
    **/
    _count?: true | CashbookEntryCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: CashbookEntryAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: CashbookEntrySumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CashbookEntryMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CashbookEntryMaxAggregateInputType
  }

  export type GetCashbookEntryAggregateType<T extends CashbookEntryAggregateArgs> = {
        [P in keyof T & keyof AggregateCashbookEntry]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCashbookEntry[P]>
      : GetScalarType<T[P], AggregateCashbookEntry[P]>
  }




  export type CashbookEntryGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CashbookEntryWhereInput
    orderBy?: CashbookEntryOrderByWithAggregationInput | CashbookEntryOrderByWithAggregationInput[]
    by: CashbookEntryScalarFieldEnum[] | CashbookEntryScalarFieldEnum
    having?: CashbookEntryScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CashbookEntryCountAggregateInputType | true
    _avg?: CashbookEntryAvgAggregateInputType
    _sum?: CashbookEntrySumAggregateInputType
    _min?: CashbookEntryMinAggregateInputType
    _max?: CashbookEntryMaxAggregateInputType
  }

  export type CashbookEntryGroupByOutputType = {
    id: number
    entryDate: string
    type: $Enums.CashbookType
    paymentMethod: $Enums.PaymentMethod
    description: string
    amount: Decimal
    reference: string | null
    notes: string | null
    customerId: number | null
    syncLedger: boolean
    createdAt: Date
    _count: CashbookEntryCountAggregateOutputType | null
    _avg: CashbookEntryAvgAggregateOutputType | null
    _sum: CashbookEntrySumAggregateOutputType | null
    _min: CashbookEntryMinAggregateOutputType | null
    _max: CashbookEntryMaxAggregateOutputType | null
  }

  type GetCashbookEntryGroupByPayload<T extends CashbookEntryGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CashbookEntryGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CashbookEntryGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CashbookEntryGroupByOutputType[P]>
            : GetScalarType<T[P], CashbookEntryGroupByOutputType[P]>
        }
      >
    >


  export type CashbookEntrySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    entryDate?: boolean
    type?: boolean
    paymentMethod?: boolean
    description?: boolean
    amount?: boolean
    reference?: boolean
    notes?: boolean
    customerId?: boolean
    syncLedger?: boolean
    createdAt?: boolean
    customer?: boolean | CashbookEntry$customerArgs<ExtArgs>
  }, ExtArgs["result"]["cashbookEntry"]>



  export type CashbookEntrySelectScalar = {
    id?: boolean
    entryDate?: boolean
    type?: boolean
    paymentMethod?: boolean
    description?: boolean
    amount?: boolean
    reference?: boolean
    notes?: boolean
    customerId?: boolean
    syncLedger?: boolean
    createdAt?: boolean
  }

  export type CashbookEntryOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "entryDate" | "type" | "paymentMethod" | "description" | "amount" | "reference" | "notes" | "customerId" | "syncLedger" | "createdAt", ExtArgs["result"]["cashbookEntry"]>
  export type CashbookEntryInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    customer?: boolean | CashbookEntry$customerArgs<ExtArgs>
  }

  export type $CashbookEntryPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "CashbookEntry"
    objects: {
      customer: Prisma.$CustomerPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      entryDate: string
      type: $Enums.CashbookType
      paymentMethod: $Enums.PaymentMethod
      description: string
      amount: Prisma.Decimal
      reference: string | null
      notes: string | null
      customerId: number | null
      syncLedger: boolean
      createdAt: Date
    }, ExtArgs["result"]["cashbookEntry"]>
    composites: {}
  }

  type CashbookEntryGetPayload<S extends boolean | null | undefined | CashbookEntryDefaultArgs> = $Result.GetResult<Prisma.$CashbookEntryPayload, S>

  type CashbookEntryCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CashbookEntryFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CashbookEntryCountAggregateInputType | true
    }

  export interface CashbookEntryDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['CashbookEntry'], meta: { name: 'CashbookEntry' } }
    /**
     * Find zero or one CashbookEntry that matches the filter.
     * @param {CashbookEntryFindUniqueArgs} args - Arguments to find a CashbookEntry
     * @example
     * // Get one CashbookEntry
     * const cashbookEntry = await prisma.cashbookEntry.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CashbookEntryFindUniqueArgs>(args: SelectSubset<T, CashbookEntryFindUniqueArgs<ExtArgs>>): Prisma__CashbookEntryClient<$Result.GetResult<Prisma.$CashbookEntryPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one CashbookEntry that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CashbookEntryFindUniqueOrThrowArgs} args - Arguments to find a CashbookEntry
     * @example
     * // Get one CashbookEntry
     * const cashbookEntry = await prisma.cashbookEntry.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CashbookEntryFindUniqueOrThrowArgs>(args: SelectSubset<T, CashbookEntryFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CashbookEntryClient<$Result.GetResult<Prisma.$CashbookEntryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CashbookEntry that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CashbookEntryFindFirstArgs} args - Arguments to find a CashbookEntry
     * @example
     * // Get one CashbookEntry
     * const cashbookEntry = await prisma.cashbookEntry.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CashbookEntryFindFirstArgs>(args?: SelectSubset<T, CashbookEntryFindFirstArgs<ExtArgs>>): Prisma__CashbookEntryClient<$Result.GetResult<Prisma.$CashbookEntryPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CashbookEntry that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CashbookEntryFindFirstOrThrowArgs} args - Arguments to find a CashbookEntry
     * @example
     * // Get one CashbookEntry
     * const cashbookEntry = await prisma.cashbookEntry.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CashbookEntryFindFirstOrThrowArgs>(args?: SelectSubset<T, CashbookEntryFindFirstOrThrowArgs<ExtArgs>>): Prisma__CashbookEntryClient<$Result.GetResult<Prisma.$CashbookEntryPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more CashbookEntries that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CashbookEntryFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all CashbookEntries
     * const cashbookEntries = await prisma.cashbookEntry.findMany()
     * 
     * // Get first 10 CashbookEntries
     * const cashbookEntries = await prisma.cashbookEntry.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const cashbookEntryWithIdOnly = await prisma.cashbookEntry.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CashbookEntryFindManyArgs>(args?: SelectSubset<T, CashbookEntryFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CashbookEntryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a CashbookEntry.
     * @param {CashbookEntryCreateArgs} args - Arguments to create a CashbookEntry.
     * @example
     * // Create one CashbookEntry
     * const CashbookEntry = await prisma.cashbookEntry.create({
     *   data: {
     *     // ... data to create a CashbookEntry
     *   }
     * })
     * 
     */
    create<T extends CashbookEntryCreateArgs>(args: SelectSubset<T, CashbookEntryCreateArgs<ExtArgs>>): Prisma__CashbookEntryClient<$Result.GetResult<Prisma.$CashbookEntryPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many CashbookEntries.
     * @param {CashbookEntryCreateManyArgs} args - Arguments to create many CashbookEntries.
     * @example
     * // Create many CashbookEntries
     * const cashbookEntry = await prisma.cashbookEntry.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CashbookEntryCreateManyArgs>(args?: SelectSubset<T, CashbookEntryCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a CashbookEntry.
     * @param {CashbookEntryDeleteArgs} args - Arguments to delete one CashbookEntry.
     * @example
     * // Delete one CashbookEntry
     * const CashbookEntry = await prisma.cashbookEntry.delete({
     *   where: {
     *     // ... filter to delete one CashbookEntry
     *   }
     * })
     * 
     */
    delete<T extends CashbookEntryDeleteArgs>(args: SelectSubset<T, CashbookEntryDeleteArgs<ExtArgs>>): Prisma__CashbookEntryClient<$Result.GetResult<Prisma.$CashbookEntryPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one CashbookEntry.
     * @param {CashbookEntryUpdateArgs} args - Arguments to update one CashbookEntry.
     * @example
     * // Update one CashbookEntry
     * const cashbookEntry = await prisma.cashbookEntry.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CashbookEntryUpdateArgs>(args: SelectSubset<T, CashbookEntryUpdateArgs<ExtArgs>>): Prisma__CashbookEntryClient<$Result.GetResult<Prisma.$CashbookEntryPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more CashbookEntries.
     * @param {CashbookEntryDeleteManyArgs} args - Arguments to filter CashbookEntries to delete.
     * @example
     * // Delete a few CashbookEntries
     * const { count } = await prisma.cashbookEntry.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CashbookEntryDeleteManyArgs>(args?: SelectSubset<T, CashbookEntryDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CashbookEntries.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CashbookEntryUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many CashbookEntries
     * const cashbookEntry = await prisma.cashbookEntry.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CashbookEntryUpdateManyArgs>(args: SelectSubset<T, CashbookEntryUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one CashbookEntry.
     * @param {CashbookEntryUpsertArgs} args - Arguments to update or create a CashbookEntry.
     * @example
     * // Update or create a CashbookEntry
     * const cashbookEntry = await prisma.cashbookEntry.upsert({
     *   create: {
     *     // ... data to create a CashbookEntry
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the CashbookEntry we want to update
     *   }
     * })
     */
    upsert<T extends CashbookEntryUpsertArgs>(args: SelectSubset<T, CashbookEntryUpsertArgs<ExtArgs>>): Prisma__CashbookEntryClient<$Result.GetResult<Prisma.$CashbookEntryPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of CashbookEntries.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CashbookEntryCountArgs} args - Arguments to filter CashbookEntries to count.
     * @example
     * // Count the number of CashbookEntries
     * const count = await prisma.cashbookEntry.count({
     *   where: {
     *     // ... the filter for the CashbookEntries we want to count
     *   }
     * })
    **/
    count<T extends CashbookEntryCountArgs>(
      args?: Subset<T, CashbookEntryCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CashbookEntryCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a CashbookEntry.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CashbookEntryAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CashbookEntryAggregateArgs>(args: Subset<T, CashbookEntryAggregateArgs>): Prisma.PrismaPromise<GetCashbookEntryAggregateType<T>>

    /**
     * Group by CashbookEntry.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CashbookEntryGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CashbookEntryGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CashbookEntryGroupByArgs['orderBy'] }
        : { orderBy?: CashbookEntryGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CashbookEntryGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCashbookEntryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the CashbookEntry model
   */
  readonly fields: CashbookEntryFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for CashbookEntry.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CashbookEntryClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    customer<T extends CashbookEntry$customerArgs<ExtArgs> = {}>(args?: Subset<T, CashbookEntry$customerArgs<ExtArgs>>): Prisma__CustomerClient<$Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the CashbookEntry model
   */
  interface CashbookEntryFieldRefs {
    readonly id: FieldRef<"CashbookEntry", 'Int'>
    readonly entryDate: FieldRef<"CashbookEntry", 'String'>
    readonly type: FieldRef<"CashbookEntry", 'CashbookType'>
    readonly paymentMethod: FieldRef<"CashbookEntry", 'PaymentMethod'>
    readonly description: FieldRef<"CashbookEntry", 'String'>
    readonly amount: FieldRef<"CashbookEntry", 'Decimal'>
    readonly reference: FieldRef<"CashbookEntry", 'String'>
    readonly notes: FieldRef<"CashbookEntry", 'String'>
    readonly customerId: FieldRef<"CashbookEntry", 'Int'>
    readonly syncLedger: FieldRef<"CashbookEntry", 'Boolean'>
    readonly createdAt: FieldRef<"CashbookEntry", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * CashbookEntry findUnique
   */
  export type CashbookEntryFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CashbookEntry
     */
    select?: CashbookEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the CashbookEntry
     */
    omit?: CashbookEntryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CashbookEntryInclude<ExtArgs> | null
    /**
     * Filter, which CashbookEntry to fetch.
     */
    where: CashbookEntryWhereUniqueInput
  }

  /**
   * CashbookEntry findUniqueOrThrow
   */
  export type CashbookEntryFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CashbookEntry
     */
    select?: CashbookEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the CashbookEntry
     */
    omit?: CashbookEntryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CashbookEntryInclude<ExtArgs> | null
    /**
     * Filter, which CashbookEntry to fetch.
     */
    where: CashbookEntryWhereUniqueInput
  }

  /**
   * CashbookEntry findFirst
   */
  export type CashbookEntryFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CashbookEntry
     */
    select?: CashbookEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the CashbookEntry
     */
    omit?: CashbookEntryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CashbookEntryInclude<ExtArgs> | null
    /**
     * Filter, which CashbookEntry to fetch.
     */
    where?: CashbookEntryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CashbookEntries to fetch.
     */
    orderBy?: CashbookEntryOrderByWithRelationInput | CashbookEntryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CashbookEntries.
     */
    cursor?: CashbookEntryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CashbookEntries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CashbookEntries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CashbookEntries.
     */
    distinct?: CashbookEntryScalarFieldEnum | CashbookEntryScalarFieldEnum[]
  }

  /**
   * CashbookEntry findFirstOrThrow
   */
  export type CashbookEntryFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CashbookEntry
     */
    select?: CashbookEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the CashbookEntry
     */
    omit?: CashbookEntryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CashbookEntryInclude<ExtArgs> | null
    /**
     * Filter, which CashbookEntry to fetch.
     */
    where?: CashbookEntryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CashbookEntries to fetch.
     */
    orderBy?: CashbookEntryOrderByWithRelationInput | CashbookEntryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CashbookEntries.
     */
    cursor?: CashbookEntryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CashbookEntries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CashbookEntries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CashbookEntries.
     */
    distinct?: CashbookEntryScalarFieldEnum | CashbookEntryScalarFieldEnum[]
  }

  /**
   * CashbookEntry findMany
   */
  export type CashbookEntryFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CashbookEntry
     */
    select?: CashbookEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the CashbookEntry
     */
    omit?: CashbookEntryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CashbookEntryInclude<ExtArgs> | null
    /**
     * Filter, which CashbookEntries to fetch.
     */
    where?: CashbookEntryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CashbookEntries to fetch.
     */
    orderBy?: CashbookEntryOrderByWithRelationInput | CashbookEntryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing CashbookEntries.
     */
    cursor?: CashbookEntryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CashbookEntries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CashbookEntries.
     */
    skip?: number
    distinct?: CashbookEntryScalarFieldEnum | CashbookEntryScalarFieldEnum[]
  }

  /**
   * CashbookEntry create
   */
  export type CashbookEntryCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CashbookEntry
     */
    select?: CashbookEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the CashbookEntry
     */
    omit?: CashbookEntryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CashbookEntryInclude<ExtArgs> | null
    /**
     * The data needed to create a CashbookEntry.
     */
    data: XOR<CashbookEntryCreateInput, CashbookEntryUncheckedCreateInput>
  }

  /**
   * CashbookEntry createMany
   */
  export type CashbookEntryCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many CashbookEntries.
     */
    data: CashbookEntryCreateManyInput | CashbookEntryCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * CashbookEntry update
   */
  export type CashbookEntryUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CashbookEntry
     */
    select?: CashbookEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the CashbookEntry
     */
    omit?: CashbookEntryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CashbookEntryInclude<ExtArgs> | null
    /**
     * The data needed to update a CashbookEntry.
     */
    data: XOR<CashbookEntryUpdateInput, CashbookEntryUncheckedUpdateInput>
    /**
     * Choose, which CashbookEntry to update.
     */
    where: CashbookEntryWhereUniqueInput
  }

  /**
   * CashbookEntry updateMany
   */
  export type CashbookEntryUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update CashbookEntries.
     */
    data: XOR<CashbookEntryUpdateManyMutationInput, CashbookEntryUncheckedUpdateManyInput>
    /**
     * Filter which CashbookEntries to update
     */
    where?: CashbookEntryWhereInput
    /**
     * Limit how many CashbookEntries to update.
     */
    limit?: number
  }

  /**
   * CashbookEntry upsert
   */
  export type CashbookEntryUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CashbookEntry
     */
    select?: CashbookEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the CashbookEntry
     */
    omit?: CashbookEntryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CashbookEntryInclude<ExtArgs> | null
    /**
     * The filter to search for the CashbookEntry to update in case it exists.
     */
    where: CashbookEntryWhereUniqueInput
    /**
     * In case the CashbookEntry found by the `where` argument doesn't exist, create a new CashbookEntry with this data.
     */
    create: XOR<CashbookEntryCreateInput, CashbookEntryUncheckedCreateInput>
    /**
     * In case the CashbookEntry was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CashbookEntryUpdateInput, CashbookEntryUncheckedUpdateInput>
  }

  /**
   * CashbookEntry delete
   */
  export type CashbookEntryDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CashbookEntry
     */
    select?: CashbookEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the CashbookEntry
     */
    omit?: CashbookEntryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CashbookEntryInclude<ExtArgs> | null
    /**
     * Filter which CashbookEntry to delete.
     */
    where: CashbookEntryWhereUniqueInput
  }

  /**
   * CashbookEntry deleteMany
   */
  export type CashbookEntryDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CashbookEntries to delete
     */
    where?: CashbookEntryWhereInput
    /**
     * Limit how many CashbookEntries to delete.
     */
    limit?: number
  }

  /**
   * CashbookEntry.customer
   */
  export type CashbookEntry$customerArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Customer
     */
    select?: CustomerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Customer
     */
    omit?: CustomerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerInclude<ExtArgs> | null
    where?: CustomerWhereInput
  }

  /**
   * CashbookEntry without action
   */
  export type CashbookEntryDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CashbookEntry
     */
    select?: CashbookEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the CashbookEntry
     */
    omit?: CashbookEntryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CashbookEntryInclude<ExtArgs> | null
  }


  /**
   * Model UrdPurchase
   */

  export type AggregateUrdPurchase = {
    _count: UrdPurchaseCountAggregateOutputType | null
    _avg: UrdPurchaseAvgAggregateOutputType | null
    _sum: UrdPurchaseSumAggregateOutputType | null
    _min: UrdPurchaseMinAggregateOutputType | null
    _max: UrdPurchaseMaxAggregateOutputType | null
  }

  export type UrdPurchaseAvgAggregateOutputType = {
    id: number | null
    customerId: number | null
    grossWeight: Decimal | null
    netWeight: Decimal | null
    ratePerGram: Decimal | null
    totalAmount: Decimal | null
    saleOffset: Decimal | null
    paid: Decimal | null
    saleId: number | null
  }

  export type UrdPurchaseSumAggregateOutputType = {
    id: number | null
    customerId: number | null
    grossWeight: Decimal | null
    netWeight: Decimal | null
    ratePerGram: Decimal | null
    totalAmount: Decimal | null
    saleOffset: Decimal | null
    paid: Decimal | null
    saleId: number | null
  }

  export type UrdPurchaseMinAggregateOutputType = {
    id: number | null
    purchaseNumber: string | null
    customerId: number | null
    purchaseDate: Date | null
    metal: $Enums.MetalType | null
    purity: string | null
    grossWeight: Decimal | null
    netWeight: Decimal | null
    ratePerGram: Decimal | null
    totalAmount: Decimal | null
    saleOffset: Decimal | null
    paid: Decimal | null
    paymentMethod: $Enums.PaymentMethod | null
    description: string | null
    notes: string | null
    saleId: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UrdPurchaseMaxAggregateOutputType = {
    id: number | null
    purchaseNumber: string | null
    customerId: number | null
    purchaseDate: Date | null
    metal: $Enums.MetalType | null
    purity: string | null
    grossWeight: Decimal | null
    netWeight: Decimal | null
    ratePerGram: Decimal | null
    totalAmount: Decimal | null
    saleOffset: Decimal | null
    paid: Decimal | null
    paymentMethod: $Enums.PaymentMethod | null
    description: string | null
    notes: string | null
    saleId: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UrdPurchaseCountAggregateOutputType = {
    id: number
    purchaseNumber: number
    customerId: number
    purchaseDate: number
    metal: number
    purity: number
    grossWeight: number
    netWeight: number
    ratePerGram: number
    totalAmount: number
    saleOffset: number
    paid: number
    paymentMethod: number
    description: number
    notes: number
    saleId: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UrdPurchaseAvgAggregateInputType = {
    id?: true
    customerId?: true
    grossWeight?: true
    netWeight?: true
    ratePerGram?: true
    totalAmount?: true
    saleOffset?: true
    paid?: true
    saleId?: true
  }

  export type UrdPurchaseSumAggregateInputType = {
    id?: true
    customerId?: true
    grossWeight?: true
    netWeight?: true
    ratePerGram?: true
    totalAmount?: true
    saleOffset?: true
    paid?: true
    saleId?: true
  }

  export type UrdPurchaseMinAggregateInputType = {
    id?: true
    purchaseNumber?: true
    customerId?: true
    purchaseDate?: true
    metal?: true
    purity?: true
    grossWeight?: true
    netWeight?: true
    ratePerGram?: true
    totalAmount?: true
    saleOffset?: true
    paid?: true
    paymentMethod?: true
    description?: true
    notes?: true
    saleId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UrdPurchaseMaxAggregateInputType = {
    id?: true
    purchaseNumber?: true
    customerId?: true
    purchaseDate?: true
    metal?: true
    purity?: true
    grossWeight?: true
    netWeight?: true
    ratePerGram?: true
    totalAmount?: true
    saleOffset?: true
    paid?: true
    paymentMethod?: true
    description?: true
    notes?: true
    saleId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UrdPurchaseCountAggregateInputType = {
    id?: true
    purchaseNumber?: true
    customerId?: true
    purchaseDate?: true
    metal?: true
    purity?: true
    grossWeight?: true
    netWeight?: true
    ratePerGram?: true
    totalAmount?: true
    saleOffset?: true
    paid?: true
    paymentMethod?: true
    description?: true
    notes?: true
    saleId?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type UrdPurchaseAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UrdPurchase to aggregate.
     */
    where?: UrdPurchaseWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UrdPurchases to fetch.
     */
    orderBy?: UrdPurchaseOrderByWithRelationInput | UrdPurchaseOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UrdPurchaseWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UrdPurchases from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UrdPurchases.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned UrdPurchases
    **/
    _count?: true | UrdPurchaseCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UrdPurchaseAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UrdPurchaseSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UrdPurchaseMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UrdPurchaseMaxAggregateInputType
  }

  export type GetUrdPurchaseAggregateType<T extends UrdPurchaseAggregateArgs> = {
        [P in keyof T & keyof AggregateUrdPurchase]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUrdPurchase[P]>
      : GetScalarType<T[P], AggregateUrdPurchase[P]>
  }




  export type UrdPurchaseGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UrdPurchaseWhereInput
    orderBy?: UrdPurchaseOrderByWithAggregationInput | UrdPurchaseOrderByWithAggregationInput[]
    by: UrdPurchaseScalarFieldEnum[] | UrdPurchaseScalarFieldEnum
    having?: UrdPurchaseScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UrdPurchaseCountAggregateInputType | true
    _avg?: UrdPurchaseAvgAggregateInputType
    _sum?: UrdPurchaseSumAggregateInputType
    _min?: UrdPurchaseMinAggregateInputType
    _max?: UrdPurchaseMaxAggregateInputType
  }

  export type UrdPurchaseGroupByOutputType = {
    id: number
    purchaseNumber: string
    customerId: number
    purchaseDate: Date
    metal: $Enums.MetalType
    purity: string | null
    grossWeight: Decimal
    netWeight: Decimal
    ratePerGram: Decimal
    totalAmount: Decimal
    saleOffset: Decimal
    paid: Decimal
    paymentMethod: $Enums.PaymentMethod
    description: string | null
    notes: string | null
    saleId: number | null
    createdAt: Date
    updatedAt: Date
    _count: UrdPurchaseCountAggregateOutputType | null
    _avg: UrdPurchaseAvgAggregateOutputType | null
    _sum: UrdPurchaseSumAggregateOutputType | null
    _min: UrdPurchaseMinAggregateOutputType | null
    _max: UrdPurchaseMaxAggregateOutputType | null
  }

  type GetUrdPurchaseGroupByPayload<T extends UrdPurchaseGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UrdPurchaseGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UrdPurchaseGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UrdPurchaseGroupByOutputType[P]>
            : GetScalarType<T[P], UrdPurchaseGroupByOutputType[P]>
        }
      >
    >


  export type UrdPurchaseSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    purchaseNumber?: boolean
    customerId?: boolean
    purchaseDate?: boolean
    metal?: boolean
    purity?: boolean
    grossWeight?: boolean
    netWeight?: boolean
    ratePerGram?: boolean
    totalAmount?: boolean
    saleOffset?: boolean
    paid?: boolean
    paymentMethod?: boolean
    description?: boolean
    notes?: boolean
    saleId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    customer?: boolean | CustomerDefaultArgs<ExtArgs>
    sale?: boolean | UrdPurchase$saleArgs<ExtArgs>
  }, ExtArgs["result"]["urdPurchase"]>



  export type UrdPurchaseSelectScalar = {
    id?: boolean
    purchaseNumber?: boolean
    customerId?: boolean
    purchaseDate?: boolean
    metal?: boolean
    purity?: boolean
    grossWeight?: boolean
    netWeight?: boolean
    ratePerGram?: boolean
    totalAmount?: boolean
    saleOffset?: boolean
    paid?: boolean
    paymentMethod?: boolean
    description?: boolean
    notes?: boolean
    saleId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type UrdPurchaseOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "purchaseNumber" | "customerId" | "purchaseDate" | "metal" | "purity" | "grossWeight" | "netWeight" | "ratePerGram" | "totalAmount" | "saleOffset" | "paid" | "paymentMethod" | "description" | "notes" | "saleId" | "createdAt" | "updatedAt", ExtArgs["result"]["urdPurchase"]>
  export type UrdPurchaseInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    customer?: boolean | CustomerDefaultArgs<ExtArgs>
    sale?: boolean | UrdPurchase$saleArgs<ExtArgs>
  }

  export type $UrdPurchasePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "UrdPurchase"
    objects: {
      customer: Prisma.$CustomerPayload<ExtArgs>
      sale: Prisma.$SalePayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      purchaseNumber: string
      customerId: number
      purchaseDate: Date
      metal: $Enums.MetalType
      purity: string | null
      grossWeight: Prisma.Decimal
      netWeight: Prisma.Decimal
      ratePerGram: Prisma.Decimal
      totalAmount: Prisma.Decimal
      saleOffset: Prisma.Decimal
      paid: Prisma.Decimal
      paymentMethod: $Enums.PaymentMethod
      description: string | null
      notes: string | null
      saleId: number | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["urdPurchase"]>
    composites: {}
  }

  type UrdPurchaseGetPayload<S extends boolean | null | undefined | UrdPurchaseDefaultArgs> = $Result.GetResult<Prisma.$UrdPurchasePayload, S>

  type UrdPurchaseCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UrdPurchaseFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UrdPurchaseCountAggregateInputType | true
    }

  export interface UrdPurchaseDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['UrdPurchase'], meta: { name: 'UrdPurchase' } }
    /**
     * Find zero or one UrdPurchase that matches the filter.
     * @param {UrdPurchaseFindUniqueArgs} args - Arguments to find a UrdPurchase
     * @example
     * // Get one UrdPurchase
     * const urdPurchase = await prisma.urdPurchase.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UrdPurchaseFindUniqueArgs>(args: SelectSubset<T, UrdPurchaseFindUniqueArgs<ExtArgs>>): Prisma__UrdPurchaseClient<$Result.GetResult<Prisma.$UrdPurchasePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one UrdPurchase that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UrdPurchaseFindUniqueOrThrowArgs} args - Arguments to find a UrdPurchase
     * @example
     * // Get one UrdPurchase
     * const urdPurchase = await prisma.urdPurchase.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UrdPurchaseFindUniqueOrThrowArgs>(args: SelectSubset<T, UrdPurchaseFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UrdPurchaseClient<$Result.GetResult<Prisma.$UrdPurchasePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UrdPurchase that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UrdPurchaseFindFirstArgs} args - Arguments to find a UrdPurchase
     * @example
     * // Get one UrdPurchase
     * const urdPurchase = await prisma.urdPurchase.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UrdPurchaseFindFirstArgs>(args?: SelectSubset<T, UrdPurchaseFindFirstArgs<ExtArgs>>): Prisma__UrdPurchaseClient<$Result.GetResult<Prisma.$UrdPurchasePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UrdPurchase that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UrdPurchaseFindFirstOrThrowArgs} args - Arguments to find a UrdPurchase
     * @example
     * // Get one UrdPurchase
     * const urdPurchase = await prisma.urdPurchase.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UrdPurchaseFindFirstOrThrowArgs>(args?: SelectSubset<T, UrdPurchaseFindFirstOrThrowArgs<ExtArgs>>): Prisma__UrdPurchaseClient<$Result.GetResult<Prisma.$UrdPurchasePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more UrdPurchases that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UrdPurchaseFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all UrdPurchases
     * const urdPurchases = await prisma.urdPurchase.findMany()
     * 
     * // Get first 10 UrdPurchases
     * const urdPurchases = await prisma.urdPurchase.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const urdPurchaseWithIdOnly = await prisma.urdPurchase.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UrdPurchaseFindManyArgs>(args?: SelectSubset<T, UrdPurchaseFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UrdPurchasePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a UrdPurchase.
     * @param {UrdPurchaseCreateArgs} args - Arguments to create a UrdPurchase.
     * @example
     * // Create one UrdPurchase
     * const UrdPurchase = await prisma.urdPurchase.create({
     *   data: {
     *     // ... data to create a UrdPurchase
     *   }
     * })
     * 
     */
    create<T extends UrdPurchaseCreateArgs>(args: SelectSubset<T, UrdPurchaseCreateArgs<ExtArgs>>): Prisma__UrdPurchaseClient<$Result.GetResult<Prisma.$UrdPurchasePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many UrdPurchases.
     * @param {UrdPurchaseCreateManyArgs} args - Arguments to create many UrdPurchases.
     * @example
     * // Create many UrdPurchases
     * const urdPurchase = await prisma.urdPurchase.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UrdPurchaseCreateManyArgs>(args?: SelectSubset<T, UrdPurchaseCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a UrdPurchase.
     * @param {UrdPurchaseDeleteArgs} args - Arguments to delete one UrdPurchase.
     * @example
     * // Delete one UrdPurchase
     * const UrdPurchase = await prisma.urdPurchase.delete({
     *   where: {
     *     // ... filter to delete one UrdPurchase
     *   }
     * })
     * 
     */
    delete<T extends UrdPurchaseDeleteArgs>(args: SelectSubset<T, UrdPurchaseDeleteArgs<ExtArgs>>): Prisma__UrdPurchaseClient<$Result.GetResult<Prisma.$UrdPurchasePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one UrdPurchase.
     * @param {UrdPurchaseUpdateArgs} args - Arguments to update one UrdPurchase.
     * @example
     * // Update one UrdPurchase
     * const urdPurchase = await prisma.urdPurchase.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UrdPurchaseUpdateArgs>(args: SelectSubset<T, UrdPurchaseUpdateArgs<ExtArgs>>): Prisma__UrdPurchaseClient<$Result.GetResult<Prisma.$UrdPurchasePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more UrdPurchases.
     * @param {UrdPurchaseDeleteManyArgs} args - Arguments to filter UrdPurchases to delete.
     * @example
     * // Delete a few UrdPurchases
     * const { count } = await prisma.urdPurchase.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UrdPurchaseDeleteManyArgs>(args?: SelectSubset<T, UrdPurchaseDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UrdPurchases.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UrdPurchaseUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many UrdPurchases
     * const urdPurchase = await prisma.urdPurchase.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UrdPurchaseUpdateManyArgs>(args: SelectSubset<T, UrdPurchaseUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one UrdPurchase.
     * @param {UrdPurchaseUpsertArgs} args - Arguments to update or create a UrdPurchase.
     * @example
     * // Update or create a UrdPurchase
     * const urdPurchase = await prisma.urdPurchase.upsert({
     *   create: {
     *     // ... data to create a UrdPurchase
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the UrdPurchase we want to update
     *   }
     * })
     */
    upsert<T extends UrdPurchaseUpsertArgs>(args: SelectSubset<T, UrdPurchaseUpsertArgs<ExtArgs>>): Prisma__UrdPurchaseClient<$Result.GetResult<Prisma.$UrdPurchasePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of UrdPurchases.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UrdPurchaseCountArgs} args - Arguments to filter UrdPurchases to count.
     * @example
     * // Count the number of UrdPurchases
     * const count = await prisma.urdPurchase.count({
     *   where: {
     *     // ... the filter for the UrdPurchases we want to count
     *   }
     * })
    **/
    count<T extends UrdPurchaseCountArgs>(
      args?: Subset<T, UrdPurchaseCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UrdPurchaseCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a UrdPurchase.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UrdPurchaseAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UrdPurchaseAggregateArgs>(args: Subset<T, UrdPurchaseAggregateArgs>): Prisma.PrismaPromise<GetUrdPurchaseAggregateType<T>>

    /**
     * Group by UrdPurchase.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UrdPurchaseGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UrdPurchaseGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UrdPurchaseGroupByArgs['orderBy'] }
        : { orderBy?: UrdPurchaseGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UrdPurchaseGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUrdPurchaseGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the UrdPurchase model
   */
  readonly fields: UrdPurchaseFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for UrdPurchase.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UrdPurchaseClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    customer<T extends CustomerDefaultArgs<ExtArgs> = {}>(args?: Subset<T, CustomerDefaultArgs<ExtArgs>>): Prisma__CustomerClient<$Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    sale<T extends UrdPurchase$saleArgs<ExtArgs> = {}>(args?: Subset<T, UrdPurchase$saleArgs<ExtArgs>>): Prisma__SaleClient<$Result.GetResult<Prisma.$SalePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the UrdPurchase model
   */
  interface UrdPurchaseFieldRefs {
    readonly id: FieldRef<"UrdPurchase", 'Int'>
    readonly purchaseNumber: FieldRef<"UrdPurchase", 'String'>
    readonly customerId: FieldRef<"UrdPurchase", 'Int'>
    readonly purchaseDate: FieldRef<"UrdPurchase", 'DateTime'>
    readonly metal: FieldRef<"UrdPurchase", 'MetalType'>
    readonly purity: FieldRef<"UrdPurchase", 'String'>
    readonly grossWeight: FieldRef<"UrdPurchase", 'Decimal'>
    readonly netWeight: FieldRef<"UrdPurchase", 'Decimal'>
    readonly ratePerGram: FieldRef<"UrdPurchase", 'Decimal'>
    readonly totalAmount: FieldRef<"UrdPurchase", 'Decimal'>
    readonly saleOffset: FieldRef<"UrdPurchase", 'Decimal'>
    readonly paid: FieldRef<"UrdPurchase", 'Decimal'>
    readonly paymentMethod: FieldRef<"UrdPurchase", 'PaymentMethod'>
    readonly description: FieldRef<"UrdPurchase", 'String'>
    readonly notes: FieldRef<"UrdPurchase", 'String'>
    readonly saleId: FieldRef<"UrdPurchase", 'Int'>
    readonly createdAt: FieldRef<"UrdPurchase", 'DateTime'>
    readonly updatedAt: FieldRef<"UrdPurchase", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * UrdPurchase findUnique
   */
  export type UrdPurchaseFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UrdPurchase
     */
    select?: UrdPurchaseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UrdPurchase
     */
    omit?: UrdPurchaseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UrdPurchaseInclude<ExtArgs> | null
    /**
     * Filter, which UrdPurchase to fetch.
     */
    where: UrdPurchaseWhereUniqueInput
  }

  /**
   * UrdPurchase findUniqueOrThrow
   */
  export type UrdPurchaseFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UrdPurchase
     */
    select?: UrdPurchaseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UrdPurchase
     */
    omit?: UrdPurchaseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UrdPurchaseInclude<ExtArgs> | null
    /**
     * Filter, which UrdPurchase to fetch.
     */
    where: UrdPurchaseWhereUniqueInput
  }

  /**
   * UrdPurchase findFirst
   */
  export type UrdPurchaseFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UrdPurchase
     */
    select?: UrdPurchaseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UrdPurchase
     */
    omit?: UrdPurchaseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UrdPurchaseInclude<ExtArgs> | null
    /**
     * Filter, which UrdPurchase to fetch.
     */
    where?: UrdPurchaseWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UrdPurchases to fetch.
     */
    orderBy?: UrdPurchaseOrderByWithRelationInput | UrdPurchaseOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UrdPurchases.
     */
    cursor?: UrdPurchaseWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UrdPurchases from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UrdPurchases.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UrdPurchases.
     */
    distinct?: UrdPurchaseScalarFieldEnum | UrdPurchaseScalarFieldEnum[]
  }

  /**
   * UrdPurchase findFirstOrThrow
   */
  export type UrdPurchaseFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UrdPurchase
     */
    select?: UrdPurchaseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UrdPurchase
     */
    omit?: UrdPurchaseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UrdPurchaseInclude<ExtArgs> | null
    /**
     * Filter, which UrdPurchase to fetch.
     */
    where?: UrdPurchaseWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UrdPurchases to fetch.
     */
    orderBy?: UrdPurchaseOrderByWithRelationInput | UrdPurchaseOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UrdPurchases.
     */
    cursor?: UrdPurchaseWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UrdPurchases from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UrdPurchases.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UrdPurchases.
     */
    distinct?: UrdPurchaseScalarFieldEnum | UrdPurchaseScalarFieldEnum[]
  }

  /**
   * UrdPurchase findMany
   */
  export type UrdPurchaseFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UrdPurchase
     */
    select?: UrdPurchaseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UrdPurchase
     */
    omit?: UrdPurchaseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UrdPurchaseInclude<ExtArgs> | null
    /**
     * Filter, which UrdPurchases to fetch.
     */
    where?: UrdPurchaseWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UrdPurchases to fetch.
     */
    orderBy?: UrdPurchaseOrderByWithRelationInput | UrdPurchaseOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing UrdPurchases.
     */
    cursor?: UrdPurchaseWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UrdPurchases from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UrdPurchases.
     */
    skip?: number
    distinct?: UrdPurchaseScalarFieldEnum | UrdPurchaseScalarFieldEnum[]
  }

  /**
   * UrdPurchase create
   */
  export type UrdPurchaseCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UrdPurchase
     */
    select?: UrdPurchaseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UrdPurchase
     */
    omit?: UrdPurchaseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UrdPurchaseInclude<ExtArgs> | null
    /**
     * The data needed to create a UrdPurchase.
     */
    data: XOR<UrdPurchaseCreateInput, UrdPurchaseUncheckedCreateInput>
  }

  /**
   * UrdPurchase createMany
   */
  export type UrdPurchaseCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many UrdPurchases.
     */
    data: UrdPurchaseCreateManyInput | UrdPurchaseCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * UrdPurchase update
   */
  export type UrdPurchaseUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UrdPurchase
     */
    select?: UrdPurchaseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UrdPurchase
     */
    omit?: UrdPurchaseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UrdPurchaseInclude<ExtArgs> | null
    /**
     * The data needed to update a UrdPurchase.
     */
    data: XOR<UrdPurchaseUpdateInput, UrdPurchaseUncheckedUpdateInput>
    /**
     * Choose, which UrdPurchase to update.
     */
    where: UrdPurchaseWhereUniqueInput
  }

  /**
   * UrdPurchase updateMany
   */
  export type UrdPurchaseUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update UrdPurchases.
     */
    data: XOR<UrdPurchaseUpdateManyMutationInput, UrdPurchaseUncheckedUpdateManyInput>
    /**
     * Filter which UrdPurchases to update
     */
    where?: UrdPurchaseWhereInput
    /**
     * Limit how many UrdPurchases to update.
     */
    limit?: number
  }

  /**
   * UrdPurchase upsert
   */
  export type UrdPurchaseUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UrdPurchase
     */
    select?: UrdPurchaseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UrdPurchase
     */
    omit?: UrdPurchaseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UrdPurchaseInclude<ExtArgs> | null
    /**
     * The filter to search for the UrdPurchase to update in case it exists.
     */
    where: UrdPurchaseWhereUniqueInput
    /**
     * In case the UrdPurchase found by the `where` argument doesn't exist, create a new UrdPurchase with this data.
     */
    create: XOR<UrdPurchaseCreateInput, UrdPurchaseUncheckedCreateInput>
    /**
     * In case the UrdPurchase was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UrdPurchaseUpdateInput, UrdPurchaseUncheckedUpdateInput>
  }

  /**
   * UrdPurchase delete
   */
  export type UrdPurchaseDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UrdPurchase
     */
    select?: UrdPurchaseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UrdPurchase
     */
    omit?: UrdPurchaseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UrdPurchaseInclude<ExtArgs> | null
    /**
     * Filter which UrdPurchase to delete.
     */
    where: UrdPurchaseWhereUniqueInput
  }

  /**
   * UrdPurchase deleteMany
   */
  export type UrdPurchaseDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UrdPurchases to delete
     */
    where?: UrdPurchaseWhereInput
    /**
     * Limit how many UrdPurchases to delete.
     */
    limit?: number
  }

  /**
   * UrdPurchase.sale
   */
  export type UrdPurchase$saleArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Sale
     */
    select?: SaleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Sale
     */
    omit?: SaleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SaleInclude<ExtArgs> | null
    where?: SaleWhereInput
  }

  /**
   * UrdPurchase without action
   */
  export type UrdPurchaseDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UrdPurchase
     */
    select?: UrdPurchaseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UrdPurchase
     */
    omit?: UrdPurchaseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UrdPurchaseInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const CustomerScalarFieldEnum: {
    id: 'id',
    name: 'name',
    phone: 'phone',
    email: 'email',
    address: 'address',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type CustomerScalarFieldEnum = (typeof CustomerScalarFieldEnum)[keyof typeof CustomerScalarFieldEnum]


  export const SupplierScalarFieldEnum: {
    id: 'id',
    name: 'name',
    phone: 'phone',
    email: 'email',
    address: 'address',
    gstin: 'gstin',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type SupplierScalarFieldEnum = (typeof SupplierScalarFieldEnum)[keyof typeof SupplierScalarFieldEnum]


  export const ProductScalarFieldEnum: {
    id: 'id',
    barcode: 'barcode',
    sku: 'sku',
    name: 'name',
    category: 'category',
    metal: 'metal',
    purity: 'purity',
    grossWeight: 'grossWeight',
    stoneWeight: 'stoneWeight',
    netWeight: 'netWeight',
    quantity: 'quantity',
    reorderLevel: 'reorderLevel',
    purchasePrice: 'purchasePrice',
    sellingPrice: 'sellingPrice',
    makingChargePerGram: 'makingChargePerGram',
    makingChargeType: 'makingChargeType',
    makingChargeValue: 'makingChargeValue',
    location: 'location',
    notes: 'notes',
    status: 'status',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ProductScalarFieldEnum = (typeof ProductScalarFieldEnum)[keyof typeof ProductScalarFieldEnum]


  export const StockMovementScalarFieldEnum: {
    id: 'id',
    productId: 'productId',
    type: 'type',
    quantity: 'quantity',
    note: 'note',
    createdAt: 'createdAt'
  };

  export type StockMovementScalarFieldEnum = (typeof StockMovementScalarFieldEnum)[keyof typeof StockMovementScalarFieldEnum]


  export const PurchaseScalarFieldEnum: {
    id: 'id',
    purchaseNumber: 'purchaseNumber',
    supplierId: 'supplierId',
    purchaseDate: 'purchaseDate',
    subtotal: 'subtotal',
    discount: 'discount',
    total: 'total',
    paid: 'paid',
    paymentMethod: 'paymentMethod',
    notes: 'notes',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type PurchaseScalarFieldEnum = (typeof PurchaseScalarFieldEnum)[keyof typeof PurchaseScalarFieldEnum]


  export const PurchaseItemScalarFieldEnum: {
    id: 'id',
    purchaseId: 'purchaseId',
    productId: 'productId',
    quantity: 'quantity',
    unitCost: 'unitCost',
    lineTotal: 'lineTotal'
  };

  export type PurchaseItemScalarFieldEnum = (typeof PurchaseItemScalarFieldEnum)[keyof typeof PurchaseItemScalarFieldEnum]


  export const SaleScalarFieldEnum: {
    id: 'id',
    invoiceNumber: 'invoiceNumber',
    customerId: 'customerId',
    saleDate: 'saleDate',
    subtotal: 'subtotal',
    discount: 'discount',
    gstRate: 'gstRate',
    gstAmount: 'gstAmount',
    total: 'total',
    urdOffset: 'urdOffset',
    paid: 'paid',
    cashPaid: 'cashPaid',
    upiPaid: 'upiPaid',
    balance: 'balance',
    paymentMethod: 'paymentMethod',
    notes: 'notes',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type SaleScalarFieldEnum = (typeof SaleScalarFieldEnum)[keyof typeof SaleScalarFieldEnum]


  export const SaleItemScalarFieldEnum: {
    id: 'id',
    saleId: 'saleId',
    productId: 'productId',
    quantity: 'quantity',
    weight: 'weight',
    unitPrice: 'unitPrice',
    metalRate: 'metalRate',
    metalAmount: 'metalAmount',
    makingCharge: 'makingCharge',
    makingChargeType: 'makingChargeType',
    makingChargeValue: 'makingChargeValue',
    taxableAmount: 'taxableAmount',
    lineTotal: 'lineTotal'
  };

  export type SaleItemScalarFieldEnum = (typeof SaleItemScalarFieldEnum)[keyof typeof SaleItemScalarFieldEnum]


  export const DailyRateScalarFieldEnum: {
    id: 'id',
    rateDate: 'rateDate',
    gold22k: 'gold22k',
    gold24k: 'gold24k',
    silver: 'silver',
    note: 'note',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type DailyRateScalarFieldEnum = (typeof DailyRateScalarFieldEnum)[keyof typeof DailyRateScalarFieldEnum]


  export const BarcodeSequenceScalarFieldEnum: {
    prefix: 'prefix',
    lastNumber: 'lastNumber',
    updatedAt: 'updatedAt'
  };

  export type BarcodeSequenceScalarFieldEnum = (typeof BarcodeSequenceScalarFieldEnum)[keyof typeof BarcodeSequenceScalarFieldEnum]


  export const CustomerLedgerScalarFieldEnum: {
    id: 'id',
    customerId: 'customerId',
    saleId: 'saleId',
    type: 'type',
    amount: 'amount',
    paymentMethod: 'paymentMethod',
    reference: 'reference',
    note: 'note',
    createdAt: 'createdAt'
  };

  export type CustomerLedgerScalarFieldEnum = (typeof CustomerLedgerScalarFieldEnum)[keyof typeof CustomerLedgerScalarFieldEnum]


  export const RepairScalarFieldEnum: {
    id: 'id',
    repairNumber: 'repairNumber',
    customerId: 'customerId',
    itemDescription: 'itemDescription',
    metal: 'metal',
    grossWeight: 'grossWeight',
    issueDescription: 'issueDescription',
    estimatedCharge: 'estimatedCharge',
    finalCharge: 'finalCharge',
    advancePaid: 'advancePaid',
    advancePaymentMethod: 'advancePaymentMethod',
    dueDate: 'dueDate',
    status: 'status',
    receivedAt: 'receivedAt',
    deliveredAt: 'deliveredAt',
    notes: 'notes',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type RepairScalarFieldEnum = (typeof RepairScalarFieldEnum)[keyof typeof RepairScalarFieldEnum]


  export const CashbookEntryScalarFieldEnum: {
    id: 'id',
    entryDate: 'entryDate',
    type: 'type',
    paymentMethod: 'paymentMethod',
    description: 'description',
    amount: 'amount',
    reference: 'reference',
    notes: 'notes',
    customerId: 'customerId',
    syncLedger: 'syncLedger',
    createdAt: 'createdAt'
  };

  export type CashbookEntryScalarFieldEnum = (typeof CashbookEntryScalarFieldEnum)[keyof typeof CashbookEntryScalarFieldEnum]


  export const UrdPurchaseScalarFieldEnum: {
    id: 'id',
    purchaseNumber: 'purchaseNumber',
    customerId: 'customerId',
    purchaseDate: 'purchaseDate',
    metal: 'metal',
    purity: 'purity',
    grossWeight: 'grossWeight',
    netWeight: 'netWeight',
    ratePerGram: 'ratePerGram',
    totalAmount: 'totalAmount',
    saleOffset: 'saleOffset',
    paid: 'paid',
    paymentMethod: 'paymentMethod',
    description: 'description',
    notes: 'notes',
    saleId: 'saleId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type UrdPurchaseScalarFieldEnum = (typeof UrdPurchaseScalarFieldEnum)[keyof typeof UrdPurchaseScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const CustomerOrderByRelevanceFieldEnum: {
    name: 'name',
    phone: 'phone',
    email: 'email',
    address: 'address'
  };

  export type CustomerOrderByRelevanceFieldEnum = (typeof CustomerOrderByRelevanceFieldEnum)[keyof typeof CustomerOrderByRelevanceFieldEnum]


  export const SupplierOrderByRelevanceFieldEnum: {
    name: 'name',
    phone: 'phone',
    email: 'email',
    address: 'address',
    gstin: 'gstin'
  };

  export type SupplierOrderByRelevanceFieldEnum = (typeof SupplierOrderByRelevanceFieldEnum)[keyof typeof SupplierOrderByRelevanceFieldEnum]


  export const ProductOrderByRelevanceFieldEnum: {
    barcode: 'barcode',
    sku: 'sku',
    name: 'name',
    category: 'category',
    purity: 'purity',
    location: 'location',
    notes: 'notes'
  };

  export type ProductOrderByRelevanceFieldEnum = (typeof ProductOrderByRelevanceFieldEnum)[keyof typeof ProductOrderByRelevanceFieldEnum]


  export const StockMovementOrderByRelevanceFieldEnum: {
    note: 'note'
  };

  export type StockMovementOrderByRelevanceFieldEnum = (typeof StockMovementOrderByRelevanceFieldEnum)[keyof typeof StockMovementOrderByRelevanceFieldEnum]


  export const PurchaseOrderByRelevanceFieldEnum: {
    purchaseNumber: 'purchaseNumber',
    notes: 'notes'
  };

  export type PurchaseOrderByRelevanceFieldEnum = (typeof PurchaseOrderByRelevanceFieldEnum)[keyof typeof PurchaseOrderByRelevanceFieldEnum]


  export const SaleOrderByRelevanceFieldEnum: {
    invoiceNumber: 'invoiceNumber',
    notes: 'notes'
  };

  export type SaleOrderByRelevanceFieldEnum = (typeof SaleOrderByRelevanceFieldEnum)[keyof typeof SaleOrderByRelevanceFieldEnum]


  export const DailyRateOrderByRelevanceFieldEnum: {
    rateDate: 'rateDate',
    note: 'note'
  };

  export type DailyRateOrderByRelevanceFieldEnum = (typeof DailyRateOrderByRelevanceFieldEnum)[keyof typeof DailyRateOrderByRelevanceFieldEnum]


  export const BarcodeSequenceOrderByRelevanceFieldEnum: {
    prefix: 'prefix'
  };

  export type BarcodeSequenceOrderByRelevanceFieldEnum = (typeof BarcodeSequenceOrderByRelevanceFieldEnum)[keyof typeof BarcodeSequenceOrderByRelevanceFieldEnum]


  export const CustomerLedgerOrderByRelevanceFieldEnum: {
    reference: 'reference',
    note: 'note'
  };

  export type CustomerLedgerOrderByRelevanceFieldEnum = (typeof CustomerLedgerOrderByRelevanceFieldEnum)[keyof typeof CustomerLedgerOrderByRelevanceFieldEnum]


  export const RepairOrderByRelevanceFieldEnum: {
    repairNumber: 'repairNumber',
    itemDescription: 'itemDescription',
    issueDescription: 'issueDescription',
    notes: 'notes'
  };

  export type RepairOrderByRelevanceFieldEnum = (typeof RepairOrderByRelevanceFieldEnum)[keyof typeof RepairOrderByRelevanceFieldEnum]


  export const CashbookEntryOrderByRelevanceFieldEnum: {
    entryDate: 'entryDate',
    description: 'description',
    reference: 'reference',
    notes: 'notes'
  };

  export type CashbookEntryOrderByRelevanceFieldEnum = (typeof CashbookEntryOrderByRelevanceFieldEnum)[keyof typeof CashbookEntryOrderByRelevanceFieldEnum]


  export const UrdPurchaseOrderByRelevanceFieldEnum: {
    purchaseNumber: 'purchaseNumber',
    purity: 'purity',
    description: 'description',
    notes: 'notes'
  };

  export type UrdPurchaseOrderByRelevanceFieldEnum = (typeof UrdPurchaseOrderByRelevanceFieldEnum)[keyof typeof UrdPurchaseOrderByRelevanceFieldEnum]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'MetalType'
   */
  export type EnumMetalTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'MetalType'>
    


  /**
   * Reference to a field of type 'Decimal'
   */
  export type DecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal'>
    


  /**
   * Reference to a field of type 'MakingChargeType'
   */
  export type EnumMakingChargeTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'MakingChargeType'>
    


  /**
   * Reference to a field of type 'ProductStatus'
   */
  export type EnumProductStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ProductStatus'>
    


  /**
   * Reference to a field of type 'MovementType'
   */
  export type EnumMovementTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'MovementType'>
    


  /**
   * Reference to a field of type 'PaymentMethod'
   */
  export type EnumPaymentMethodFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PaymentMethod'>
    


  /**
   * Reference to a field of type 'LedgerEntryType'
   */
  export type EnumLedgerEntryTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'LedgerEntryType'>
    


  /**
   * Reference to a field of type 'RepairStatus'
   */
  export type EnumRepairStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'RepairStatus'>
    


  /**
   * Reference to a field of type 'CashbookType'
   */
  export type EnumCashbookTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'CashbookType'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    
  /**
   * Deep Input Types
   */


  export type CustomerWhereInput = {
    AND?: CustomerWhereInput | CustomerWhereInput[]
    OR?: CustomerWhereInput[]
    NOT?: CustomerWhereInput | CustomerWhereInput[]
    id?: IntFilter<"Customer"> | number
    name?: StringFilter<"Customer"> | string
    phone?: StringNullableFilter<"Customer"> | string | null
    email?: StringNullableFilter<"Customer"> | string | null
    address?: StringNullableFilter<"Customer"> | string | null
    createdAt?: DateTimeFilter<"Customer"> | Date | string
    updatedAt?: DateTimeFilter<"Customer"> | Date | string
    sales?: SaleListRelationFilter
    repairs?: RepairListRelationFilter
    ledger?: CustomerLedgerListRelationFilter
    urdPurchases?: UrdPurchaseListRelationFilter
    cashbookEntries?: CashbookEntryListRelationFilter
  }

  export type CustomerOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    phone?: SortOrderInput | SortOrder
    email?: SortOrderInput | SortOrder
    address?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    sales?: SaleOrderByRelationAggregateInput
    repairs?: RepairOrderByRelationAggregateInput
    ledger?: CustomerLedgerOrderByRelationAggregateInput
    urdPurchases?: UrdPurchaseOrderByRelationAggregateInput
    cashbookEntries?: CashbookEntryOrderByRelationAggregateInput
    _relevance?: CustomerOrderByRelevanceInput
  }

  export type CustomerWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    phone?: string
    AND?: CustomerWhereInput | CustomerWhereInput[]
    OR?: CustomerWhereInput[]
    NOT?: CustomerWhereInput | CustomerWhereInput[]
    name?: StringFilter<"Customer"> | string
    email?: StringNullableFilter<"Customer"> | string | null
    address?: StringNullableFilter<"Customer"> | string | null
    createdAt?: DateTimeFilter<"Customer"> | Date | string
    updatedAt?: DateTimeFilter<"Customer"> | Date | string
    sales?: SaleListRelationFilter
    repairs?: RepairListRelationFilter
    ledger?: CustomerLedgerListRelationFilter
    urdPurchases?: UrdPurchaseListRelationFilter
    cashbookEntries?: CashbookEntryListRelationFilter
  }, "id" | "phone">

  export type CustomerOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    phone?: SortOrderInput | SortOrder
    email?: SortOrderInput | SortOrder
    address?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: CustomerCountOrderByAggregateInput
    _avg?: CustomerAvgOrderByAggregateInput
    _max?: CustomerMaxOrderByAggregateInput
    _min?: CustomerMinOrderByAggregateInput
    _sum?: CustomerSumOrderByAggregateInput
  }

  export type CustomerScalarWhereWithAggregatesInput = {
    AND?: CustomerScalarWhereWithAggregatesInput | CustomerScalarWhereWithAggregatesInput[]
    OR?: CustomerScalarWhereWithAggregatesInput[]
    NOT?: CustomerScalarWhereWithAggregatesInput | CustomerScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Customer"> | number
    name?: StringWithAggregatesFilter<"Customer"> | string
    phone?: StringNullableWithAggregatesFilter<"Customer"> | string | null
    email?: StringNullableWithAggregatesFilter<"Customer"> | string | null
    address?: StringNullableWithAggregatesFilter<"Customer"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Customer"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Customer"> | Date | string
  }

  export type SupplierWhereInput = {
    AND?: SupplierWhereInput | SupplierWhereInput[]
    OR?: SupplierWhereInput[]
    NOT?: SupplierWhereInput | SupplierWhereInput[]
    id?: IntFilter<"Supplier"> | number
    name?: StringFilter<"Supplier"> | string
    phone?: StringNullableFilter<"Supplier"> | string | null
    email?: StringNullableFilter<"Supplier"> | string | null
    address?: StringNullableFilter<"Supplier"> | string | null
    gstin?: StringNullableFilter<"Supplier"> | string | null
    createdAt?: DateTimeFilter<"Supplier"> | Date | string
    updatedAt?: DateTimeFilter<"Supplier"> | Date | string
    purchases?: PurchaseListRelationFilter
  }

  export type SupplierOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    phone?: SortOrderInput | SortOrder
    email?: SortOrderInput | SortOrder
    address?: SortOrderInput | SortOrder
    gstin?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    purchases?: PurchaseOrderByRelationAggregateInput
    _relevance?: SupplierOrderByRelevanceInput
  }

  export type SupplierWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: SupplierWhereInput | SupplierWhereInput[]
    OR?: SupplierWhereInput[]
    NOT?: SupplierWhereInput | SupplierWhereInput[]
    name?: StringFilter<"Supplier"> | string
    phone?: StringNullableFilter<"Supplier"> | string | null
    email?: StringNullableFilter<"Supplier"> | string | null
    address?: StringNullableFilter<"Supplier"> | string | null
    gstin?: StringNullableFilter<"Supplier"> | string | null
    createdAt?: DateTimeFilter<"Supplier"> | Date | string
    updatedAt?: DateTimeFilter<"Supplier"> | Date | string
    purchases?: PurchaseListRelationFilter
  }, "id">

  export type SupplierOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    phone?: SortOrderInput | SortOrder
    email?: SortOrderInput | SortOrder
    address?: SortOrderInput | SortOrder
    gstin?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: SupplierCountOrderByAggregateInput
    _avg?: SupplierAvgOrderByAggregateInput
    _max?: SupplierMaxOrderByAggregateInput
    _min?: SupplierMinOrderByAggregateInput
    _sum?: SupplierSumOrderByAggregateInput
  }

  export type SupplierScalarWhereWithAggregatesInput = {
    AND?: SupplierScalarWhereWithAggregatesInput | SupplierScalarWhereWithAggregatesInput[]
    OR?: SupplierScalarWhereWithAggregatesInput[]
    NOT?: SupplierScalarWhereWithAggregatesInput | SupplierScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Supplier"> | number
    name?: StringWithAggregatesFilter<"Supplier"> | string
    phone?: StringNullableWithAggregatesFilter<"Supplier"> | string | null
    email?: StringNullableWithAggregatesFilter<"Supplier"> | string | null
    address?: StringNullableWithAggregatesFilter<"Supplier"> | string | null
    gstin?: StringNullableWithAggregatesFilter<"Supplier"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Supplier"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Supplier"> | Date | string
  }

  export type ProductWhereInput = {
    AND?: ProductWhereInput | ProductWhereInput[]
    OR?: ProductWhereInput[]
    NOT?: ProductWhereInput | ProductWhereInput[]
    id?: IntFilter<"Product"> | number
    barcode?: StringNullableFilter<"Product"> | string | null
    sku?: StringFilter<"Product"> | string
    name?: StringFilter<"Product"> | string
    category?: StringFilter<"Product"> | string
    metal?: EnumMetalTypeFilter<"Product"> | $Enums.MetalType
    purity?: StringNullableFilter<"Product"> | string | null
    grossWeight?: DecimalFilter<"Product"> | Decimal | DecimalJsLike | number | string
    stoneWeight?: DecimalFilter<"Product"> | Decimal | DecimalJsLike | number | string
    netWeight?: DecimalFilter<"Product"> | Decimal | DecimalJsLike | number | string
    quantity?: IntFilter<"Product"> | number
    reorderLevel?: IntFilter<"Product"> | number
    purchasePrice?: DecimalFilter<"Product"> | Decimal | DecimalJsLike | number | string
    sellingPrice?: DecimalFilter<"Product"> | Decimal | DecimalJsLike | number | string
    makingChargePerGram?: DecimalFilter<"Product"> | Decimal | DecimalJsLike | number | string
    makingChargeType?: EnumMakingChargeTypeFilter<"Product"> | $Enums.MakingChargeType
    makingChargeValue?: DecimalFilter<"Product"> | Decimal | DecimalJsLike | number | string
    location?: StringNullableFilter<"Product"> | string | null
    notes?: StringNullableFilter<"Product"> | string | null
    status?: EnumProductStatusFilter<"Product"> | $Enums.ProductStatus
    createdAt?: DateTimeFilter<"Product"> | Date | string
    updatedAt?: DateTimeFilter<"Product"> | Date | string
    saleItems?: SaleItemListRelationFilter
    purchaseItems?: PurchaseItemListRelationFilter
    movements?: StockMovementListRelationFilter
  }

  export type ProductOrderByWithRelationInput = {
    id?: SortOrder
    barcode?: SortOrderInput | SortOrder
    sku?: SortOrder
    name?: SortOrder
    category?: SortOrder
    metal?: SortOrder
    purity?: SortOrderInput | SortOrder
    grossWeight?: SortOrder
    stoneWeight?: SortOrder
    netWeight?: SortOrder
    quantity?: SortOrder
    reorderLevel?: SortOrder
    purchasePrice?: SortOrder
    sellingPrice?: SortOrder
    makingChargePerGram?: SortOrder
    makingChargeType?: SortOrder
    makingChargeValue?: SortOrder
    location?: SortOrderInput | SortOrder
    notes?: SortOrderInput | SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    saleItems?: SaleItemOrderByRelationAggregateInput
    purchaseItems?: PurchaseItemOrderByRelationAggregateInput
    movements?: StockMovementOrderByRelationAggregateInput
    _relevance?: ProductOrderByRelevanceInput
  }

  export type ProductWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    barcode?: string
    sku?: string
    AND?: ProductWhereInput | ProductWhereInput[]
    OR?: ProductWhereInput[]
    NOT?: ProductWhereInput | ProductWhereInput[]
    name?: StringFilter<"Product"> | string
    category?: StringFilter<"Product"> | string
    metal?: EnumMetalTypeFilter<"Product"> | $Enums.MetalType
    purity?: StringNullableFilter<"Product"> | string | null
    grossWeight?: DecimalFilter<"Product"> | Decimal | DecimalJsLike | number | string
    stoneWeight?: DecimalFilter<"Product"> | Decimal | DecimalJsLike | number | string
    netWeight?: DecimalFilter<"Product"> | Decimal | DecimalJsLike | number | string
    quantity?: IntFilter<"Product"> | number
    reorderLevel?: IntFilter<"Product"> | number
    purchasePrice?: DecimalFilter<"Product"> | Decimal | DecimalJsLike | number | string
    sellingPrice?: DecimalFilter<"Product"> | Decimal | DecimalJsLike | number | string
    makingChargePerGram?: DecimalFilter<"Product"> | Decimal | DecimalJsLike | number | string
    makingChargeType?: EnumMakingChargeTypeFilter<"Product"> | $Enums.MakingChargeType
    makingChargeValue?: DecimalFilter<"Product"> | Decimal | DecimalJsLike | number | string
    location?: StringNullableFilter<"Product"> | string | null
    notes?: StringNullableFilter<"Product"> | string | null
    status?: EnumProductStatusFilter<"Product"> | $Enums.ProductStatus
    createdAt?: DateTimeFilter<"Product"> | Date | string
    updatedAt?: DateTimeFilter<"Product"> | Date | string
    saleItems?: SaleItemListRelationFilter
    purchaseItems?: PurchaseItemListRelationFilter
    movements?: StockMovementListRelationFilter
  }, "id" | "barcode" | "sku">

  export type ProductOrderByWithAggregationInput = {
    id?: SortOrder
    barcode?: SortOrderInput | SortOrder
    sku?: SortOrder
    name?: SortOrder
    category?: SortOrder
    metal?: SortOrder
    purity?: SortOrderInput | SortOrder
    grossWeight?: SortOrder
    stoneWeight?: SortOrder
    netWeight?: SortOrder
    quantity?: SortOrder
    reorderLevel?: SortOrder
    purchasePrice?: SortOrder
    sellingPrice?: SortOrder
    makingChargePerGram?: SortOrder
    makingChargeType?: SortOrder
    makingChargeValue?: SortOrder
    location?: SortOrderInput | SortOrder
    notes?: SortOrderInput | SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ProductCountOrderByAggregateInput
    _avg?: ProductAvgOrderByAggregateInput
    _max?: ProductMaxOrderByAggregateInput
    _min?: ProductMinOrderByAggregateInput
    _sum?: ProductSumOrderByAggregateInput
  }

  export type ProductScalarWhereWithAggregatesInput = {
    AND?: ProductScalarWhereWithAggregatesInput | ProductScalarWhereWithAggregatesInput[]
    OR?: ProductScalarWhereWithAggregatesInput[]
    NOT?: ProductScalarWhereWithAggregatesInput | ProductScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Product"> | number
    barcode?: StringNullableWithAggregatesFilter<"Product"> | string | null
    sku?: StringWithAggregatesFilter<"Product"> | string
    name?: StringWithAggregatesFilter<"Product"> | string
    category?: StringWithAggregatesFilter<"Product"> | string
    metal?: EnumMetalTypeWithAggregatesFilter<"Product"> | $Enums.MetalType
    purity?: StringNullableWithAggregatesFilter<"Product"> | string | null
    grossWeight?: DecimalWithAggregatesFilter<"Product"> | Decimal | DecimalJsLike | number | string
    stoneWeight?: DecimalWithAggregatesFilter<"Product"> | Decimal | DecimalJsLike | number | string
    netWeight?: DecimalWithAggregatesFilter<"Product"> | Decimal | DecimalJsLike | number | string
    quantity?: IntWithAggregatesFilter<"Product"> | number
    reorderLevel?: IntWithAggregatesFilter<"Product"> | number
    purchasePrice?: DecimalWithAggregatesFilter<"Product"> | Decimal | DecimalJsLike | number | string
    sellingPrice?: DecimalWithAggregatesFilter<"Product"> | Decimal | DecimalJsLike | number | string
    makingChargePerGram?: DecimalWithAggregatesFilter<"Product"> | Decimal | DecimalJsLike | number | string
    makingChargeType?: EnumMakingChargeTypeWithAggregatesFilter<"Product"> | $Enums.MakingChargeType
    makingChargeValue?: DecimalWithAggregatesFilter<"Product"> | Decimal | DecimalJsLike | number | string
    location?: StringNullableWithAggregatesFilter<"Product"> | string | null
    notes?: StringNullableWithAggregatesFilter<"Product"> | string | null
    status?: EnumProductStatusWithAggregatesFilter<"Product"> | $Enums.ProductStatus
    createdAt?: DateTimeWithAggregatesFilter<"Product"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Product"> | Date | string
  }

  export type StockMovementWhereInput = {
    AND?: StockMovementWhereInput | StockMovementWhereInput[]
    OR?: StockMovementWhereInput[]
    NOT?: StockMovementWhereInput | StockMovementWhereInput[]
    id?: IntFilter<"StockMovement"> | number
    productId?: IntFilter<"StockMovement"> | number
    type?: EnumMovementTypeFilter<"StockMovement"> | $Enums.MovementType
    quantity?: IntFilter<"StockMovement"> | number
    note?: StringNullableFilter<"StockMovement"> | string | null
    createdAt?: DateTimeFilter<"StockMovement"> | Date | string
    product?: XOR<ProductScalarRelationFilter, ProductWhereInput>
  }

  export type StockMovementOrderByWithRelationInput = {
    id?: SortOrder
    productId?: SortOrder
    type?: SortOrder
    quantity?: SortOrder
    note?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    product?: ProductOrderByWithRelationInput
    _relevance?: StockMovementOrderByRelevanceInput
  }

  export type StockMovementWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: StockMovementWhereInput | StockMovementWhereInput[]
    OR?: StockMovementWhereInput[]
    NOT?: StockMovementWhereInput | StockMovementWhereInput[]
    productId?: IntFilter<"StockMovement"> | number
    type?: EnumMovementTypeFilter<"StockMovement"> | $Enums.MovementType
    quantity?: IntFilter<"StockMovement"> | number
    note?: StringNullableFilter<"StockMovement"> | string | null
    createdAt?: DateTimeFilter<"StockMovement"> | Date | string
    product?: XOR<ProductScalarRelationFilter, ProductWhereInput>
  }, "id">

  export type StockMovementOrderByWithAggregationInput = {
    id?: SortOrder
    productId?: SortOrder
    type?: SortOrder
    quantity?: SortOrder
    note?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: StockMovementCountOrderByAggregateInput
    _avg?: StockMovementAvgOrderByAggregateInput
    _max?: StockMovementMaxOrderByAggregateInput
    _min?: StockMovementMinOrderByAggregateInput
    _sum?: StockMovementSumOrderByAggregateInput
  }

  export type StockMovementScalarWhereWithAggregatesInput = {
    AND?: StockMovementScalarWhereWithAggregatesInput | StockMovementScalarWhereWithAggregatesInput[]
    OR?: StockMovementScalarWhereWithAggregatesInput[]
    NOT?: StockMovementScalarWhereWithAggregatesInput | StockMovementScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"StockMovement"> | number
    productId?: IntWithAggregatesFilter<"StockMovement"> | number
    type?: EnumMovementTypeWithAggregatesFilter<"StockMovement"> | $Enums.MovementType
    quantity?: IntWithAggregatesFilter<"StockMovement"> | number
    note?: StringNullableWithAggregatesFilter<"StockMovement"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"StockMovement"> | Date | string
  }

  export type PurchaseWhereInput = {
    AND?: PurchaseWhereInput | PurchaseWhereInput[]
    OR?: PurchaseWhereInput[]
    NOT?: PurchaseWhereInput | PurchaseWhereInput[]
    id?: IntFilter<"Purchase"> | number
    purchaseNumber?: StringFilter<"Purchase"> | string
    supplierId?: IntNullableFilter<"Purchase"> | number | null
    purchaseDate?: DateTimeFilter<"Purchase"> | Date | string
    subtotal?: DecimalFilter<"Purchase"> | Decimal | DecimalJsLike | number | string
    discount?: DecimalFilter<"Purchase"> | Decimal | DecimalJsLike | number | string
    total?: DecimalFilter<"Purchase"> | Decimal | DecimalJsLike | number | string
    paid?: DecimalFilter<"Purchase"> | Decimal | DecimalJsLike | number | string
    paymentMethod?: EnumPaymentMethodFilter<"Purchase"> | $Enums.PaymentMethod
    notes?: StringNullableFilter<"Purchase"> | string | null
    createdAt?: DateTimeFilter<"Purchase"> | Date | string
    updatedAt?: DateTimeFilter<"Purchase"> | Date | string
    supplier?: XOR<SupplierNullableScalarRelationFilter, SupplierWhereInput> | null
    items?: PurchaseItemListRelationFilter
  }

  export type PurchaseOrderByWithRelationInput = {
    id?: SortOrder
    purchaseNumber?: SortOrder
    supplierId?: SortOrderInput | SortOrder
    purchaseDate?: SortOrder
    subtotal?: SortOrder
    discount?: SortOrder
    total?: SortOrder
    paid?: SortOrder
    paymentMethod?: SortOrder
    notes?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    supplier?: SupplierOrderByWithRelationInput
    items?: PurchaseItemOrderByRelationAggregateInput
    _relevance?: PurchaseOrderByRelevanceInput
  }

  export type PurchaseWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    purchaseNumber?: string
    AND?: PurchaseWhereInput | PurchaseWhereInput[]
    OR?: PurchaseWhereInput[]
    NOT?: PurchaseWhereInput | PurchaseWhereInput[]
    supplierId?: IntNullableFilter<"Purchase"> | number | null
    purchaseDate?: DateTimeFilter<"Purchase"> | Date | string
    subtotal?: DecimalFilter<"Purchase"> | Decimal | DecimalJsLike | number | string
    discount?: DecimalFilter<"Purchase"> | Decimal | DecimalJsLike | number | string
    total?: DecimalFilter<"Purchase"> | Decimal | DecimalJsLike | number | string
    paid?: DecimalFilter<"Purchase"> | Decimal | DecimalJsLike | number | string
    paymentMethod?: EnumPaymentMethodFilter<"Purchase"> | $Enums.PaymentMethod
    notes?: StringNullableFilter<"Purchase"> | string | null
    createdAt?: DateTimeFilter<"Purchase"> | Date | string
    updatedAt?: DateTimeFilter<"Purchase"> | Date | string
    supplier?: XOR<SupplierNullableScalarRelationFilter, SupplierWhereInput> | null
    items?: PurchaseItemListRelationFilter
  }, "id" | "purchaseNumber">

  export type PurchaseOrderByWithAggregationInput = {
    id?: SortOrder
    purchaseNumber?: SortOrder
    supplierId?: SortOrderInput | SortOrder
    purchaseDate?: SortOrder
    subtotal?: SortOrder
    discount?: SortOrder
    total?: SortOrder
    paid?: SortOrder
    paymentMethod?: SortOrder
    notes?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: PurchaseCountOrderByAggregateInput
    _avg?: PurchaseAvgOrderByAggregateInput
    _max?: PurchaseMaxOrderByAggregateInput
    _min?: PurchaseMinOrderByAggregateInput
    _sum?: PurchaseSumOrderByAggregateInput
  }

  export type PurchaseScalarWhereWithAggregatesInput = {
    AND?: PurchaseScalarWhereWithAggregatesInput | PurchaseScalarWhereWithAggregatesInput[]
    OR?: PurchaseScalarWhereWithAggregatesInput[]
    NOT?: PurchaseScalarWhereWithAggregatesInput | PurchaseScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Purchase"> | number
    purchaseNumber?: StringWithAggregatesFilter<"Purchase"> | string
    supplierId?: IntNullableWithAggregatesFilter<"Purchase"> | number | null
    purchaseDate?: DateTimeWithAggregatesFilter<"Purchase"> | Date | string
    subtotal?: DecimalWithAggregatesFilter<"Purchase"> | Decimal | DecimalJsLike | number | string
    discount?: DecimalWithAggregatesFilter<"Purchase"> | Decimal | DecimalJsLike | number | string
    total?: DecimalWithAggregatesFilter<"Purchase"> | Decimal | DecimalJsLike | number | string
    paid?: DecimalWithAggregatesFilter<"Purchase"> | Decimal | DecimalJsLike | number | string
    paymentMethod?: EnumPaymentMethodWithAggregatesFilter<"Purchase"> | $Enums.PaymentMethod
    notes?: StringNullableWithAggregatesFilter<"Purchase"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Purchase"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Purchase"> | Date | string
  }

  export type PurchaseItemWhereInput = {
    AND?: PurchaseItemWhereInput | PurchaseItemWhereInput[]
    OR?: PurchaseItemWhereInput[]
    NOT?: PurchaseItemWhereInput | PurchaseItemWhereInput[]
    id?: IntFilter<"PurchaseItem"> | number
    purchaseId?: IntFilter<"PurchaseItem"> | number
    productId?: IntFilter<"PurchaseItem"> | number
    quantity?: IntFilter<"PurchaseItem"> | number
    unitCost?: DecimalFilter<"PurchaseItem"> | Decimal | DecimalJsLike | number | string
    lineTotal?: DecimalFilter<"PurchaseItem"> | Decimal | DecimalJsLike | number | string
    purchase?: XOR<PurchaseScalarRelationFilter, PurchaseWhereInput>
    product?: XOR<ProductScalarRelationFilter, ProductWhereInput>
  }

  export type PurchaseItemOrderByWithRelationInput = {
    id?: SortOrder
    purchaseId?: SortOrder
    productId?: SortOrder
    quantity?: SortOrder
    unitCost?: SortOrder
    lineTotal?: SortOrder
    purchase?: PurchaseOrderByWithRelationInput
    product?: ProductOrderByWithRelationInput
  }

  export type PurchaseItemWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: PurchaseItemWhereInput | PurchaseItemWhereInput[]
    OR?: PurchaseItemWhereInput[]
    NOT?: PurchaseItemWhereInput | PurchaseItemWhereInput[]
    purchaseId?: IntFilter<"PurchaseItem"> | number
    productId?: IntFilter<"PurchaseItem"> | number
    quantity?: IntFilter<"PurchaseItem"> | number
    unitCost?: DecimalFilter<"PurchaseItem"> | Decimal | DecimalJsLike | number | string
    lineTotal?: DecimalFilter<"PurchaseItem"> | Decimal | DecimalJsLike | number | string
    purchase?: XOR<PurchaseScalarRelationFilter, PurchaseWhereInput>
    product?: XOR<ProductScalarRelationFilter, ProductWhereInput>
  }, "id">

  export type PurchaseItemOrderByWithAggregationInput = {
    id?: SortOrder
    purchaseId?: SortOrder
    productId?: SortOrder
    quantity?: SortOrder
    unitCost?: SortOrder
    lineTotal?: SortOrder
    _count?: PurchaseItemCountOrderByAggregateInput
    _avg?: PurchaseItemAvgOrderByAggregateInput
    _max?: PurchaseItemMaxOrderByAggregateInput
    _min?: PurchaseItemMinOrderByAggregateInput
    _sum?: PurchaseItemSumOrderByAggregateInput
  }

  export type PurchaseItemScalarWhereWithAggregatesInput = {
    AND?: PurchaseItemScalarWhereWithAggregatesInput | PurchaseItemScalarWhereWithAggregatesInput[]
    OR?: PurchaseItemScalarWhereWithAggregatesInput[]
    NOT?: PurchaseItemScalarWhereWithAggregatesInput | PurchaseItemScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"PurchaseItem"> | number
    purchaseId?: IntWithAggregatesFilter<"PurchaseItem"> | number
    productId?: IntWithAggregatesFilter<"PurchaseItem"> | number
    quantity?: IntWithAggregatesFilter<"PurchaseItem"> | number
    unitCost?: DecimalWithAggregatesFilter<"PurchaseItem"> | Decimal | DecimalJsLike | number | string
    lineTotal?: DecimalWithAggregatesFilter<"PurchaseItem"> | Decimal | DecimalJsLike | number | string
  }

  export type SaleWhereInput = {
    AND?: SaleWhereInput | SaleWhereInput[]
    OR?: SaleWhereInput[]
    NOT?: SaleWhereInput | SaleWhereInput[]
    id?: IntFilter<"Sale"> | number
    invoiceNumber?: StringFilter<"Sale"> | string
    customerId?: IntNullableFilter<"Sale"> | number | null
    saleDate?: DateTimeFilter<"Sale"> | Date | string
    subtotal?: DecimalFilter<"Sale"> | Decimal | DecimalJsLike | number | string
    discount?: DecimalFilter<"Sale"> | Decimal | DecimalJsLike | number | string
    gstRate?: DecimalFilter<"Sale"> | Decimal | DecimalJsLike | number | string
    gstAmount?: DecimalFilter<"Sale"> | Decimal | DecimalJsLike | number | string
    total?: DecimalFilter<"Sale"> | Decimal | DecimalJsLike | number | string
    urdOffset?: DecimalFilter<"Sale"> | Decimal | DecimalJsLike | number | string
    paid?: DecimalFilter<"Sale"> | Decimal | DecimalJsLike | number | string
    cashPaid?: DecimalFilter<"Sale"> | Decimal | DecimalJsLike | number | string
    upiPaid?: DecimalFilter<"Sale"> | Decimal | DecimalJsLike | number | string
    balance?: DecimalFilter<"Sale"> | Decimal | DecimalJsLike | number | string
    paymentMethod?: EnumPaymentMethodFilter<"Sale"> | $Enums.PaymentMethod
    notes?: StringNullableFilter<"Sale"> | string | null
    createdAt?: DateTimeFilter<"Sale"> | Date | string
    updatedAt?: DateTimeFilter<"Sale"> | Date | string
    customer?: XOR<CustomerNullableScalarRelationFilter, CustomerWhereInput> | null
    items?: SaleItemListRelationFilter
    ledgerEntries?: CustomerLedgerListRelationFilter
    urdPurchase?: XOR<UrdPurchaseNullableScalarRelationFilter, UrdPurchaseWhereInput> | null
  }

  export type SaleOrderByWithRelationInput = {
    id?: SortOrder
    invoiceNumber?: SortOrder
    customerId?: SortOrderInput | SortOrder
    saleDate?: SortOrder
    subtotal?: SortOrder
    discount?: SortOrder
    gstRate?: SortOrder
    gstAmount?: SortOrder
    total?: SortOrder
    urdOffset?: SortOrder
    paid?: SortOrder
    cashPaid?: SortOrder
    upiPaid?: SortOrder
    balance?: SortOrder
    paymentMethod?: SortOrder
    notes?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    customer?: CustomerOrderByWithRelationInput
    items?: SaleItemOrderByRelationAggregateInput
    ledgerEntries?: CustomerLedgerOrderByRelationAggregateInput
    urdPurchase?: UrdPurchaseOrderByWithRelationInput
    _relevance?: SaleOrderByRelevanceInput
  }

  export type SaleWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    invoiceNumber?: string
    AND?: SaleWhereInput | SaleWhereInput[]
    OR?: SaleWhereInput[]
    NOT?: SaleWhereInput | SaleWhereInput[]
    customerId?: IntNullableFilter<"Sale"> | number | null
    saleDate?: DateTimeFilter<"Sale"> | Date | string
    subtotal?: DecimalFilter<"Sale"> | Decimal | DecimalJsLike | number | string
    discount?: DecimalFilter<"Sale"> | Decimal | DecimalJsLike | number | string
    gstRate?: DecimalFilter<"Sale"> | Decimal | DecimalJsLike | number | string
    gstAmount?: DecimalFilter<"Sale"> | Decimal | DecimalJsLike | number | string
    total?: DecimalFilter<"Sale"> | Decimal | DecimalJsLike | number | string
    urdOffset?: DecimalFilter<"Sale"> | Decimal | DecimalJsLike | number | string
    paid?: DecimalFilter<"Sale"> | Decimal | DecimalJsLike | number | string
    cashPaid?: DecimalFilter<"Sale"> | Decimal | DecimalJsLike | number | string
    upiPaid?: DecimalFilter<"Sale"> | Decimal | DecimalJsLike | number | string
    balance?: DecimalFilter<"Sale"> | Decimal | DecimalJsLike | number | string
    paymentMethod?: EnumPaymentMethodFilter<"Sale"> | $Enums.PaymentMethod
    notes?: StringNullableFilter<"Sale"> | string | null
    createdAt?: DateTimeFilter<"Sale"> | Date | string
    updatedAt?: DateTimeFilter<"Sale"> | Date | string
    customer?: XOR<CustomerNullableScalarRelationFilter, CustomerWhereInput> | null
    items?: SaleItemListRelationFilter
    ledgerEntries?: CustomerLedgerListRelationFilter
    urdPurchase?: XOR<UrdPurchaseNullableScalarRelationFilter, UrdPurchaseWhereInput> | null
  }, "id" | "invoiceNumber">

  export type SaleOrderByWithAggregationInput = {
    id?: SortOrder
    invoiceNumber?: SortOrder
    customerId?: SortOrderInput | SortOrder
    saleDate?: SortOrder
    subtotal?: SortOrder
    discount?: SortOrder
    gstRate?: SortOrder
    gstAmount?: SortOrder
    total?: SortOrder
    urdOffset?: SortOrder
    paid?: SortOrder
    cashPaid?: SortOrder
    upiPaid?: SortOrder
    balance?: SortOrder
    paymentMethod?: SortOrder
    notes?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: SaleCountOrderByAggregateInput
    _avg?: SaleAvgOrderByAggregateInput
    _max?: SaleMaxOrderByAggregateInput
    _min?: SaleMinOrderByAggregateInput
    _sum?: SaleSumOrderByAggregateInput
  }

  export type SaleScalarWhereWithAggregatesInput = {
    AND?: SaleScalarWhereWithAggregatesInput | SaleScalarWhereWithAggregatesInput[]
    OR?: SaleScalarWhereWithAggregatesInput[]
    NOT?: SaleScalarWhereWithAggregatesInput | SaleScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Sale"> | number
    invoiceNumber?: StringWithAggregatesFilter<"Sale"> | string
    customerId?: IntNullableWithAggregatesFilter<"Sale"> | number | null
    saleDate?: DateTimeWithAggregatesFilter<"Sale"> | Date | string
    subtotal?: DecimalWithAggregatesFilter<"Sale"> | Decimal | DecimalJsLike | number | string
    discount?: DecimalWithAggregatesFilter<"Sale"> | Decimal | DecimalJsLike | number | string
    gstRate?: DecimalWithAggregatesFilter<"Sale"> | Decimal | DecimalJsLike | number | string
    gstAmount?: DecimalWithAggregatesFilter<"Sale"> | Decimal | DecimalJsLike | number | string
    total?: DecimalWithAggregatesFilter<"Sale"> | Decimal | DecimalJsLike | number | string
    urdOffset?: DecimalWithAggregatesFilter<"Sale"> | Decimal | DecimalJsLike | number | string
    paid?: DecimalWithAggregatesFilter<"Sale"> | Decimal | DecimalJsLike | number | string
    cashPaid?: DecimalWithAggregatesFilter<"Sale"> | Decimal | DecimalJsLike | number | string
    upiPaid?: DecimalWithAggregatesFilter<"Sale"> | Decimal | DecimalJsLike | number | string
    balance?: DecimalWithAggregatesFilter<"Sale"> | Decimal | DecimalJsLike | number | string
    paymentMethod?: EnumPaymentMethodWithAggregatesFilter<"Sale"> | $Enums.PaymentMethod
    notes?: StringNullableWithAggregatesFilter<"Sale"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Sale"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Sale"> | Date | string
  }

  export type SaleItemWhereInput = {
    AND?: SaleItemWhereInput | SaleItemWhereInput[]
    OR?: SaleItemWhereInput[]
    NOT?: SaleItemWhereInput | SaleItemWhereInput[]
    id?: IntFilter<"SaleItem"> | number
    saleId?: IntFilter<"SaleItem"> | number
    productId?: IntFilter<"SaleItem"> | number
    quantity?: IntFilter<"SaleItem"> | number
    weight?: DecimalFilter<"SaleItem"> | Decimal | DecimalJsLike | number | string
    unitPrice?: DecimalFilter<"SaleItem"> | Decimal | DecimalJsLike | number | string
    metalRate?: DecimalFilter<"SaleItem"> | Decimal | DecimalJsLike | number | string
    metalAmount?: DecimalFilter<"SaleItem"> | Decimal | DecimalJsLike | number | string
    makingCharge?: DecimalFilter<"SaleItem"> | Decimal | DecimalJsLike | number | string
    makingChargeType?: EnumMakingChargeTypeFilter<"SaleItem"> | $Enums.MakingChargeType
    makingChargeValue?: DecimalFilter<"SaleItem"> | Decimal | DecimalJsLike | number | string
    taxableAmount?: DecimalFilter<"SaleItem"> | Decimal | DecimalJsLike | number | string
    lineTotal?: DecimalFilter<"SaleItem"> | Decimal | DecimalJsLike | number | string
    sale?: XOR<SaleScalarRelationFilter, SaleWhereInput>
    product?: XOR<ProductScalarRelationFilter, ProductWhereInput>
  }

  export type SaleItemOrderByWithRelationInput = {
    id?: SortOrder
    saleId?: SortOrder
    productId?: SortOrder
    quantity?: SortOrder
    weight?: SortOrder
    unitPrice?: SortOrder
    metalRate?: SortOrder
    metalAmount?: SortOrder
    makingCharge?: SortOrder
    makingChargeType?: SortOrder
    makingChargeValue?: SortOrder
    taxableAmount?: SortOrder
    lineTotal?: SortOrder
    sale?: SaleOrderByWithRelationInput
    product?: ProductOrderByWithRelationInput
  }

  export type SaleItemWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: SaleItemWhereInput | SaleItemWhereInput[]
    OR?: SaleItemWhereInput[]
    NOT?: SaleItemWhereInput | SaleItemWhereInput[]
    saleId?: IntFilter<"SaleItem"> | number
    productId?: IntFilter<"SaleItem"> | number
    quantity?: IntFilter<"SaleItem"> | number
    weight?: DecimalFilter<"SaleItem"> | Decimal | DecimalJsLike | number | string
    unitPrice?: DecimalFilter<"SaleItem"> | Decimal | DecimalJsLike | number | string
    metalRate?: DecimalFilter<"SaleItem"> | Decimal | DecimalJsLike | number | string
    metalAmount?: DecimalFilter<"SaleItem"> | Decimal | DecimalJsLike | number | string
    makingCharge?: DecimalFilter<"SaleItem"> | Decimal | DecimalJsLike | number | string
    makingChargeType?: EnumMakingChargeTypeFilter<"SaleItem"> | $Enums.MakingChargeType
    makingChargeValue?: DecimalFilter<"SaleItem"> | Decimal | DecimalJsLike | number | string
    taxableAmount?: DecimalFilter<"SaleItem"> | Decimal | DecimalJsLike | number | string
    lineTotal?: DecimalFilter<"SaleItem"> | Decimal | DecimalJsLike | number | string
    sale?: XOR<SaleScalarRelationFilter, SaleWhereInput>
    product?: XOR<ProductScalarRelationFilter, ProductWhereInput>
  }, "id">

  export type SaleItemOrderByWithAggregationInput = {
    id?: SortOrder
    saleId?: SortOrder
    productId?: SortOrder
    quantity?: SortOrder
    weight?: SortOrder
    unitPrice?: SortOrder
    metalRate?: SortOrder
    metalAmount?: SortOrder
    makingCharge?: SortOrder
    makingChargeType?: SortOrder
    makingChargeValue?: SortOrder
    taxableAmount?: SortOrder
    lineTotal?: SortOrder
    _count?: SaleItemCountOrderByAggregateInput
    _avg?: SaleItemAvgOrderByAggregateInput
    _max?: SaleItemMaxOrderByAggregateInput
    _min?: SaleItemMinOrderByAggregateInput
    _sum?: SaleItemSumOrderByAggregateInput
  }

  export type SaleItemScalarWhereWithAggregatesInput = {
    AND?: SaleItemScalarWhereWithAggregatesInput | SaleItemScalarWhereWithAggregatesInput[]
    OR?: SaleItemScalarWhereWithAggregatesInput[]
    NOT?: SaleItemScalarWhereWithAggregatesInput | SaleItemScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"SaleItem"> | number
    saleId?: IntWithAggregatesFilter<"SaleItem"> | number
    productId?: IntWithAggregatesFilter<"SaleItem"> | number
    quantity?: IntWithAggregatesFilter<"SaleItem"> | number
    weight?: DecimalWithAggregatesFilter<"SaleItem"> | Decimal | DecimalJsLike | number | string
    unitPrice?: DecimalWithAggregatesFilter<"SaleItem"> | Decimal | DecimalJsLike | number | string
    metalRate?: DecimalWithAggregatesFilter<"SaleItem"> | Decimal | DecimalJsLike | number | string
    metalAmount?: DecimalWithAggregatesFilter<"SaleItem"> | Decimal | DecimalJsLike | number | string
    makingCharge?: DecimalWithAggregatesFilter<"SaleItem"> | Decimal | DecimalJsLike | number | string
    makingChargeType?: EnumMakingChargeTypeWithAggregatesFilter<"SaleItem"> | $Enums.MakingChargeType
    makingChargeValue?: DecimalWithAggregatesFilter<"SaleItem"> | Decimal | DecimalJsLike | number | string
    taxableAmount?: DecimalWithAggregatesFilter<"SaleItem"> | Decimal | DecimalJsLike | number | string
    lineTotal?: DecimalWithAggregatesFilter<"SaleItem"> | Decimal | DecimalJsLike | number | string
  }

  export type DailyRateWhereInput = {
    AND?: DailyRateWhereInput | DailyRateWhereInput[]
    OR?: DailyRateWhereInput[]
    NOT?: DailyRateWhereInput | DailyRateWhereInput[]
    id?: IntFilter<"DailyRate"> | number
    rateDate?: StringFilter<"DailyRate"> | string
    gold22k?: DecimalFilter<"DailyRate"> | Decimal | DecimalJsLike | number | string
    gold24k?: DecimalFilter<"DailyRate"> | Decimal | DecimalJsLike | number | string
    silver?: DecimalFilter<"DailyRate"> | Decimal | DecimalJsLike | number | string
    note?: StringNullableFilter<"DailyRate"> | string | null
    createdAt?: DateTimeFilter<"DailyRate"> | Date | string
    updatedAt?: DateTimeFilter<"DailyRate"> | Date | string
  }

  export type DailyRateOrderByWithRelationInput = {
    id?: SortOrder
    rateDate?: SortOrder
    gold22k?: SortOrder
    gold24k?: SortOrder
    silver?: SortOrder
    note?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _relevance?: DailyRateOrderByRelevanceInput
  }

  export type DailyRateWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    rateDate?: string
    AND?: DailyRateWhereInput | DailyRateWhereInput[]
    OR?: DailyRateWhereInput[]
    NOT?: DailyRateWhereInput | DailyRateWhereInput[]
    gold22k?: DecimalFilter<"DailyRate"> | Decimal | DecimalJsLike | number | string
    gold24k?: DecimalFilter<"DailyRate"> | Decimal | DecimalJsLike | number | string
    silver?: DecimalFilter<"DailyRate"> | Decimal | DecimalJsLike | number | string
    note?: StringNullableFilter<"DailyRate"> | string | null
    createdAt?: DateTimeFilter<"DailyRate"> | Date | string
    updatedAt?: DateTimeFilter<"DailyRate"> | Date | string
  }, "id" | "rateDate">

  export type DailyRateOrderByWithAggregationInput = {
    id?: SortOrder
    rateDate?: SortOrder
    gold22k?: SortOrder
    gold24k?: SortOrder
    silver?: SortOrder
    note?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: DailyRateCountOrderByAggregateInput
    _avg?: DailyRateAvgOrderByAggregateInput
    _max?: DailyRateMaxOrderByAggregateInput
    _min?: DailyRateMinOrderByAggregateInput
    _sum?: DailyRateSumOrderByAggregateInput
  }

  export type DailyRateScalarWhereWithAggregatesInput = {
    AND?: DailyRateScalarWhereWithAggregatesInput | DailyRateScalarWhereWithAggregatesInput[]
    OR?: DailyRateScalarWhereWithAggregatesInput[]
    NOT?: DailyRateScalarWhereWithAggregatesInput | DailyRateScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"DailyRate"> | number
    rateDate?: StringWithAggregatesFilter<"DailyRate"> | string
    gold22k?: DecimalWithAggregatesFilter<"DailyRate"> | Decimal | DecimalJsLike | number | string
    gold24k?: DecimalWithAggregatesFilter<"DailyRate"> | Decimal | DecimalJsLike | number | string
    silver?: DecimalWithAggregatesFilter<"DailyRate"> | Decimal | DecimalJsLike | number | string
    note?: StringNullableWithAggregatesFilter<"DailyRate"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"DailyRate"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"DailyRate"> | Date | string
  }

  export type BarcodeSequenceWhereInput = {
    AND?: BarcodeSequenceWhereInput | BarcodeSequenceWhereInput[]
    OR?: BarcodeSequenceWhereInput[]
    NOT?: BarcodeSequenceWhereInput | BarcodeSequenceWhereInput[]
    prefix?: StringFilter<"BarcodeSequence"> | string
    lastNumber?: IntFilter<"BarcodeSequence"> | number
    updatedAt?: DateTimeFilter<"BarcodeSequence"> | Date | string
  }

  export type BarcodeSequenceOrderByWithRelationInput = {
    prefix?: SortOrder
    lastNumber?: SortOrder
    updatedAt?: SortOrder
    _relevance?: BarcodeSequenceOrderByRelevanceInput
  }

  export type BarcodeSequenceWhereUniqueInput = Prisma.AtLeast<{
    prefix?: string
    AND?: BarcodeSequenceWhereInput | BarcodeSequenceWhereInput[]
    OR?: BarcodeSequenceWhereInput[]
    NOT?: BarcodeSequenceWhereInput | BarcodeSequenceWhereInput[]
    lastNumber?: IntFilter<"BarcodeSequence"> | number
    updatedAt?: DateTimeFilter<"BarcodeSequence"> | Date | string
  }, "prefix">

  export type BarcodeSequenceOrderByWithAggregationInput = {
    prefix?: SortOrder
    lastNumber?: SortOrder
    updatedAt?: SortOrder
    _count?: BarcodeSequenceCountOrderByAggregateInput
    _avg?: BarcodeSequenceAvgOrderByAggregateInput
    _max?: BarcodeSequenceMaxOrderByAggregateInput
    _min?: BarcodeSequenceMinOrderByAggregateInput
    _sum?: BarcodeSequenceSumOrderByAggregateInput
  }

  export type BarcodeSequenceScalarWhereWithAggregatesInput = {
    AND?: BarcodeSequenceScalarWhereWithAggregatesInput | BarcodeSequenceScalarWhereWithAggregatesInput[]
    OR?: BarcodeSequenceScalarWhereWithAggregatesInput[]
    NOT?: BarcodeSequenceScalarWhereWithAggregatesInput | BarcodeSequenceScalarWhereWithAggregatesInput[]
    prefix?: StringWithAggregatesFilter<"BarcodeSequence"> | string
    lastNumber?: IntWithAggregatesFilter<"BarcodeSequence"> | number
    updatedAt?: DateTimeWithAggregatesFilter<"BarcodeSequence"> | Date | string
  }

  export type CustomerLedgerWhereInput = {
    AND?: CustomerLedgerWhereInput | CustomerLedgerWhereInput[]
    OR?: CustomerLedgerWhereInput[]
    NOT?: CustomerLedgerWhereInput | CustomerLedgerWhereInput[]
    id?: IntFilter<"CustomerLedger"> | number
    customerId?: IntFilter<"CustomerLedger"> | number
    saleId?: IntNullableFilter<"CustomerLedger"> | number | null
    type?: EnumLedgerEntryTypeFilter<"CustomerLedger"> | $Enums.LedgerEntryType
    amount?: DecimalFilter<"CustomerLedger"> | Decimal | DecimalJsLike | number | string
    paymentMethod?: EnumPaymentMethodNullableFilter<"CustomerLedger"> | $Enums.PaymentMethod | null
    reference?: StringNullableFilter<"CustomerLedger"> | string | null
    note?: StringNullableFilter<"CustomerLedger"> | string | null
    createdAt?: DateTimeFilter<"CustomerLedger"> | Date | string
    customer?: XOR<CustomerScalarRelationFilter, CustomerWhereInput>
    sale?: XOR<SaleNullableScalarRelationFilter, SaleWhereInput> | null
  }

  export type CustomerLedgerOrderByWithRelationInput = {
    id?: SortOrder
    customerId?: SortOrder
    saleId?: SortOrderInput | SortOrder
    type?: SortOrder
    amount?: SortOrder
    paymentMethod?: SortOrderInput | SortOrder
    reference?: SortOrderInput | SortOrder
    note?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    customer?: CustomerOrderByWithRelationInput
    sale?: SaleOrderByWithRelationInput
    _relevance?: CustomerLedgerOrderByRelevanceInput
  }

  export type CustomerLedgerWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: CustomerLedgerWhereInput | CustomerLedgerWhereInput[]
    OR?: CustomerLedgerWhereInput[]
    NOT?: CustomerLedgerWhereInput | CustomerLedgerWhereInput[]
    customerId?: IntFilter<"CustomerLedger"> | number
    saleId?: IntNullableFilter<"CustomerLedger"> | number | null
    type?: EnumLedgerEntryTypeFilter<"CustomerLedger"> | $Enums.LedgerEntryType
    amount?: DecimalFilter<"CustomerLedger"> | Decimal | DecimalJsLike | number | string
    paymentMethod?: EnumPaymentMethodNullableFilter<"CustomerLedger"> | $Enums.PaymentMethod | null
    reference?: StringNullableFilter<"CustomerLedger"> | string | null
    note?: StringNullableFilter<"CustomerLedger"> | string | null
    createdAt?: DateTimeFilter<"CustomerLedger"> | Date | string
    customer?: XOR<CustomerScalarRelationFilter, CustomerWhereInput>
    sale?: XOR<SaleNullableScalarRelationFilter, SaleWhereInput> | null
  }, "id">

  export type CustomerLedgerOrderByWithAggregationInput = {
    id?: SortOrder
    customerId?: SortOrder
    saleId?: SortOrderInput | SortOrder
    type?: SortOrder
    amount?: SortOrder
    paymentMethod?: SortOrderInput | SortOrder
    reference?: SortOrderInput | SortOrder
    note?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: CustomerLedgerCountOrderByAggregateInput
    _avg?: CustomerLedgerAvgOrderByAggregateInput
    _max?: CustomerLedgerMaxOrderByAggregateInput
    _min?: CustomerLedgerMinOrderByAggregateInput
    _sum?: CustomerLedgerSumOrderByAggregateInput
  }

  export type CustomerLedgerScalarWhereWithAggregatesInput = {
    AND?: CustomerLedgerScalarWhereWithAggregatesInput | CustomerLedgerScalarWhereWithAggregatesInput[]
    OR?: CustomerLedgerScalarWhereWithAggregatesInput[]
    NOT?: CustomerLedgerScalarWhereWithAggregatesInput | CustomerLedgerScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"CustomerLedger"> | number
    customerId?: IntWithAggregatesFilter<"CustomerLedger"> | number
    saleId?: IntNullableWithAggregatesFilter<"CustomerLedger"> | number | null
    type?: EnumLedgerEntryTypeWithAggregatesFilter<"CustomerLedger"> | $Enums.LedgerEntryType
    amount?: DecimalWithAggregatesFilter<"CustomerLedger"> | Decimal | DecimalJsLike | number | string
    paymentMethod?: EnumPaymentMethodNullableWithAggregatesFilter<"CustomerLedger"> | $Enums.PaymentMethod | null
    reference?: StringNullableWithAggregatesFilter<"CustomerLedger"> | string | null
    note?: StringNullableWithAggregatesFilter<"CustomerLedger"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"CustomerLedger"> | Date | string
  }

  export type RepairWhereInput = {
    AND?: RepairWhereInput | RepairWhereInput[]
    OR?: RepairWhereInput[]
    NOT?: RepairWhereInput | RepairWhereInput[]
    id?: IntFilter<"Repair"> | number
    repairNumber?: StringFilter<"Repair"> | string
    customerId?: IntFilter<"Repair"> | number
    itemDescription?: StringFilter<"Repair"> | string
    metal?: EnumMetalTypeNullableFilter<"Repair"> | $Enums.MetalType | null
    grossWeight?: DecimalNullableFilter<"Repair"> | Decimal | DecimalJsLike | number | string | null
    issueDescription?: StringNullableFilter<"Repair"> | string | null
    estimatedCharge?: DecimalFilter<"Repair"> | Decimal | DecimalJsLike | number | string
    finalCharge?: DecimalNullableFilter<"Repair"> | Decimal | DecimalJsLike | number | string | null
    advancePaid?: DecimalFilter<"Repair"> | Decimal | DecimalJsLike | number | string
    advancePaymentMethod?: EnumPaymentMethodFilter<"Repair"> | $Enums.PaymentMethod
    dueDate?: DateTimeNullableFilter<"Repair"> | Date | string | null
    status?: EnumRepairStatusFilter<"Repair"> | $Enums.RepairStatus
    receivedAt?: DateTimeFilter<"Repair"> | Date | string
    deliveredAt?: DateTimeNullableFilter<"Repair"> | Date | string | null
    notes?: StringNullableFilter<"Repair"> | string | null
    createdAt?: DateTimeFilter<"Repair"> | Date | string
    updatedAt?: DateTimeFilter<"Repair"> | Date | string
    customer?: XOR<CustomerScalarRelationFilter, CustomerWhereInput>
  }

  export type RepairOrderByWithRelationInput = {
    id?: SortOrder
    repairNumber?: SortOrder
    customerId?: SortOrder
    itemDescription?: SortOrder
    metal?: SortOrderInput | SortOrder
    grossWeight?: SortOrderInput | SortOrder
    issueDescription?: SortOrderInput | SortOrder
    estimatedCharge?: SortOrder
    finalCharge?: SortOrderInput | SortOrder
    advancePaid?: SortOrder
    advancePaymentMethod?: SortOrder
    dueDate?: SortOrderInput | SortOrder
    status?: SortOrder
    receivedAt?: SortOrder
    deliveredAt?: SortOrderInput | SortOrder
    notes?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    customer?: CustomerOrderByWithRelationInput
    _relevance?: RepairOrderByRelevanceInput
  }

  export type RepairWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    repairNumber?: string
    AND?: RepairWhereInput | RepairWhereInput[]
    OR?: RepairWhereInput[]
    NOT?: RepairWhereInput | RepairWhereInput[]
    customerId?: IntFilter<"Repair"> | number
    itemDescription?: StringFilter<"Repair"> | string
    metal?: EnumMetalTypeNullableFilter<"Repair"> | $Enums.MetalType | null
    grossWeight?: DecimalNullableFilter<"Repair"> | Decimal | DecimalJsLike | number | string | null
    issueDescription?: StringNullableFilter<"Repair"> | string | null
    estimatedCharge?: DecimalFilter<"Repair"> | Decimal | DecimalJsLike | number | string
    finalCharge?: DecimalNullableFilter<"Repair"> | Decimal | DecimalJsLike | number | string | null
    advancePaid?: DecimalFilter<"Repair"> | Decimal | DecimalJsLike | number | string
    advancePaymentMethod?: EnumPaymentMethodFilter<"Repair"> | $Enums.PaymentMethod
    dueDate?: DateTimeNullableFilter<"Repair"> | Date | string | null
    status?: EnumRepairStatusFilter<"Repair"> | $Enums.RepairStatus
    receivedAt?: DateTimeFilter<"Repair"> | Date | string
    deliveredAt?: DateTimeNullableFilter<"Repair"> | Date | string | null
    notes?: StringNullableFilter<"Repair"> | string | null
    createdAt?: DateTimeFilter<"Repair"> | Date | string
    updatedAt?: DateTimeFilter<"Repair"> | Date | string
    customer?: XOR<CustomerScalarRelationFilter, CustomerWhereInput>
  }, "id" | "repairNumber">

  export type RepairOrderByWithAggregationInput = {
    id?: SortOrder
    repairNumber?: SortOrder
    customerId?: SortOrder
    itemDescription?: SortOrder
    metal?: SortOrderInput | SortOrder
    grossWeight?: SortOrderInput | SortOrder
    issueDescription?: SortOrderInput | SortOrder
    estimatedCharge?: SortOrder
    finalCharge?: SortOrderInput | SortOrder
    advancePaid?: SortOrder
    advancePaymentMethod?: SortOrder
    dueDate?: SortOrderInput | SortOrder
    status?: SortOrder
    receivedAt?: SortOrder
    deliveredAt?: SortOrderInput | SortOrder
    notes?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: RepairCountOrderByAggregateInput
    _avg?: RepairAvgOrderByAggregateInput
    _max?: RepairMaxOrderByAggregateInput
    _min?: RepairMinOrderByAggregateInput
    _sum?: RepairSumOrderByAggregateInput
  }

  export type RepairScalarWhereWithAggregatesInput = {
    AND?: RepairScalarWhereWithAggregatesInput | RepairScalarWhereWithAggregatesInput[]
    OR?: RepairScalarWhereWithAggregatesInput[]
    NOT?: RepairScalarWhereWithAggregatesInput | RepairScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Repair"> | number
    repairNumber?: StringWithAggregatesFilter<"Repair"> | string
    customerId?: IntWithAggregatesFilter<"Repair"> | number
    itemDescription?: StringWithAggregatesFilter<"Repair"> | string
    metal?: EnumMetalTypeNullableWithAggregatesFilter<"Repair"> | $Enums.MetalType | null
    grossWeight?: DecimalNullableWithAggregatesFilter<"Repair"> | Decimal | DecimalJsLike | number | string | null
    issueDescription?: StringNullableWithAggregatesFilter<"Repair"> | string | null
    estimatedCharge?: DecimalWithAggregatesFilter<"Repair"> | Decimal | DecimalJsLike | number | string
    finalCharge?: DecimalNullableWithAggregatesFilter<"Repair"> | Decimal | DecimalJsLike | number | string | null
    advancePaid?: DecimalWithAggregatesFilter<"Repair"> | Decimal | DecimalJsLike | number | string
    advancePaymentMethod?: EnumPaymentMethodWithAggregatesFilter<"Repair"> | $Enums.PaymentMethod
    dueDate?: DateTimeNullableWithAggregatesFilter<"Repair"> | Date | string | null
    status?: EnumRepairStatusWithAggregatesFilter<"Repair"> | $Enums.RepairStatus
    receivedAt?: DateTimeWithAggregatesFilter<"Repair"> | Date | string
    deliveredAt?: DateTimeNullableWithAggregatesFilter<"Repair"> | Date | string | null
    notes?: StringNullableWithAggregatesFilter<"Repair"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Repair"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Repair"> | Date | string
  }

  export type CashbookEntryWhereInput = {
    AND?: CashbookEntryWhereInput | CashbookEntryWhereInput[]
    OR?: CashbookEntryWhereInput[]
    NOT?: CashbookEntryWhereInput | CashbookEntryWhereInput[]
    id?: IntFilter<"CashbookEntry"> | number
    entryDate?: StringFilter<"CashbookEntry"> | string
    type?: EnumCashbookTypeFilter<"CashbookEntry"> | $Enums.CashbookType
    paymentMethod?: EnumPaymentMethodFilter<"CashbookEntry"> | $Enums.PaymentMethod
    description?: StringFilter<"CashbookEntry"> | string
    amount?: DecimalFilter<"CashbookEntry"> | Decimal | DecimalJsLike | number | string
    reference?: StringNullableFilter<"CashbookEntry"> | string | null
    notes?: StringNullableFilter<"CashbookEntry"> | string | null
    customerId?: IntNullableFilter<"CashbookEntry"> | number | null
    syncLedger?: BoolFilter<"CashbookEntry"> | boolean
    createdAt?: DateTimeFilter<"CashbookEntry"> | Date | string
    customer?: XOR<CustomerNullableScalarRelationFilter, CustomerWhereInput> | null
  }

  export type CashbookEntryOrderByWithRelationInput = {
    id?: SortOrder
    entryDate?: SortOrder
    type?: SortOrder
    paymentMethod?: SortOrder
    description?: SortOrder
    amount?: SortOrder
    reference?: SortOrderInput | SortOrder
    notes?: SortOrderInput | SortOrder
    customerId?: SortOrderInput | SortOrder
    syncLedger?: SortOrder
    createdAt?: SortOrder
    customer?: CustomerOrderByWithRelationInput
    _relevance?: CashbookEntryOrderByRelevanceInput
  }

  export type CashbookEntryWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: CashbookEntryWhereInput | CashbookEntryWhereInput[]
    OR?: CashbookEntryWhereInput[]
    NOT?: CashbookEntryWhereInput | CashbookEntryWhereInput[]
    entryDate?: StringFilter<"CashbookEntry"> | string
    type?: EnumCashbookTypeFilter<"CashbookEntry"> | $Enums.CashbookType
    paymentMethod?: EnumPaymentMethodFilter<"CashbookEntry"> | $Enums.PaymentMethod
    description?: StringFilter<"CashbookEntry"> | string
    amount?: DecimalFilter<"CashbookEntry"> | Decimal | DecimalJsLike | number | string
    reference?: StringNullableFilter<"CashbookEntry"> | string | null
    notes?: StringNullableFilter<"CashbookEntry"> | string | null
    customerId?: IntNullableFilter<"CashbookEntry"> | number | null
    syncLedger?: BoolFilter<"CashbookEntry"> | boolean
    createdAt?: DateTimeFilter<"CashbookEntry"> | Date | string
    customer?: XOR<CustomerNullableScalarRelationFilter, CustomerWhereInput> | null
  }, "id">

  export type CashbookEntryOrderByWithAggregationInput = {
    id?: SortOrder
    entryDate?: SortOrder
    type?: SortOrder
    paymentMethod?: SortOrder
    description?: SortOrder
    amount?: SortOrder
    reference?: SortOrderInput | SortOrder
    notes?: SortOrderInput | SortOrder
    customerId?: SortOrderInput | SortOrder
    syncLedger?: SortOrder
    createdAt?: SortOrder
    _count?: CashbookEntryCountOrderByAggregateInput
    _avg?: CashbookEntryAvgOrderByAggregateInput
    _max?: CashbookEntryMaxOrderByAggregateInput
    _min?: CashbookEntryMinOrderByAggregateInput
    _sum?: CashbookEntrySumOrderByAggregateInput
  }

  export type CashbookEntryScalarWhereWithAggregatesInput = {
    AND?: CashbookEntryScalarWhereWithAggregatesInput | CashbookEntryScalarWhereWithAggregatesInput[]
    OR?: CashbookEntryScalarWhereWithAggregatesInput[]
    NOT?: CashbookEntryScalarWhereWithAggregatesInput | CashbookEntryScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"CashbookEntry"> | number
    entryDate?: StringWithAggregatesFilter<"CashbookEntry"> | string
    type?: EnumCashbookTypeWithAggregatesFilter<"CashbookEntry"> | $Enums.CashbookType
    paymentMethod?: EnumPaymentMethodWithAggregatesFilter<"CashbookEntry"> | $Enums.PaymentMethod
    description?: StringWithAggregatesFilter<"CashbookEntry"> | string
    amount?: DecimalWithAggregatesFilter<"CashbookEntry"> | Decimal | DecimalJsLike | number | string
    reference?: StringNullableWithAggregatesFilter<"CashbookEntry"> | string | null
    notes?: StringNullableWithAggregatesFilter<"CashbookEntry"> | string | null
    customerId?: IntNullableWithAggregatesFilter<"CashbookEntry"> | number | null
    syncLedger?: BoolWithAggregatesFilter<"CashbookEntry"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"CashbookEntry"> | Date | string
  }

  export type UrdPurchaseWhereInput = {
    AND?: UrdPurchaseWhereInput | UrdPurchaseWhereInput[]
    OR?: UrdPurchaseWhereInput[]
    NOT?: UrdPurchaseWhereInput | UrdPurchaseWhereInput[]
    id?: IntFilter<"UrdPurchase"> | number
    purchaseNumber?: StringFilter<"UrdPurchase"> | string
    customerId?: IntFilter<"UrdPurchase"> | number
    purchaseDate?: DateTimeFilter<"UrdPurchase"> | Date | string
    metal?: EnumMetalTypeFilter<"UrdPurchase"> | $Enums.MetalType
    purity?: StringNullableFilter<"UrdPurchase"> | string | null
    grossWeight?: DecimalFilter<"UrdPurchase"> | Decimal | DecimalJsLike | number | string
    netWeight?: DecimalFilter<"UrdPurchase"> | Decimal | DecimalJsLike | number | string
    ratePerGram?: DecimalFilter<"UrdPurchase"> | Decimal | DecimalJsLike | number | string
    totalAmount?: DecimalFilter<"UrdPurchase"> | Decimal | DecimalJsLike | number | string
    saleOffset?: DecimalFilter<"UrdPurchase"> | Decimal | DecimalJsLike | number | string
    paid?: DecimalFilter<"UrdPurchase"> | Decimal | DecimalJsLike | number | string
    paymentMethod?: EnumPaymentMethodFilter<"UrdPurchase"> | $Enums.PaymentMethod
    description?: StringNullableFilter<"UrdPurchase"> | string | null
    notes?: StringNullableFilter<"UrdPurchase"> | string | null
    saleId?: IntNullableFilter<"UrdPurchase"> | number | null
    createdAt?: DateTimeFilter<"UrdPurchase"> | Date | string
    updatedAt?: DateTimeFilter<"UrdPurchase"> | Date | string
    customer?: XOR<CustomerScalarRelationFilter, CustomerWhereInput>
    sale?: XOR<SaleNullableScalarRelationFilter, SaleWhereInput> | null
  }

  export type UrdPurchaseOrderByWithRelationInput = {
    id?: SortOrder
    purchaseNumber?: SortOrder
    customerId?: SortOrder
    purchaseDate?: SortOrder
    metal?: SortOrder
    purity?: SortOrderInput | SortOrder
    grossWeight?: SortOrder
    netWeight?: SortOrder
    ratePerGram?: SortOrder
    totalAmount?: SortOrder
    saleOffset?: SortOrder
    paid?: SortOrder
    paymentMethod?: SortOrder
    description?: SortOrderInput | SortOrder
    notes?: SortOrderInput | SortOrder
    saleId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    customer?: CustomerOrderByWithRelationInput
    sale?: SaleOrderByWithRelationInput
    _relevance?: UrdPurchaseOrderByRelevanceInput
  }

  export type UrdPurchaseWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    purchaseNumber?: string
    saleId?: number
    AND?: UrdPurchaseWhereInput | UrdPurchaseWhereInput[]
    OR?: UrdPurchaseWhereInput[]
    NOT?: UrdPurchaseWhereInput | UrdPurchaseWhereInput[]
    customerId?: IntFilter<"UrdPurchase"> | number
    purchaseDate?: DateTimeFilter<"UrdPurchase"> | Date | string
    metal?: EnumMetalTypeFilter<"UrdPurchase"> | $Enums.MetalType
    purity?: StringNullableFilter<"UrdPurchase"> | string | null
    grossWeight?: DecimalFilter<"UrdPurchase"> | Decimal | DecimalJsLike | number | string
    netWeight?: DecimalFilter<"UrdPurchase"> | Decimal | DecimalJsLike | number | string
    ratePerGram?: DecimalFilter<"UrdPurchase"> | Decimal | DecimalJsLike | number | string
    totalAmount?: DecimalFilter<"UrdPurchase"> | Decimal | DecimalJsLike | number | string
    saleOffset?: DecimalFilter<"UrdPurchase"> | Decimal | DecimalJsLike | number | string
    paid?: DecimalFilter<"UrdPurchase"> | Decimal | DecimalJsLike | number | string
    paymentMethod?: EnumPaymentMethodFilter<"UrdPurchase"> | $Enums.PaymentMethod
    description?: StringNullableFilter<"UrdPurchase"> | string | null
    notes?: StringNullableFilter<"UrdPurchase"> | string | null
    createdAt?: DateTimeFilter<"UrdPurchase"> | Date | string
    updatedAt?: DateTimeFilter<"UrdPurchase"> | Date | string
    customer?: XOR<CustomerScalarRelationFilter, CustomerWhereInput>
    sale?: XOR<SaleNullableScalarRelationFilter, SaleWhereInput> | null
  }, "id" | "purchaseNumber" | "saleId">

  export type UrdPurchaseOrderByWithAggregationInput = {
    id?: SortOrder
    purchaseNumber?: SortOrder
    customerId?: SortOrder
    purchaseDate?: SortOrder
    metal?: SortOrder
    purity?: SortOrderInput | SortOrder
    grossWeight?: SortOrder
    netWeight?: SortOrder
    ratePerGram?: SortOrder
    totalAmount?: SortOrder
    saleOffset?: SortOrder
    paid?: SortOrder
    paymentMethod?: SortOrder
    description?: SortOrderInput | SortOrder
    notes?: SortOrderInput | SortOrder
    saleId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: UrdPurchaseCountOrderByAggregateInput
    _avg?: UrdPurchaseAvgOrderByAggregateInput
    _max?: UrdPurchaseMaxOrderByAggregateInput
    _min?: UrdPurchaseMinOrderByAggregateInput
    _sum?: UrdPurchaseSumOrderByAggregateInput
  }

  export type UrdPurchaseScalarWhereWithAggregatesInput = {
    AND?: UrdPurchaseScalarWhereWithAggregatesInput | UrdPurchaseScalarWhereWithAggregatesInput[]
    OR?: UrdPurchaseScalarWhereWithAggregatesInput[]
    NOT?: UrdPurchaseScalarWhereWithAggregatesInput | UrdPurchaseScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"UrdPurchase"> | number
    purchaseNumber?: StringWithAggregatesFilter<"UrdPurchase"> | string
    customerId?: IntWithAggregatesFilter<"UrdPurchase"> | number
    purchaseDate?: DateTimeWithAggregatesFilter<"UrdPurchase"> | Date | string
    metal?: EnumMetalTypeWithAggregatesFilter<"UrdPurchase"> | $Enums.MetalType
    purity?: StringNullableWithAggregatesFilter<"UrdPurchase"> | string | null
    grossWeight?: DecimalWithAggregatesFilter<"UrdPurchase"> | Decimal | DecimalJsLike | number | string
    netWeight?: DecimalWithAggregatesFilter<"UrdPurchase"> | Decimal | DecimalJsLike | number | string
    ratePerGram?: DecimalWithAggregatesFilter<"UrdPurchase"> | Decimal | DecimalJsLike | number | string
    totalAmount?: DecimalWithAggregatesFilter<"UrdPurchase"> | Decimal | DecimalJsLike | number | string
    saleOffset?: DecimalWithAggregatesFilter<"UrdPurchase"> | Decimal | DecimalJsLike | number | string
    paid?: DecimalWithAggregatesFilter<"UrdPurchase"> | Decimal | DecimalJsLike | number | string
    paymentMethod?: EnumPaymentMethodWithAggregatesFilter<"UrdPurchase"> | $Enums.PaymentMethod
    description?: StringNullableWithAggregatesFilter<"UrdPurchase"> | string | null
    notes?: StringNullableWithAggregatesFilter<"UrdPurchase"> | string | null
    saleId?: IntNullableWithAggregatesFilter<"UrdPurchase"> | number | null
    createdAt?: DateTimeWithAggregatesFilter<"UrdPurchase"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"UrdPurchase"> | Date | string
  }

  export type CustomerCreateInput = {
    name: string
    phone?: string | null
    email?: string | null
    address?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    sales?: SaleCreateNestedManyWithoutCustomerInput
    repairs?: RepairCreateNestedManyWithoutCustomerInput
    ledger?: CustomerLedgerCreateNestedManyWithoutCustomerInput
    urdPurchases?: UrdPurchaseCreateNestedManyWithoutCustomerInput
    cashbookEntries?: CashbookEntryCreateNestedManyWithoutCustomerInput
  }

  export type CustomerUncheckedCreateInput = {
    id?: number
    name: string
    phone?: string | null
    email?: string | null
    address?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    sales?: SaleUncheckedCreateNestedManyWithoutCustomerInput
    repairs?: RepairUncheckedCreateNestedManyWithoutCustomerInput
    ledger?: CustomerLedgerUncheckedCreateNestedManyWithoutCustomerInput
    urdPurchases?: UrdPurchaseUncheckedCreateNestedManyWithoutCustomerInput
    cashbookEntries?: CashbookEntryUncheckedCreateNestedManyWithoutCustomerInput
  }

  export type CustomerUpdateInput = {
    name?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sales?: SaleUpdateManyWithoutCustomerNestedInput
    repairs?: RepairUpdateManyWithoutCustomerNestedInput
    ledger?: CustomerLedgerUpdateManyWithoutCustomerNestedInput
    urdPurchases?: UrdPurchaseUpdateManyWithoutCustomerNestedInput
    cashbookEntries?: CashbookEntryUpdateManyWithoutCustomerNestedInput
  }

  export type CustomerUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sales?: SaleUncheckedUpdateManyWithoutCustomerNestedInput
    repairs?: RepairUncheckedUpdateManyWithoutCustomerNestedInput
    ledger?: CustomerLedgerUncheckedUpdateManyWithoutCustomerNestedInput
    urdPurchases?: UrdPurchaseUncheckedUpdateManyWithoutCustomerNestedInput
    cashbookEntries?: CashbookEntryUncheckedUpdateManyWithoutCustomerNestedInput
  }

  export type CustomerCreateManyInput = {
    id?: number
    name: string
    phone?: string | null
    email?: string | null
    address?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CustomerUpdateManyMutationInput = {
    name?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CustomerUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SupplierCreateInput = {
    name: string
    phone?: string | null
    email?: string | null
    address?: string | null
    gstin?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    purchases?: PurchaseCreateNestedManyWithoutSupplierInput
  }

  export type SupplierUncheckedCreateInput = {
    id?: number
    name: string
    phone?: string | null
    email?: string | null
    address?: string | null
    gstin?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    purchases?: PurchaseUncheckedCreateNestedManyWithoutSupplierInput
  }

  export type SupplierUpdateInput = {
    name?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    gstin?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    purchases?: PurchaseUpdateManyWithoutSupplierNestedInput
  }

  export type SupplierUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    gstin?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    purchases?: PurchaseUncheckedUpdateManyWithoutSupplierNestedInput
  }

  export type SupplierCreateManyInput = {
    id?: number
    name: string
    phone?: string | null
    email?: string | null
    address?: string | null
    gstin?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SupplierUpdateManyMutationInput = {
    name?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    gstin?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SupplierUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    gstin?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProductCreateInput = {
    barcode?: string | null
    sku: string
    name: string
    category: string
    metal?: $Enums.MetalType
    purity?: string | null
    grossWeight?: Decimal | DecimalJsLike | number | string
    stoneWeight?: Decimal | DecimalJsLike | number | string
    netWeight?: Decimal | DecimalJsLike | number | string
    quantity?: number
    reorderLevel?: number
    purchasePrice?: Decimal | DecimalJsLike | number | string
    sellingPrice?: Decimal | DecimalJsLike | number | string
    makingChargePerGram?: Decimal | DecimalJsLike | number | string
    makingChargeType?: $Enums.MakingChargeType
    makingChargeValue?: Decimal | DecimalJsLike | number | string
    location?: string | null
    notes?: string | null
    status?: $Enums.ProductStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    saleItems?: SaleItemCreateNestedManyWithoutProductInput
    purchaseItems?: PurchaseItemCreateNestedManyWithoutProductInput
    movements?: StockMovementCreateNestedManyWithoutProductInput
  }

  export type ProductUncheckedCreateInput = {
    id?: number
    barcode?: string | null
    sku: string
    name: string
    category: string
    metal?: $Enums.MetalType
    purity?: string | null
    grossWeight?: Decimal | DecimalJsLike | number | string
    stoneWeight?: Decimal | DecimalJsLike | number | string
    netWeight?: Decimal | DecimalJsLike | number | string
    quantity?: number
    reorderLevel?: number
    purchasePrice?: Decimal | DecimalJsLike | number | string
    sellingPrice?: Decimal | DecimalJsLike | number | string
    makingChargePerGram?: Decimal | DecimalJsLike | number | string
    makingChargeType?: $Enums.MakingChargeType
    makingChargeValue?: Decimal | DecimalJsLike | number | string
    location?: string | null
    notes?: string | null
    status?: $Enums.ProductStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    saleItems?: SaleItemUncheckedCreateNestedManyWithoutProductInput
    purchaseItems?: PurchaseItemUncheckedCreateNestedManyWithoutProductInput
    movements?: StockMovementUncheckedCreateNestedManyWithoutProductInput
  }

  export type ProductUpdateInput = {
    barcode?: NullableStringFieldUpdateOperationsInput | string | null
    sku?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    metal?: EnumMetalTypeFieldUpdateOperationsInput | $Enums.MetalType
    purity?: NullableStringFieldUpdateOperationsInput | string | null
    grossWeight?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    stoneWeight?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    netWeight?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    quantity?: IntFieldUpdateOperationsInput | number
    reorderLevel?: IntFieldUpdateOperationsInput | number
    purchasePrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    sellingPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    makingChargePerGram?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    makingChargeType?: EnumMakingChargeTypeFieldUpdateOperationsInput | $Enums.MakingChargeType
    makingChargeValue?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    location?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumProductStatusFieldUpdateOperationsInput | $Enums.ProductStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    saleItems?: SaleItemUpdateManyWithoutProductNestedInput
    purchaseItems?: PurchaseItemUpdateManyWithoutProductNestedInput
    movements?: StockMovementUpdateManyWithoutProductNestedInput
  }

  export type ProductUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    barcode?: NullableStringFieldUpdateOperationsInput | string | null
    sku?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    metal?: EnumMetalTypeFieldUpdateOperationsInput | $Enums.MetalType
    purity?: NullableStringFieldUpdateOperationsInput | string | null
    grossWeight?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    stoneWeight?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    netWeight?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    quantity?: IntFieldUpdateOperationsInput | number
    reorderLevel?: IntFieldUpdateOperationsInput | number
    purchasePrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    sellingPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    makingChargePerGram?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    makingChargeType?: EnumMakingChargeTypeFieldUpdateOperationsInput | $Enums.MakingChargeType
    makingChargeValue?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    location?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumProductStatusFieldUpdateOperationsInput | $Enums.ProductStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    saleItems?: SaleItemUncheckedUpdateManyWithoutProductNestedInput
    purchaseItems?: PurchaseItemUncheckedUpdateManyWithoutProductNestedInput
    movements?: StockMovementUncheckedUpdateManyWithoutProductNestedInput
  }

  export type ProductCreateManyInput = {
    id?: number
    barcode?: string | null
    sku: string
    name: string
    category: string
    metal?: $Enums.MetalType
    purity?: string | null
    grossWeight?: Decimal | DecimalJsLike | number | string
    stoneWeight?: Decimal | DecimalJsLike | number | string
    netWeight?: Decimal | DecimalJsLike | number | string
    quantity?: number
    reorderLevel?: number
    purchasePrice?: Decimal | DecimalJsLike | number | string
    sellingPrice?: Decimal | DecimalJsLike | number | string
    makingChargePerGram?: Decimal | DecimalJsLike | number | string
    makingChargeType?: $Enums.MakingChargeType
    makingChargeValue?: Decimal | DecimalJsLike | number | string
    location?: string | null
    notes?: string | null
    status?: $Enums.ProductStatus
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ProductUpdateManyMutationInput = {
    barcode?: NullableStringFieldUpdateOperationsInput | string | null
    sku?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    metal?: EnumMetalTypeFieldUpdateOperationsInput | $Enums.MetalType
    purity?: NullableStringFieldUpdateOperationsInput | string | null
    grossWeight?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    stoneWeight?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    netWeight?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    quantity?: IntFieldUpdateOperationsInput | number
    reorderLevel?: IntFieldUpdateOperationsInput | number
    purchasePrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    sellingPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    makingChargePerGram?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    makingChargeType?: EnumMakingChargeTypeFieldUpdateOperationsInput | $Enums.MakingChargeType
    makingChargeValue?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    location?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumProductStatusFieldUpdateOperationsInput | $Enums.ProductStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProductUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    barcode?: NullableStringFieldUpdateOperationsInput | string | null
    sku?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    metal?: EnumMetalTypeFieldUpdateOperationsInput | $Enums.MetalType
    purity?: NullableStringFieldUpdateOperationsInput | string | null
    grossWeight?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    stoneWeight?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    netWeight?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    quantity?: IntFieldUpdateOperationsInput | number
    reorderLevel?: IntFieldUpdateOperationsInput | number
    purchasePrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    sellingPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    makingChargePerGram?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    makingChargeType?: EnumMakingChargeTypeFieldUpdateOperationsInput | $Enums.MakingChargeType
    makingChargeValue?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    location?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumProductStatusFieldUpdateOperationsInput | $Enums.ProductStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StockMovementCreateInput = {
    type: $Enums.MovementType
    quantity: number
    note?: string | null
    createdAt?: Date | string
    product: ProductCreateNestedOneWithoutMovementsInput
  }

  export type StockMovementUncheckedCreateInput = {
    id?: number
    productId: number
    type: $Enums.MovementType
    quantity: number
    note?: string | null
    createdAt?: Date | string
  }

  export type StockMovementUpdateInput = {
    type?: EnumMovementTypeFieldUpdateOperationsInput | $Enums.MovementType
    quantity?: IntFieldUpdateOperationsInput | number
    note?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    product?: ProductUpdateOneRequiredWithoutMovementsNestedInput
  }

  export type StockMovementUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    productId?: IntFieldUpdateOperationsInput | number
    type?: EnumMovementTypeFieldUpdateOperationsInput | $Enums.MovementType
    quantity?: IntFieldUpdateOperationsInput | number
    note?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StockMovementCreateManyInput = {
    id?: number
    productId: number
    type: $Enums.MovementType
    quantity: number
    note?: string | null
    createdAt?: Date | string
  }

  export type StockMovementUpdateManyMutationInput = {
    type?: EnumMovementTypeFieldUpdateOperationsInput | $Enums.MovementType
    quantity?: IntFieldUpdateOperationsInput | number
    note?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StockMovementUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    productId?: IntFieldUpdateOperationsInput | number
    type?: EnumMovementTypeFieldUpdateOperationsInput | $Enums.MovementType
    quantity?: IntFieldUpdateOperationsInput | number
    note?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PurchaseCreateInput = {
    purchaseNumber: string
    purchaseDate?: Date | string
    subtotal?: Decimal | DecimalJsLike | number | string
    discount?: Decimal | DecimalJsLike | number | string
    total?: Decimal | DecimalJsLike | number | string
    paid?: Decimal | DecimalJsLike | number | string
    paymentMethod?: $Enums.PaymentMethod
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    supplier?: SupplierCreateNestedOneWithoutPurchasesInput
    items?: PurchaseItemCreateNestedManyWithoutPurchaseInput
  }

  export type PurchaseUncheckedCreateInput = {
    id?: number
    purchaseNumber: string
    supplierId?: number | null
    purchaseDate?: Date | string
    subtotal?: Decimal | DecimalJsLike | number | string
    discount?: Decimal | DecimalJsLike | number | string
    total?: Decimal | DecimalJsLike | number | string
    paid?: Decimal | DecimalJsLike | number | string
    paymentMethod?: $Enums.PaymentMethod
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    items?: PurchaseItemUncheckedCreateNestedManyWithoutPurchaseInput
  }

  export type PurchaseUpdateInput = {
    purchaseNumber?: StringFieldUpdateOperationsInput | string
    purchaseDate?: DateTimeFieldUpdateOperationsInput | Date | string
    subtotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    discount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    total?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    paid?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    paymentMethod?: EnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    supplier?: SupplierUpdateOneWithoutPurchasesNestedInput
    items?: PurchaseItemUpdateManyWithoutPurchaseNestedInput
  }

  export type PurchaseUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    purchaseNumber?: StringFieldUpdateOperationsInput | string
    supplierId?: NullableIntFieldUpdateOperationsInput | number | null
    purchaseDate?: DateTimeFieldUpdateOperationsInput | Date | string
    subtotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    discount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    total?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    paid?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    paymentMethod?: EnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    items?: PurchaseItemUncheckedUpdateManyWithoutPurchaseNestedInput
  }

  export type PurchaseCreateManyInput = {
    id?: number
    purchaseNumber: string
    supplierId?: number | null
    purchaseDate?: Date | string
    subtotal?: Decimal | DecimalJsLike | number | string
    discount?: Decimal | DecimalJsLike | number | string
    total?: Decimal | DecimalJsLike | number | string
    paid?: Decimal | DecimalJsLike | number | string
    paymentMethod?: $Enums.PaymentMethod
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PurchaseUpdateManyMutationInput = {
    purchaseNumber?: StringFieldUpdateOperationsInput | string
    purchaseDate?: DateTimeFieldUpdateOperationsInput | Date | string
    subtotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    discount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    total?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    paid?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    paymentMethod?: EnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PurchaseUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    purchaseNumber?: StringFieldUpdateOperationsInput | string
    supplierId?: NullableIntFieldUpdateOperationsInput | number | null
    purchaseDate?: DateTimeFieldUpdateOperationsInput | Date | string
    subtotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    discount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    total?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    paid?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    paymentMethod?: EnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PurchaseItemCreateInput = {
    quantity: number
    unitCost: Decimal | DecimalJsLike | number | string
    lineTotal: Decimal | DecimalJsLike | number | string
    purchase: PurchaseCreateNestedOneWithoutItemsInput
    product: ProductCreateNestedOneWithoutPurchaseItemsInput
  }

  export type PurchaseItemUncheckedCreateInput = {
    id?: number
    purchaseId: number
    productId: number
    quantity: number
    unitCost: Decimal | DecimalJsLike | number | string
    lineTotal: Decimal | DecimalJsLike | number | string
  }

  export type PurchaseItemUpdateInput = {
    quantity?: IntFieldUpdateOperationsInput | number
    unitCost?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    lineTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    purchase?: PurchaseUpdateOneRequiredWithoutItemsNestedInput
    product?: ProductUpdateOneRequiredWithoutPurchaseItemsNestedInput
  }

  export type PurchaseItemUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    purchaseId?: IntFieldUpdateOperationsInput | number
    productId?: IntFieldUpdateOperationsInput | number
    quantity?: IntFieldUpdateOperationsInput | number
    unitCost?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    lineTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
  }

  export type PurchaseItemCreateManyInput = {
    id?: number
    purchaseId: number
    productId: number
    quantity: number
    unitCost: Decimal | DecimalJsLike | number | string
    lineTotal: Decimal | DecimalJsLike | number | string
  }

  export type PurchaseItemUpdateManyMutationInput = {
    quantity?: IntFieldUpdateOperationsInput | number
    unitCost?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    lineTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
  }

  export type PurchaseItemUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    purchaseId?: IntFieldUpdateOperationsInput | number
    productId?: IntFieldUpdateOperationsInput | number
    quantity?: IntFieldUpdateOperationsInput | number
    unitCost?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    lineTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
  }

  export type SaleCreateInput = {
    invoiceNumber: string
    saleDate?: Date | string
    subtotal?: Decimal | DecimalJsLike | number | string
    discount?: Decimal | DecimalJsLike | number | string
    gstRate?: Decimal | DecimalJsLike | number | string
    gstAmount?: Decimal | DecimalJsLike | number | string
    total?: Decimal | DecimalJsLike | number | string
    urdOffset?: Decimal | DecimalJsLike | number | string
    paid?: Decimal | DecimalJsLike | number | string
    cashPaid?: Decimal | DecimalJsLike | number | string
    upiPaid?: Decimal | DecimalJsLike | number | string
    balance?: Decimal | DecimalJsLike | number | string
    paymentMethod?: $Enums.PaymentMethod
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    customer?: CustomerCreateNestedOneWithoutSalesInput
    items?: SaleItemCreateNestedManyWithoutSaleInput
    ledgerEntries?: CustomerLedgerCreateNestedManyWithoutSaleInput
    urdPurchase?: UrdPurchaseCreateNestedOneWithoutSaleInput
  }

  export type SaleUncheckedCreateInput = {
    id?: number
    invoiceNumber: string
    customerId?: number | null
    saleDate?: Date | string
    subtotal?: Decimal | DecimalJsLike | number | string
    discount?: Decimal | DecimalJsLike | number | string
    gstRate?: Decimal | DecimalJsLike | number | string
    gstAmount?: Decimal | DecimalJsLike | number | string
    total?: Decimal | DecimalJsLike | number | string
    urdOffset?: Decimal | DecimalJsLike | number | string
    paid?: Decimal | DecimalJsLike | number | string
    cashPaid?: Decimal | DecimalJsLike | number | string
    upiPaid?: Decimal | DecimalJsLike | number | string
    balance?: Decimal | DecimalJsLike | number | string
    paymentMethod?: $Enums.PaymentMethod
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    items?: SaleItemUncheckedCreateNestedManyWithoutSaleInput
    ledgerEntries?: CustomerLedgerUncheckedCreateNestedManyWithoutSaleInput
    urdPurchase?: UrdPurchaseUncheckedCreateNestedOneWithoutSaleInput
  }

  export type SaleUpdateInput = {
    invoiceNumber?: StringFieldUpdateOperationsInput | string
    saleDate?: DateTimeFieldUpdateOperationsInput | Date | string
    subtotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    discount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    gstRate?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    gstAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    total?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    urdOffset?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    paid?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    cashPaid?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    upiPaid?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    balance?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    paymentMethod?: EnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    customer?: CustomerUpdateOneWithoutSalesNestedInput
    items?: SaleItemUpdateManyWithoutSaleNestedInput
    ledgerEntries?: CustomerLedgerUpdateManyWithoutSaleNestedInput
    urdPurchase?: UrdPurchaseUpdateOneWithoutSaleNestedInput
  }

  export type SaleUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    invoiceNumber?: StringFieldUpdateOperationsInput | string
    customerId?: NullableIntFieldUpdateOperationsInput | number | null
    saleDate?: DateTimeFieldUpdateOperationsInput | Date | string
    subtotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    discount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    gstRate?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    gstAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    total?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    urdOffset?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    paid?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    cashPaid?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    upiPaid?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    balance?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    paymentMethod?: EnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    items?: SaleItemUncheckedUpdateManyWithoutSaleNestedInput
    ledgerEntries?: CustomerLedgerUncheckedUpdateManyWithoutSaleNestedInput
    urdPurchase?: UrdPurchaseUncheckedUpdateOneWithoutSaleNestedInput
  }

  export type SaleCreateManyInput = {
    id?: number
    invoiceNumber: string
    customerId?: number | null
    saleDate?: Date | string
    subtotal?: Decimal | DecimalJsLike | number | string
    discount?: Decimal | DecimalJsLike | number | string
    gstRate?: Decimal | DecimalJsLike | number | string
    gstAmount?: Decimal | DecimalJsLike | number | string
    total?: Decimal | DecimalJsLike | number | string
    urdOffset?: Decimal | DecimalJsLike | number | string
    paid?: Decimal | DecimalJsLike | number | string
    cashPaid?: Decimal | DecimalJsLike | number | string
    upiPaid?: Decimal | DecimalJsLike | number | string
    balance?: Decimal | DecimalJsLike | number | string
    paymentMethod?: $Enums.PaymentMethod
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SaleUpdateManyMutationInput = {
    invoiceNumber?: StringFieldUpdateOperationsInput | string
    saleDate?: DateTimeFieldUpdateOperationsInput | Date | string
    subtotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    discount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    gstRate?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    gstAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    total?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    urdOffset?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    paid?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    cashPaid?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    upiPaid?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    balance?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    paymentMethod?: EnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SaleUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    invoiceNumber?: StringFieldUpdateOperationsInput | string
    customerId?: NullableIntFieldUpdateOperationsInput | number | null
    saleDate?: DateTimeFieldUpdateOperationsInput | Date | string
    subtotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    discount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    gstRate?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    gstAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    total?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    urdOffset?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    paid?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    cashPaid?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    upiPaid?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    balance?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    paymentMethod?: EnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SaleItemCreateInput = {
    quantity: number
    weight?: Decimal | DecimalJsLike | number | string
    unitPrice: Decimal | DecimalJsLike | number | string
    metalRate?: Decimal | DecimalJsLike | number | string
    metalAmount?: Decimal | DecimalJsLike | number | string
    makingCharge?: Decimal | DecimalJsLike | number | string
    makingChargeType?: $Enums.MakingChargeType
    makingChargeValue?: Decimal | DecimalJsLike | number | string
    taxableAmount?: Decimal | DecimalJsLike | number | string
    lineTotal: Decimal | DecimalJsLike | number | string
    sale: SaleCreateNestedOneWithoutItemsInput
    product: ProductCreateNestedOneWithoutSaleItemsInput
  }

  export type SaleItemUncheckedCreateInput = {
    id?: number
    saleId: number
    productId: number
    quantity: number
    weight?: Decimal | DecimalJsLike | number | string
    unitPrice: Decimal | DecimalJsLike | number | string
    metalRate?: Decimal | DecimalJsLike | number | string
    metalAmount?: Decimal | DecimalJsLike | number | string
    makingCharge?: Decimal | DecimalJsLike | number | string
    makingChargeType?: $Enums.MakingChargeType
    makingChargeValue?: Decimal | DecimalJsLike | number | string
    taxableAmount?: Decimal | DecimalJsLike | number | string
    lineTotal: Decimal | DecimalJsLike | number | string
  }

  export type SaleItemUpdateInput = {
    quantity?: IntFieldUpdateOperationsInput | number
    weight?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    unitPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    metalRate?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    metalAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    makingCharge?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    makingChargeType?: EnumMakingChargeTypeFieldUpdateOperationsInput | $Enums.MakingChargeType
    makingChargeValue?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    taxableAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    lineTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    sale?: SaleUpdateOneRequiredWithoutItemsNestedInput
    product?: ProductUpdateOneRequiredWithoutSaleItemsNestedInput
  }

  export type SaleItemUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    saleId?: IntFieldUpdateOperationsInput | number
    productId?: IntFieldUpdateOperationsInput | number
    quantity?: IntFieldUpdateOperationsInput | number
    weight?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    unitPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    metalRate?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    metalAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    makingCharge?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    makingChargeType?: EnumMakingChargeTypeFieldUpdateOperationsInput | $Enums.MakingChargeType
    makingChargeValue?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    taxableAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    lineTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
  }

  export type SaleItemCreateManyInput = {
    id?: number
    saleId: number
    productId: number
    quantity: number
    weight?: Decimal | DecimalJsLike | number | string
    unitPrice: Decimal | DecimalJsLike | number | string
    metalRate?: Decimal | DecimalJsLike | number | string
    metalAmount?: Decimal | DecimalJsLike | number | string
    makingCharge?: Decimal | DecimalJsLike | number | string
    makingChargeType?: $Enums.MakingChargeType
    makingChargeValue?: Decimal | DecimalJsLike | number | string
    taxableAmount?: Decimal | DecimalJsLike | number | string
    lineTotal: Decimal | DecimalJsLike | number | string
  }

  export type SaleItemUpdateManyMutationInput = {
    quantity?: IntFieldUpdateOperationsInput | number
    weight?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    unitPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    metalRate?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    metalAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    makingCharge?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    makingChargeType?: EnumMakingChargeTypeFieldUpdateOperationsInput | $Enums.MakingChargeType
    makingChargeValue?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    taxableAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    lineTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
  }

  export type SaleItemUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    saleId?: IntFieldUpdateOperationsInput | number
    productId?: IntFieldUpdateOperationsInput | number
    quantity?: IntFieldUpdateOperationsInput | number
    weight?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    unitPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    metalRate?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    metalAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    makingCharge?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    makingChargeType?: EnumMakingChargeTypeFieldUpdateOperationsInput | $Enums.MakingChargeType
    makingChargeValue?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    taxableAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    lineTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
  }

  export type DailyRateCreateInput = {
    rateDate: string
    gold22k?: Decimal | DecimalJsLike | number | string
    gold24k?: Decimal | DecimalJsLike | number | string
    silver?: Decimal | DecimalJsLike | number | string
    note?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DailyRateUncheckedCreateInput = {
    id?: number
    rateDate: string
    gold22k?: Decimal | DecimalJsLike | number | string
    gold24k?: Decimal | DecimalJsLike | number | string
    silver?: Decimal | DecimalJsLike | number | string
    note?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DailyRateUpdateInput = {
    rateDate?: StringFieldUpdateOperationsInput | string
    gold22k?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    gold24k?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    silver?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    note?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DailyRateUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    rateDate?: StringFieldUpdateOperationsInput | string
    gold22k?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    gold24k?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    silver?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    note?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DailyRateCreateManyInput = {
    id?: number
    rateDate: string
    gold22k?: Decimal | DecimalJsLike | number | string
    gold24k?: Decimal | DecimalJsLike | number | string
    silver?: Decimal | DecimalJsLike | number | string
    note?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DailyRateUpdateManyMutationInput = {
    rateDate?: StringFieldUpdateOperationsInput | string
    gold22k?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    gold24k?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    silver?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    note?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DailyRateUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    rateDate?: StringFieldUpdateOperationsInput | string
    gold22k?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    gold24k?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    silver?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    note?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BarcodeSequenceCreateInput = {
    prefix: string
    lastNumber?: number
    updatedAt?: Date | string
  }

  export type BarcodeSequenceUncheckedCreateInput = {
    prefix: string
    lastNumber?: number
    updatedAt?: Date | string
  }

  export type BarcodeSequenceUpdateInput = {
    prefix?: StringFieldUpdateOperationsInput | string
    lastNumber?: IntFieldUpdateOperationsInput | number
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BarcodeSequenceUncheckedUpdateInput = {
    prefix?: StringFieldUpdateOperationsInput | string
    lastNumber?: IntFieldUpdateOperationsInput | number
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BarcodeSequenceCreateManyInput = {
    prefix: string
    lastNumber?: number
    updatedAt?: Date | string
  }

  export type BarcodeSequenceUpdateManyMutationInput = {
    prefix?: StringFieldUpdateOperationsInput | string
    lastNumber?: IntFieldUpdateOperationsInput | number
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BarcodeSequenceUncheckedUpdateManyInput = {
    prefix?: StringFieldUpdateOperationsInput | string
    lastNumber?: IntFieldUpdateOperationsInput | number
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CustomerLedgerCreateInput = {
    type: $Enums.LedgerEntryType
    amount: Decimal | DecimalJsLike | number | string
    paymentMethod?: $Enums.PaymentMethod | null
    reference?: string | null
    note?: string | null
    createdAt?: Date | string
    customer: CustomerCreateNestedOneWithoutLedgerInput
    sale?: SaleCreateNestedOneWithoutLedgerEntriesInput
  }

  export type CustomerLedgerUncheckedCreateInput = {
    id?: number
    customerId: number
    saleId?: number | null
    type: $Enums.LedgerEntryType
    amount: Decimal | DecimalJsLike | number | string
    paymentMethod?: $Enums.PaymentMethod | null
    reference?: string | null
    note?: string | null
    createdAt?: Date | string
  }

  export type CustomerLedgerUpdateInput = {
    type?: EnumLedgerEntryTypeFieldUpdateOperationsInput | $Enums.LedgerEntryType
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    paymentMethod?: NullableEnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod | null
    reference?: NullableStringFieldUpdateOperationsInput | string | null
    note?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    customer?: CustomerUpdateOneRequiredWithoutLedgerNestedInput
    sale?: SaleUpdateOneWithoutLedgerEntriesNestedInput
  }

  export type CustomerLedgerUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    customerId?: IntFieldUpdateOperationsInput | number
    saleId?: NullableIntFieldUpdateOperationsInput | number | null
    type?: EnumLedgerEntryTypeFieldUpdateOperationsInput | $Enums.LedgerEntryType
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    paymentMethod?: NullableEnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod | null
    reference?: NullableStringFieldUpdateOperationsInput | string | null
    note?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CustomerLedgerCreateManyInput = {
    id?: number
    customerId: number
    saleId?: number | null
    type: $Enums.LedgerEntryType
    amount: Decimal | DecimalJsLike | number | string
    paymentMethod?: $Enums.PaymentMethod | null
    reference?: string | null
    note?: string | null
    createdAt?: Date | string
  }

  export type CustomerLedgerUpdateManyMutationInput = {
    type?: EnumLedgerEntryTypeFieldUpdateOperationsInput | $Enums.LedgerEntryType
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    paymentMethod?: NullableEnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod | null
    reference?: NullableStringFieldUpdateOperationsInput | string | null
    note?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CustomerLedgerUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    customerId?: IntFieldUpdateOperationsInput | number
    saleId?: NullableIntFieldUpdateOperationsInput | number | null
    type?: EnumLedgerEntryTypeFieldUpdateOperationsInput | $Enums.LedgerEntryType
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    paymentMethod?: NullableEnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod | null
    reference?: NullableStringFieldUpdateOperationsInput | string | null
    note?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RepairCreateInput = {
    repairNumber: string
    itemDescription: string
    metal?: $Enums.MetalType | null
    grossWeight?: Decimal | DecimalJsLike | number | string | null
    issueDescription?: string | null
    estimatedCharge?: Decimal | DecimalJsLike | number | string
    finalCharge?: Decimal | DecimalJsLike | number | string | null
    advancePaid?: Decimal | DecimalJsLike | number | string
    advancePaymentMethod?: $Enums.PaymentMethod
    dueDate?: Date | string | null
    status?: $Enums.RepairStatus
    receivedAt?: Date | string
    deliveredAt?: Date | string | null
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    customer: CustomerCreateNestedOneWithoutRepairsInput
  }

  export type RepairUncheckedCreateInput = {
    id?: number
    repairNumber: string
    customerId: number
    itemDescription: string
    metal?: $Enums.MetalType | null
    grossWeight?: Decimal | DecimalJsLike | number | string | null
    issueDescription?: string | null
    estimatedCharge?: Decimal | DecimalJsLike | number | string
    finalCharge?: Decimal | DecimalJsLike | number | string | null
    advancePaid?: Decimal | DecimalJsLike | number | string
    advancePaymentMethod?: $Enums.PaymentMethod
    dueDate?: Date | string | null
    status?: $Enums.RepairStatus
    receivedAt?: Date | string
    deliveredAt?: Date | string | null
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type RepairUpdateInput = {
    repairNumber?: StringFieldUpdateOperationsInput | string
    itemDescription?: StringFieldUpdateOperationsInput | string
    metal?: NullableEnumMetalTypeFieldUpdateOperationsInput | $Enums.MetalType | null
    grossWeight?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    issueDescription?: NullableStringFieldUpdateOperationsInput | string | null
    estimatedCharge?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    finalCharge?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    advancePaid?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    advancePaymentMethod?: EnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod
    dueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumRepairStatusFieldUpdateOperationsInput | $Enums.RepairStatus
    receivedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deliveredAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    customer?: CustomerUpdateOneRequiredWithoutRepairsNestedInput
  }

  export type RepairUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    repairNumber?: StringFieldUpdateOperationsInput | string
    customerId?: IntFieldUpdateOperationsInput | number
    itemDescription?: StringFieldUpdateOperationsInput | string
    metal?: NullableEnumMetalTypeFieldUpdateOperationsInput | $Enums.MetalType | null
    grossWeight?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    issueDescription?: NullableStringFieldUpdateOperationsInput | string | null
    estimatedCharge?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    finalCharge?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    advancePaid?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    advancePaymentMethod?: EnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod
    dueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumRepairStatusFieldUpdateOperationsInput | $Enums.RepairStatus
    receivedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deliveredAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RepairCreateManyInput = {
    id?: number
    repairNumber: string
    customerId: number
    itemDescription: string
    metal?: $Enums.MetalType | null
    grossWeight?: Decimal | DecimalJsLike | number | string | null
    issueDescription?: string | null
    estimatedCharge?: Decimal | DecimalJsLike | number | string
    finalCharge?: Decimal | DecimalJsLike | number | string | null
    advancePaid?: Decimal | DecimalJsLike | number | string
    advancePaymentMethod?: $Enums.PaymentMethod
    dueDate?: Date | string | null
    status?: $Enums.RepairStatus
    receivedAt?: Date | string
    deliveredAt?: Date | string | null
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type RepairUpdateManyMutationInput = {
    repairNumber?: StringFieldUpdateOperationsInput | string
    itemDescription?: StringFieldUpdateOperationsInput | string
    metal?: NullableEnumMetalTypeFieldUpdateOperationsInput | $Enums.MetalType | null
    grossWeight?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    issueDescription?: NullableStringFieldUpdateOperationsInput | string | null
    estimatedCharge?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    finalCharge?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    advancePaid?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    advancePaymentMethod?: EnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod
    dueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumRepairStatusFieldUpdateOperationsInput | $Enums.RepairStatus
    receivedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deliveredAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RepairUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    repairNumber?: StringFieldUpdateOperationsInput | string
    customerId?: IntFieldUpdateOperationsInput | number
    itemDescription?: StringFieldUpdateOperationsInput | string
    metal?: NullableEnumMetalTypeFieldUpdateOperationsInput | $Enums.MetalType | null
    grossWeight?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    issueDescription?: NullableStringFieldUpdateOperationsInput | string | null
    estimatedCharge?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    finalCharge?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    advancePaid?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    advancePaymentMethod?: EnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod
    dueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumRepairStatusFieldUpdateOperationsInput | $Enums.RepairStatus
    receivedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deliveredAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CashbookEntryCreateInput = {
    entryDate: string
    type: $Enums.CashbookType
    paymentMethod: $Enums.PaymentMethod
    description: string
    amount: Decimal | DecimalJsLike | number | string
    reference?: string | null
    notes?: string | null
    syncLedger?: boolean
    createdAt?: Date | string
    customer?: CustomerCreateNestedOneWithoutCashbookEntriesInput
  }

  export type CashbookEntryUncheckedCreateInput = {
    id?: number
    entryDate: string
    type: $Enums.CashbookType
    paymentMethod: $Enums.PaymentMethod
    description: string
    amount: Decimal | DecimalJsLike | number | string
    reference?: string | null
    notes?: string | null
    customerId?: number | null
    syncLedger?: boolean
    createdAt?: Date | string
  }

  export type CashbookEntryUpdateInput = {
    entryDate?: StringFieldUpdateOperationsInput | string
    type?: EnumCashbookTypeFieldUpdateOperationsInput | $Enums.CashbookType
    paymentMethod?: EnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod
    description?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    reference?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    syncLedger?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    customer?: CustomerUpdateOneWithoutCashbookEntriesNestedInput
  }

  export type CashbookEntryUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    entryDate?: StringFieldUpdateOperationsInput | string
    type?: EnumCashbookTypeFieldUpdateOperationsInput | $Enums.CashbookType
    paymentMethod?: EnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod
    description?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    reference?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    customerId?: NullableIntFieldUpdateOperationsInput | number | null
    syncLedger?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CashbookEntryCreateManyInput = {
    id?: number
    entryDate: string
    type: $Enums.CashbookType
    paymentMethod: $Enums.PaymentMethod
    description: string
    amount: Decimal | DecimalJsLike | number | string
    reference?: string | null
    notes?: string | null
    customerId?: number | null
    syncLedger?: boolean
    createdAt?: Date | string
  }

  export type CashbookEntryUpdateManyMutationInput = {
    entryDate?: StringFieldUpdateOperationsInput | string
    type?: EnumCashbookTypeFieldUpdateOperationsInput | $Enums.CashbookType
    paymentMethod?: EnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod
    description?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    reference?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    syncLedger?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CashbookEntryUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    entryDate?: StringFieldUpdateOperationsInput | string
    type?: EnumCashbookTypeFieldUpdateOperationsInput | $Enums.CashbookType
    paymentMethod?: EnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod
    description?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    reference?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    customerId?: NullableIntFieldUpdateOperationsInput | number | null
    syncLedger?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UrdPurchaseCreateInput = {
    purchaseNumber: string
    purchaseDate?: Date | string
    metal?: $Enums.MetalType
    purity?: string | null
    grossWeight?: Decimal | DecimalJsLike | number | string
    netWeight?: Decimal | DecimalJsLike | number | string
    ratePerGram?: Decimal | DecimalJsLike | number | string
    totalAmount?: Decimal | DecimalJsLike | number | string
    saleOffset?: Decimal | DecimalJsLike | number | string
    paid?: Decimal | DecimalJsLike | number | string
    paymentMethod?: $Enums.PaymentMethod
    description?: string | null
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    customer: CustomerCreateNestedOneWithoutUrdPurchasesInput
    sale?: SaleCreateNestedOneWithoutUrdPurchaseInput
  }

  export type UrdPurchaseUncheckedCreateInput = {
    id?: number
    purchaseNumber: string
    customerId: number
    purchaseDate?: Date | string
    metal?: $Enums.MetalType
    purity?: string | null
    grossWeight?: Decimal | DecimalJsLike | number | string
    netWeight?: Decimal | DecimalJsLike | number | string
    ratePerGram?: Decimal | DecimalJsLike | number | string
    totalAmount?: Decimal | DecimalJsLike | number | string
    saleOffset?: Decimal | DecimalJsLike | number | string
    paid?: Decimal | DecimalJsLike | number | string
    paymentMethod?: $Enums.PaymentMethod
    description?: string | null
    notes?: string | null
    saleId?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UrdPurchaseUpdateInput = {
    purchaseNumber?: StringFieldUpdateOperationsInput | string
    purchaseDate?: DateTimeFieldUpdateOperationsInput | Date | string
    metal?: EnumMetalTypeFieldUpdateOperationsInput | $Enums.MetalType
    purity?: NullableStringFieldUpdateOperationsInput | string | null
    grossWeight?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    netWeight?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    ratePerGram?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    saleOffset?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    paid?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    paymentMethod?: EnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod
    description?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    customer?: CustomerUpdateOneRequiredWithoutUrdPurchasesNestedInput
    sale?: SaleUpdateOneWithoutUrdPurchaseNestedInput
  }

  export type UrdPurchaseUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    purchaseNumber?: StringFieldUpdateOperationsInput | string
    customerId?: IntFieldUpdateOperationsInput | number
    purchaseDate?: DateTimeFieldUpdateOperationsInput | Date | string
    metal?: EnumMetalTypeFieldUpdateOperationsInput | $Enums.MetalType
    purity?: NullableStringFieldUpdateOperationsInput | string | null
    grossWeight?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    netWeight?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    ratePerGram?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    saleOffset?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    paid?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    paymentMethod?: EnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod
    description?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    saleId?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UrdPurchaseCreateManyInput = {
    id?: number
    purchaseNumber: string
    customerId: number
    purchaseDate?: Date | string
    metal?: $Enums.MetalType
    purity?: string | null
    grossWeight?: Decimal | DecimalJsLike | number | string
    netWeight?: Decimal | DecimalJsLike | number | string
    ratePerGram?: Decimal | DecimalJsLike | number | string
    totalAmount?: Decimal | DecimalJsLike | number | string
    saleOffset?: Decimal | DecimalJsLike | number | string
    paid?: Decimal | DecimalJsLike | number | string
    paymentMethod?: $Enums.PaymentMethod
    description?: string | null
    notes?: string | null
    saleId?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UrdPurchaseUpdateManyMutationInput = {
    purchaseNumber?: StringFieldUpdateOperationsInput | string
    purchaseDate?: DateTimeFieldUpdateOperationsInput | Date | string
    metal?: EnumMetalTypeFieldUpdateOperationsInput | $Enums.MetalType
    purity?: NullableStringFieldUpdateOperationsInput | string | null
    grossWeight?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    netWeight?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    ratePerGram?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    saleOffset?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    paid?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    paymentMethod?: EnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod
    description?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UrdPurchaseUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    purchaseNumber?: StringFieldUpdateOperationsInput | string
    customerId?: IntFieldUpdateOperationsInput | number
    purchaseDate?: DateTimeFieldUpdateOperationsInput | Date | string
    metal?: EnumMetalTypeFieldUpdateOperationsInput | $Enums.MetalType
    purity?: NullableStringFieldUpdateOperationsInput | string | null
    grossWeight?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    netWeight?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    ratePerGram?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    saleOffset?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    paid?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    paymentMethod?: EnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod
    description?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    saleId?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type SaleListRelationFilter = {
    every?: SaleWhereInput
    some?: SaleWhereInput
    none?: SaleWhereInput
  }

  export type RepairListRelationFilter = {
    every?: RepairWhereInput
    some?: RepairWhereInput
    none?: RepairWhereInput
  }

  export type CustomerLedgerListRelationFilter = {
    every?: CustomerLedgerWhereInput
    some?: CustomerLedgerWhereInput
    none?: CustomerLedgerWhereInput
  }

  export type UrdPurchaseListRelationFilter = {
    every?: UrdPurchaseWhereInput
    some?: UrdPurchaseWhereInput
    none?: UrdPurchaseWhereInput
  }

  export type CashbookEntryListRelationFilter = {
    every?: CashbookEntryWhereInput
    some?: CashbookEntryWhereInput
    none?: CashbookEntryWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type SaleOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type RepairOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type CustomerLedgerOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UrdPurchaseOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type CashbookEntryOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type CustomerOrderByRelevanceInput = {
    fields: CustomerOrderByRelevanceFieldEnum | CustomerOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type CustomerCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    phone?: SortOrder
    email?: SortOrder
    address?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CustomerAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type CustomerMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    phone?: SortOrder
    email?: SortOrder
    address?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CustomerMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    phone?: SortOrder
    email?: SortOrder
    address?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CustomerSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type PurchaseListRelationFilter = {
    every?: PurchaseWhereInput
    some?: PurchaseWhereInput
    none?: PurchaseWhereInput
  }

  export type PurchaseOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type SupplierOrderByRelevanceInput = {
    fields: SupplierOrderByRelevanceFieldEnum | SupplierOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type SupplierCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    phone?: SortOrder
    email?: SortOrder
    address?: SortOrder
    gstin?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SupplierAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type SupplierMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    phone?: SortOrder
    email?: SortOrder
    address?: SortOrder
    gstin?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SupplierMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    phone?: SortOrder
    email?: SortOrder
    address?: SortOrder
    gstin?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SupplierSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type EnumMetalTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.MetalType | EnumMetalTypeFieldRefInput<$PrismaModel>
    in?: $Enums.MetalType[]
    notIn?: $Enums.MetalType[]
    not?: NestedEnumMetalTypeFilter<$PrismaModel> | $Enums.MetalType
  }

  export type DecimalFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[]
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[]
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
  }

  export type EnumMakingChargeTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.MakingChargeType | EnumMakingChargeTypeFieldRefInput<$PrismaModel>
    in?: $Enums.MakingChargeType[]
    notIn?: $Enums.MakingChargeType[]
    not?: NestedEnumMakingChargeTypeFilter<$PrismaModel> | $Enums.MakingChargeType
  }

  export type EnumProductStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ProductStatus | EnumProductStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ProductStatus[]
    notIn?: $Enums.ProductStatus[]
    not?: NestedEnumProductStatusFilter<$PrismaModel> | $Enums.ProductStatus
  }

  export type SaleItemListRelationFilter = {
    every?: SaleItemWhereInput
    some?: SaleItemWhereInput
    none?: SaleItemWhereInput
  }

  export type PurchaseItemListRelationFilter = {
    every?: PurchaseItemWhereInput
    some?: PurchaseItemWhereInput
    none?: PurchaseItemWhereInput
  }

  export type StockMovementListRelationFilter = {
    every?: StockMovementWhereInput
    some?: StockMovementWhereInput
    none?: StockMovementWhereInput
  }

  export type SaleItemOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type PurchaseItemOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type StockMovementOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ProductOrderByRelevanceInput = {
    fields: ProductOrderByRelevanceFieldEnum | ProductOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type ProductCountOrderByAggregateInput = {
    id?: SortOrder
    barcode?: SortOrder
    sku?: SortOrder
    name?: SortOrder
    category?: SortOrder
    metal?: SortOrder
    purity?: SortOrder
    grossWeight?: SortOrder
    stoneWeight?: SortOrder
    netWeight?: SortOrder
    quantity?: SortOrder
    reorderLevel?: SortOrder
    purchasePrice?: SortOrder
    sellingPrice?: SortOrder
    makingChargePerGram?: SortOrder
    makingChargeType?: SortOrder
    makingChargeValue?: SortOrder
    location?: SortOrder
    notes?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProductAvgOrderByAggregateInput = {
    id?: SortOrder
    grossWeight?: SortOrder
    stoneWeight?: SortOrder
    netWeight?: SortOrder
    quantity?: SortOrder
    reorderLevel?: SortOrder
    purchasePrice?: SortOrder
    sellingPrice?: SortOrder
    makingChargePerGram?: SortOrder
    makingChargeValue?: SortOrder
  }

  export type ProductMaxOrderByAggregateInput = {
    id?: SortOrder
    barcode?: SortOrder
    sku?: SortOrder
    name?: SortOrder
    category?: SortOrder
    metal?: SortOrder
    purity?: SortOrder
    grossWeight?: SortOrder
    stoneWeight?: SortOrder
    netWeight?: SortOrder
    quantity?: SortOrder
    reorderLevel?: SortOrder
    purchasePrice?: SortOrder
    sellingPrice?: SortOrder
    makingChargePerGram?: SortOrder
    makingChargeType?: SortOrder
    makingChargeValue?: SortOrder
    location?: SortOrder
    notes?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProductMinOrderByAggregateInput = {
    id?: SortOrder
    barcode?: SortOrder
    sku?: SortOrder
    name?: SortOrder
    category?: SortOrder
    metal?: SortOrder
    purity?: SortOrder
    grossWeight?: SortOrder
    stoneWeight?: SortOrder
    netWeight?: SortOrder
    quantity?: SortOrder
    reorderLevel?: SortOrder
    purchasePrice?: SortOrder
    sellingPrice?: SortOrder
    makingChargePerGram?: SortOrder
    makingChargeType?: SortOrder
    makingChargeValue?: SortOrder
    location?: SortOrder
    notes?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProductSumOrderByAggregateInput = {
    id?: SortOrder
    grossWeight?: SortOrder
    stoneWeight?: SortOrder
    netWeight?: SortOrder
    quantity?: SortOrder
    reorderLevel?: SortOrder
    purchasePrice?: SortOrder
    sellingPrice?: SortOrder
    makingChargePerGram?: SortOrder
    makingChargeValue?: SortOrder
  }

  export type EnumMetalTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.MetalType | EnumMetalTypeFieldRefInput<$PrismaModel>
    in?: $Enums.MetalType[]
    notIn?: $Enums.MetalType[]
    not?: NestedEnumMetalTypeWithAggregatesFilter<$PrismaModel> | $Enums.MetalType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumMetalTypeFilter<$PrismaModel>
    _max?: NestedEnumMetalTypeFilter<$PrismaModel>
  }

  export type DecimalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[]
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[]
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedDecimalFilter<$PrismaModel>
    _sum?: NestedDecimalFilter<$PrismaModel>
    _min?: NestedDecimalFilter<$PrismaModel>
    _max?: NestedDecimalFilter<$PrismaModel>
  }

  export type EnumMakingChargeTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.MakingChargeType | EnumMakingChargeTypeFieldRefInput<$PrismaModel>
    in?: $Enums.MakingChargeType[]
    notIn?: $Enums.MakingChargeType[]
    not?: NestedEnumMakingChargeTypeWithAggregatesFilter<$PrismaModel> | $Enums.MakingChargeType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumMakingChargeTypeFilter<$PrismaModel>
    _max?: NestedEnumMakingChargeTypeFilter<$PrismaModel>
  }

  export type EnumProductStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ProductStatus | EnumProductStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ProductStatus[]
    notIn?: $Enums.ProductStatus[]
    not?: NestedEnumProductStatusWithAggregatesFilter<$PrismaModel> | $Enums.ProductStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumProductStatusFilter<$PrismaModel>
    _max?: NestedEnumProductStatusFilter<$PrismaModel>
  }

  export type EnumMovementTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.MovementType | EnumMovementTypeFieldRefInput<$PrismaModel>
    in?: $Enums.MovementType[]
    notIn?: $Enums.MovementType[]
    not?: NestedEnumMovementTypeFilter<$PrismaModel> | $Enums.MovementType
  }

  export type ProductScalarRelationFilter = {
    is?: ProductWhereInput
    isNot?: ProductWhereInput
  }

  export type StockMovementOrderByRelevanceInput = {
    fields: StockMovementOrderByRelevanceFieldEnum | StockMovementOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type StockMovementCountOrderByAggregateInput = {
    id?: SortOrder
    productId?: SortOrder
    type?: SortOrder
    quantity?: SortOrder
    note?: SortOrder
    createdAt?: SortOrder
  }

  export type StockMovementAvgOrderByAggregateInput = {
    id?: SortOrder
    productId?: SortOrder
    quantity?: SortOrder
  }

  export type StockMovementMaxOrderByAggregateInput = {
    id?: SortOrder
    productId?: SortOrder
    type?: SortOrder
    quantity?: SortOrder
    note?: SortOrder
    createdAt?: SortOrder
  }

  export type StockMovementMinOrderByAggregateInput = {
    id?: SortOrder
    productId?: SortOrder
    type?: SortOrder
    quantity?: SortOrder
    note?: SortOrder
    createdAt?: SortOrder
  }

  export type StockMovementSumOrderByAggregateInput = {
    id?: SortOrder
    productId?: SortOrder
    quantity?: SortOrder
  }

  export type EnumMovementTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.MovementType | EnumMovementTypeFieldRefInput<$PrismaModel>
    in?: $Enums.MovementType[]
    notIn?: $Enums.MovementType[]
    not?: NestedEnumMovementTypeWithAggregatesFilter<$PrismaModel> | $Enums.MovementType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumMovementTypeFilter<$PrismaModel>
    _max?: NestedEnumMovementTypeFilter<$PrismaModel>
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type EnumPaymentMethodFilter<$PrismaModel = never> = {
    equals?: $Enums.PaymentMethod | EnumPaymentMethodFieldRefInput<$PrismaModel>
    in?: $Enums.PaymentMethod[]
    notIn?: $Enums.PaymentMethod[]
    not?: NestedEnumPaymentMethodFilter<$PrismaModel> | $Enums.PaymentMethod
  }

  export type SupplierNullableScalarRelationFilter = {
    is?: SupplierWhereInput | null
    isNot?: SupplierWhereInput | null
  }

  export type PurchaseOrderByRelevanceInput = {
    fields: PurchaseOrderByRelevanceFieldEnum | PurchaseOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type PurchaseCountOrderByAggregateInput = {
    id?: SortOrder
    purchaseNumber?: SortOrder
    supplierId?: SortOrder
    purchaseDate?: SortOrder
    subtotal?: SortOrder
    discount?: SortOrder
    total?: SortOrder
    paid?: SortOrder
    paymentMethod?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PurchaseAvgOrderByAggregateInput = {
    id?: SortOrder
    supplierId?: SortOrder
    subtotal?: SortOrder
    discount?: SortOrder
    total?: SortOrder
    paid?: SortOrder
  }

  export type PurchaseMaxOrderByAggregateInput = {
    id?: SortOrder
    purchaseNumber?: SortOrder
    supplierId?: SortOrder
    purchaseDate?: SortOrder
    subtotal?: SortOrder
    discount?: SortOrder
    total?: SortOrder
    paid?: SortOrder
    paymentMethod?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PurchaseMinOrderByAggregateInput = {
    id?: SortOrder
    purchaseNumber?: SortOrder
    supplierId?: SortOrder
    purchaseDate?: SortOrder
    subtotal?: SortOrder
    discount?: SortOrder
    total?: SortOrder
    paid?: SortOrder
    paymentMethod?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PurchaseSumOrderByAggregateInput = {
    id?: SortOrder
    supplierId?: SortOrder
    subtotal?: SortOrder
    discount?: SortOrder
    total?: SortOrder
    paid?: SortOrder
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type EnumPaymentMethodWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PaymentMethod | EnumPaymentMethodFieldRefInput<$PrismaModel>
    in?: $Enums.PaymentMethod[]
    notIn?: $Enums.PaymentMethod[]
    not?: NestedEnumPaymentMethodWithAggregatesFilter<$PrismaModel> | $Enums.PaymentMethod
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumPaymentMethodFilter<$PrismaModel>
    _max?: NestedEnumPaymentMethodFilter<$PrismaModel>
  }

  export type PurchaseScalarRelationFilter = {
    is?: PurchaseWhereInput
    isNot?: PurchaseWhereInput
  }

  export type PurchaseItemCountOrderByAggregateInput = {
    id?: SortOrder
    purchaseId?: SortOrder
    productId?: SortOrder
    quantity?: SortOrder
    unitCost?: SortOrder
    lineTotal?: SortOrder
  }

  export type PurchaseItemAvgOrderByAggregateInput = {
    id?: SortOrder
    purchaseId?: SortOrder
    productId?: SortOrder
    quantity?: SortOrder
    unitCost?: SortOrder
    lineTotal?: SortOrder
  }

  export type PurchaseItemMaxOrderByAggregateInput = {
    id?: SortOrder
    purchaseId?: SortOrder
    productId?: SortOrder
    quantity?: SortOrder
    unitCost?: SortOrder
    lineTotal?: SortOrder
  }

  export type PurchaseItemMinOrderByAggregateInput = {
    id?: SortOrder
    purchaseId?: SortOrder
    productId?: SortOrder
    quantity?: SortOrder
    unitCost?: SortOrder
    lineTotal?: SortOrder
  }

  export type PurchaseItemSumOrderByAggregateInput = {
    id?: SortOrder
    purchaseId?: SortOrder
    productId?: SortOrder
    quantity?: SortOrder
    unitCost?: SortOrder
    lineTotal?: SortOrder
  }

  export type CustomerNullableScalarRelationFilter = {
    is?: CustomerWhereInput | null
    isNot?: CustomerWhereInput | null
  }

  export type UrdPurchaseNullableScalarRelationFilter = {
    is?: UrdPurchaseWhereInput | null
    isNot?: UrdPurchaseWhereInput | null
  }

  export type SaleOrderByRelevanceInput = {
    fields: SaleOrderByRelevanceFieldEnum | SaleOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type SaleCountOrderByAggregateInput = {
    id?: SortOrder
    invoiceNumber?: SortOrder
    customerId?: SortOrder
    saleDate?: SortOrder
    subtotal?: SortOrder
    discount?: SortOrder
    gstRate?: SortOrder
    gstAmount?: SortOrder
    total?: SortOrder
    urdOffset?: SortOrder
    paid?: SortOrder
    cashPaid?: SortOrder
    upiPaid?: SortOrder
    balance?: SortOrder
    paymentMethod?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SaleAvgOrderByAggregateInput = {
    id?: SortOrder
    customerId?: SortOrder
    subtotal?: SortOrder
    discount?: SortOrder
    gstRate?: SortOrder
    gstAmount?: SortOrder
    total?: SortOrder
    urdOffset?: SortOrder
    paid?: SortOrder
    cashPaid?: SortOrder
    upiPaid?: SortOrder
    balance?: SortOrder
  }

  export type SaleMaxOrderByAggregateInput = {
    id?: SortOrder
    invoiceNumber?: SortOrder
    customerId?: SortOrder
    saleDate?: SortOrder
    subtotal?: SortOrder
    discount?: SortOrder
    gstRate?: SortOrder
    gstAmount?: SortOrder
    total?: SortOrder
    urdOffset?: SortOrder
    paid?: SortOrder
    cashPaid?: SortOrder
    upiPaid?: SortOrder
    balance?: SortOrder
    paymentMethod?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SaleMinOrderByAggregateInput = {
    id?: SortOrder
    invoiceNumber?: SortOrder
    customerId?: SortOrder
    saleDate?: SortOrder
    subtotal?: SortOrder
    discount?: SortOrder
    gstRate?: SortOrder
    gstAmount?: SortOrder
    total?: SortOrder
    urdOffset?: SortOrder
    paid?: SortOrder
    cashPaid?: SortOrder
    upiPaid?: SortOrder
    balance?: SortOrder
    paymentMethod?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SaleSumOrderByAggregateInput = {
    id?: SortOrder
    customerId?: SortOrder
    subtotal?: SortOrder
    discount?: SortOrder
    gstRate?: SortOrder
    gstAmount?: SortOrder
    total?: SortOrder
    urdOffset?: SortOrder
    paid?: SortOrder
    cashPaid?: SortOrder
    upiPaid?: SortOrder
    balance?: SortOrder
  }

  export type SaleScalarRelationFilter = {
    is?: SaleWhereInput
    isNot?: SaleWhereInput
  }

  export type SaleItemCountOrderByAggregateInput = {
    id?: SortOrder
    saleId?: SortOrder
    productId?: SortOrder
    quantity?: SortOrder
    weight?: SortOrder
    unitPrice?: SortOrder
    metalRate?: SortOrder
    metalAmount?: SortOrder
    makingCharge?: SortOrder
    makingChargeType?: SortOrder
    makingChargeValue?: SortOrder
    taxableAmount?: SortOrder
    lineTotal?: SortOrder
  }

  export type SaleItemAvgOrderByAggregateInput = {
    id?: SortOrder
    saleId?: SortOrder
    productId?: SortOrder
    quantity?: SortOrder
    weight?: SortOrder
    unitPrice?: SortOrder
    metalRate?: SortOrder
    metalAmount?: SortOrder
    makingCharge?: SortOrder
    makingChargeValue?: SortOrder
    taxableAmount?: SortOrder
    lineTotal?: SortOrder
  }

  export type SaleItemMaxOrderByAggregateInput = {
    id?: SortOrder
    saleId?: SortOrder
    productId?: SortOrder
    quantity?: SortOrder
    weight?: SortOrder
    unitPrice?: SortOrder
    metalRate?: SortOrder
    metalAmount?: SortOrder
    makingCharge?: SortOrder
    makingChargeType?: SortOrder
    makingChargeValue?: SortOrder
    taxableAmount?: SortOrder
    lineTotal?: SortOrder
  }

  export type SaleItemMinOrderByAggregateInput = {
    id?: SortOrder
    saleId?: SortOrder
    productId?: SortOrder
    quantity?: SortOrder
    weight?: SortOrder
    unitPrice?: SortOrder
    metalRate?: SortOrder
    metalAmount?: SortOrder
    makingCharge?: SortOrder
    makingChargeType?: SortOrder
    makingChargeValue?: SortOrder
    taxableAmount?: SortOrder
    lineTotal?: SortOrder
  }

  export type SaleItemSumOrderByAggregateInput = {
    id?: SortOrder
    saleId?: SortOrder
    productId?: SortOrder
    quantity?: SortOrder
    weight?: SortOrder
    unitPrice?: SortOrder
    metalRate?: SortOrder
    metalAmount?: SortOrder
    makingCharge?: SortOrder
    makingChargeValue?: SortOrder
    taxableAmount?: SortOrder
    lineTotal?: SortOrder
  }

  export type DailyRateOrderByRelevanceInput = {
    fields: DailyRateOrderByRelevanceFieldEnum | DailyRateOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type DailyRateCountOrderByAggregateInput = {
    id?: SortOrder
    rateDate?: SortOrder
    gold22k?: SortOrder
    gold24k?: SortOrder
    silver?: SortOrder
    note?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DailyRateAvgOrderByAggregateInput = {
    id?: SortOrder
    gold22k?: SortOrder
    gold24k?: SortOrder
    silver?: SortOrder
  }

  export type DailyRateMaxOrderByAggregateInput = {
    id?: SortOrder
    rateDate?: SortOrder
    gold22k?: SortOrder
    gold24k?: SortOrder
    silver?: SortOrder
    note?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DailyRateMinOrderByAggregateInput = {
    id?: SortOrder
    rateDate?: SortOrder
    gold22k?: SortOrder
    gold24k?: SortOrder
    silver?: SortOrder
    note?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DailyRateSumOrderByAggregateInput = {
    id?: SortOrder
    gold22k?: SortOrder
    gold24k?: SortOrder
    silver?: SortOrder
  }

  export type BarcodeSequenceOrderByRelevanceInput = {
    fields: BarcodeSequenceOrderByRelevanceFieldEnum | BarcodeSequenceOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type BarcodeSequenceCountOrderByAggregateInput = {
    prefix?: SortOrder
    lastNumber?: SortOrder
    updatedAt?: SortOrder
  }

  export type BarcodeSequenceAvgOrderByAggregateInput = {
    lastNumber?: SortOrder
  }

  export type BarcodeSequenceMaxOrderByAggregateInput = {
    prefix?: SortOrder
    lastNumber?: SortOrder
    updatedAt?: SortOrder
  }

  export type BarcodeSequenceMinOrderByAggregateInput = {
    prefix?: SortOrder
    lastNumber?: SortOrder
    updatedAt?: SortOrder
  }

  export type BarcodeSequenceSumOrderByAggregateInput = {
    lastNumber?: SortOrder
  }

  export type EnumLedgerEntryTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.LedgerEntryType | EnumLedgerEntryTypeFieldRefInput<$PrismaModel>
    in?: $Enums.LedgerEntryType[]
    notIn?: $Enums.LedgerEntryType[]
    not?: NestedEnumLedgerEntryTypeFilter<$PrismaModel> | $Enums.LedgerEntryType
  }

  export type EnumPaymentMethodNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.PaymentMethod | EnumPaymentMethodFieldRefInput<$PrismaModel> | null
    in?: $Enums.PaymentMethod[] | null
    notIn?: $Enums.PaymentMethod[] | null
    not?: NestedEnumPaymentMethodNullableFilter<$PrismaModel> | $Enums.PaymentMethod | null
  }

  export type CustomerScalarRelationFilter = {
    is?: CustomerWhereInput
    isNot?: CustomerWhereInput
  }

  export type SaleNullableScalarRelationFilter = {
    is?: SaleWhereInput | null
    isNot?: SaleWhereInput | null
  }

  export type CustomerLedgerOrderByRelevanceInput = {
    fields: CustomerLedgerOrderByRelevanceFieldEnum | CustomerLedgerOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type CustomerLedgerCountOrderByAggregateInput = {
    id?: SortOrder
    customerId?: SortOrder
    saleId?: SortOrder
    type?: SortOrder
    amount?: SortOrder
    paymentMethod?: SortOrder
    reference?: SortOrder
    note?: SortOrder
    createdAt?: SortOrder
  }

  export type CustomerLedgerAvgOrderByAggregateInput = {
    id?: SortOrder
    customerId?: SortOrder
    saleId?: SortOrder
    amount?: SortOrder
  }

  export type CustomerLedgerMaxOrderByAggregateInput = {
    id?: SortOrder
    customerId?: SortOrder
    saleId?: SortOrder
    type?: SortOrder
    amount?: SortOrder
    paymentMethod?: SortOrder
    reference?: SortOrder
    note?: SortOrder
    createdAt?: SortOrder
  }

  export type CustomerLedgerMinOrderByAggregateInput = {
    id?: SortOrder
    customerId?: SortOrder
    saleId?: SortOrder
    type?: SortOrder
    amount?: SortOrder
    paymentMethod?: SortOrder
    reference?: SortOrder
    note?: SortOrder
    createdAt?: SortOrder
  }

  export type CustomerLedgerSumOrderByAggregateInput = {
    id?: SortOrder
    customerId?: SortOrder
    saleId?: SortOrder
    amount?: SortOrder
  }

  export type EnumLedgerEntryTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.LedgerEntryType | EnumLedgerEntryTypeFieldRefInput<$PrismaModel>
    in?: $Enums.LedgerEntryType[]
    notIn?: $Enums.LedgerEntryType[]
    not?: NestedEnumLedgerEntryTypeWithAggregatesFilter<$PrismaModel> | $Enums.LedgerEntryType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumLedgerEntryTypeFilter<$PrismaModel>
    _max?: NestedEnumLedgerEntryTypeFilter<$PrismaModel>
  }

  export type EnumPaymentMethodNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PaymentMethod | EnumPaymentMethodFieldRefInput<$PrismaModel> | null
    in?: $Enums.PaymentMethod[] | null
    notIn?: $Enums.PaymentMethod[] | null
    not?: NestedEnumPaymentMethodNullableWithAggregatesFilter<$PrismaModel> | $Enums.PaymentMethod | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumPaymentMethodNullableFilter<$PrismaModel>
    _max?: NestedEnumPaymentMethodNullableFilter<$PrismaModel>
  }

  export type EnumMetalTypeNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.MetalType | EnumMetalTypeFieldRefInput<$PrismaModel> | null
    in?: $Enums.MetalType[] | null
    notIn?: $Enums.MetalType[] | null
    not?: NestedEnumMetalTypeNullableFilter<$PrismaModel> | $Enums.MetalType | null
  }

  export type DecimalNullableFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type EnumRepairStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.RepairStatus | EnumRepairStatusFieldRefInput<$PrismaModel>
    in?: $Enums.RepairStatus[]
    notIn?: $Enums.RepairStatus[]
    not?: NestedEnumRepairStatusFilter<$PrismaModel> | $Enums.RepairStatus
  }

  export type RepairOrderByRelevanceInput = {
    fields: RepairOrderByRelevanceFieldEnum | RepairOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type RepairCountOrderByAggregateInput = {
    id?: SortOrder
    repairNumber?: SortOrder
    customerId?: SortOrder
    itemDescription?: SortOrder
    metal?: SortOrder
    grossWeight?: SortOrder
    issueDescription?: SortOrder
    estimatedCharge?: SortOrder
    finalCharge?: SortOrder
    advancePaid?: SortOrder
    advancePaymentMethod?: SortOrder
    dueDate?: SortOrder
    status?: SortOrder
    receivedAt?: SortOrder
    deliveredAt?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type RepairAvgOrderByAggregateInput = {
    id?: SortOrder
    customerId?: SortOrder
    grossWeight?: SortOrder
    estimatedCharge?: SortOrder
    finalCharge?: SortOrder
    advancePaid?: SortOrder
  }

  export type RepairMaxOrderByAggregateInput = {
    id?: SortOrder
    repairNumber?: SortOrder
    customerId?: SortOrder
    itemDescription?: SortOrder
    metal?: SortOrder
    grossWeight?: SortOrder
    issueDescription?: SortOrder
    estimatedCharge?: SortOrder
    finalCharge?: SortOrder
    advancePaid?: SortOrder
    advancePaymentMethod?: SortOrder
    dueDate?: SortOrder
    status?: SortOrder
    receivedAt?: SortOrder
    deliveredAt?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type RepairMinOrderByAggregateInput = {
    id?: SortOrder
    repairNumber?: SortOrder
    customerId?: SortOrder
    itemDescription?: SortOrder
    metal?: SortOrder
    grossWeight?: SortOrder
    issueDescription?: SortOrder
    estimatedCharge?: SortOrder
    finalCharge?: SortOrder
    advancePaid?: SortOrder
    advancePaymentMethod?: SortOrder
    dueDate?: SortOrder
    status?: SortOrder
    receivedAt?: SortOrder
    deliveredAt?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type RepairSumOrderByAggregateInput = {
    id?: SortOrder
    customerId?: SortOrder
    grossWeight?: SortOrder
    estimatedCharge?: SortOrder
    finalCharge?: SortOrder
    advancePaid?: SortOrder
  }

  export type EnumMetalTypeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.MetalType | EnumMetalTypeFieldRefInput<$PrismaModel> | null
    in?: $Enums.MetalType[] | null
    notIn?: $Enums.MetalType[] | null
    not?: NestedEnumMetalTypeNullableWithAggregatesFilter<$PrismaModel> | $Enums.MetalType | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumMetalTypeNullableFilter<$PrismaModel>
    _max?: NestedEnumMetalTypeNullableFilter<$PrismaModel>
  }

  export type DecimalNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedDecimalNullableFilter<$PrismaModel>
    _sum?: NestedDecimalNullableFilter<$PrismaModel>
    _min?: NestedDecimalNullableFilter<$PrismaModel>
    _max?: NestedDecimalNullableFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type EnumRepairStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.RepairStatus | EnumRepairStatusFieldRefInput<$PrismaModel>
    in?: $Enums.RepairStatus[]
    notIn?: $Enums.RepairStatus[]
    not?: NestedEnumRepairStatusWithAggregatesFilter<$PrismaModel> | $Enums.RepairStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRepairStatusFilter<$PrismaModel>
    _max?: NestedEnumRepairStatusFilter<$PrismaModel>
  }

  export type EnumCashbookTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.CashbookType | EnumCashbookTypeFieldRefInput<$PrismaModel>
    in?: $Enums.CashbookType[]
    notIn?: $Enums.CashbookType[]
    not?: NestedEnumCashbookTypeFilter<$PrismaModel> | $Enums.CashbookType
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type CashbookEntryOrderByRelevanceInput = {
    fields: CashbookEntryOrderByRelevanceFieldEnum | CashbookEntryOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type CashbookEntryCountOrderByAggregateInput = {
    id?: SortOrder
    entryDate?: SortOrder
    type?: SortOrder
    paymentMethod?: SortOrder
    description?: SortOrder
    amount?: SortOrder
    reference?: SortOrder
    notes?: SortOrder
    customerId?: SortOrder
    syncLedger?: SortOrder
    createdAt?: SortOrder
  }

  export type CashbookEntryAvgOrderByAggregateInput = {
    id?: SortOrder
    amount?: SortOrder
    customerId?: SortOrder
  }

  export type CashbookEntryMaxOrderByAggregateInput = {
    id?: SortOrder
    entryDate?: SortOrder
    type?: SortOrder
    paymentMethod?: SortOrder
    description?: SortOrder
    amount?: SortOrder
    reference?: SortOrder
    notes?: SortOrder
    customerId?: SortOrder
    syncLedger?: SortOrder
    createdAt?: SortOrder
  }

  export type CashbookEntryMinOrderByAggregateInput = {
    id?: SortOrder
    entryDate?: SortOrder
    type?: SortOrder
    paymentMethod?: SortOrder
    description?: SortOrder
    amount?: SortOrder
    reference?: SortOrder
    notes?: SortOrder
    customerId?: SortOrder
    syncLedger?: SortOrder
    createdAt?: SortOrder
  }

  export type CashbookEntrySumOrderByAggregateInput = {
    id?: SortOrder
    amount?: SortOrder
    customerId?: SortOrder
  }

  export type EnumCashbookTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.CashbookType | EnumCashbookTypeFieldRefInput<$PrismaModel>
    in?: $Enums.CashbookType[]
    notIn?: $Enums.CashbookType[]
    not?: NestedEnumCashbookTypeWithAggregatesFilter<$PrismaModel> | $Enums.CashbookType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumCashbookTypeFilter<$PrismaModel>
    _max?: NestedEnumCashbookTypeFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type UrdPurchaseOrderByRelevanceInput = {
    fields: UrdPurchaseOrderByRelevanceFieldEnum | UrdPurchaseOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type UrdPurchaseCountOrderByAggregateInput = {
    id?: SortOrder
    purchaseNumber?: SortOrder
    customerId?: SortOrder
    purchaseDate?: SortOrder
    metal?: SortOrder
    purity?: SortOrder
    grossWeight?: SortOrder
    netWeight?: SortOrder
    ratePerGram?: SortOrder
    totalAmount?: SortOrder
    saleOffset?: SortOrder
    paid?: SortOrder
    paymentMethod?: SortOrder
    description?: SortOrder
    notes?: SortOrder
    saleId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UrdPurchaseAvgOrderByAggregateInput = {
    id?: SortOrder
    customerId?: SortOrder
    grossWeight?: SortOrder
    netWeight?: SortOrder
    ratePerGram?: SortOrder
    totalAmount?: SortOrder
    saleOffset?: SortOrder
    paid?: SortOrder
    saleId?: SortOrder
  }

  export type UrdPurchaseMaxOrderByAggregateInput = {
    id?: SortOrder
    purchaseNumber?: SortOrder
    customerId?: SortOrder
    purchaseDate?: SortOrder
    metal?: SortOrder
    purity?: SortOrder
    grossWeight?: SortOrder
    netWeight?: SortOrder
    ratePerGram?: SortOrder
    totalAmount?: SortOrder
    saleOffset?: SortOrder
    paid?: SortOrder
    paymentMethod?: SortOrder
    description?: SortOrder
    notes?: SortOrder
    saleId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UrdPurchaseMinOrderByAggregateInput = {
    id?: SortOrder
    purchaseNumber?: SortOrder
    customerId?: SortOrder
    purchaseDate?: SortOrder
    metal?: SortOrder
    purity?: SortOrder
    grossWeight?: SortOrder
    netWeight?: SortOrder
    ratePerGram?: SortOrder
    totalAmount?: SortOrder
    saleOffset?: SortOrder
    paid?: SortOrder
    paymentMethod?: SortOrder
    description?: SortOrder
    notes?: SortOrder
    saleId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UrdPurchaseSumOrderByAggregateInput = {
    id?: SortOrder
    customerId?: SortOrder
    grossWeight?: SortOrder
    netWeight?: SortOrder
    ratePerGram?: SortOrder
    totalAmount?: SortOrder
    saleOffset?: SortOrder
    paid?: SortOrder
    saleId?: SortOrder
  }

  export type SaleCreateNestedManyWithoutCustomerInput = {
    create?: XOR<SaleCreateWithoutCustomerInput, SaleUncheckedCreateWithoutCustomerInput> | SaleCreateWithoutCustomerInput[] | SaleUncheckedCreateWithoutCustomerInput[]
    connectOrCreate?: SaleCreateOrConnectWithoutCustomerInput | SaleCreateOrConnectWithoutCustomerInput[]
    createMany?: SaleCreateManyCustomerInputEnvelope
    connect?: SaleWhereUniqueInput | SaleWhereUniqueInput[]
  }

  export type RepairCreateNestedManyWithoutCustomerInput = {
    create?: XOR<RepairCreateWithoutCustomerInput, RepairUncheckedCreateWithoutCustomerInput> | RepairCreateWithoutCustomerInput[] | RepairUncheckedCreateWithoutCustomerInput[]
    connectOrCreate?: RepairCreateOrConnectWithoutCustomerInput | RepairCreateOrConnectWithoutCustomerInput[]
    createMany?: RepairCreateManyCustomerInputEnvelope
    connect?: RepairWhereUniqueInput | RepairWhereUniqueInput[]
  }

  export type CustomerLedgerCreateNestedManyWithoutCustomerInput = {
    create?: XOR<CustomerLedgerCreateWithoutCustomerInput, CustomerLedgerUncheckedCreateWithoutCustomerInput> | CustomerLedgerCreateWithoutCustomerInput[] | CustomerLedgerUncheckedCreateWithoutCustomerInput[]
    connectOrCreate?: CustomerLedgerCreateOrConnectWithoutCustomerInput | CustomerLedgerCreateOrConnectWithoutCustomerInput[]
    createMany?: CustomerLedgerCreateManyCustomerInputEnvelope
    connect?: CustomerLedgerWhereUniqueInput | CustomerLedgerWhereUniqueInput[]
  }

  export type UrdPurchaseCreateNestedManyWithoutCustomerInput = {
    create?: XOR<UrdPurchaseCreateWithoutCustomerInput, UrdPurchaseUncheckedCreateWithoutCustomerInput> | UrdPurchaseCreateWithoutCustomerInput[] | UrdPurchaseUncheckedCreateWithoutCustomerInput[]
    connectOrCreate?: UrdPurchaseCreateOrConnectWithoutCustomerInput | UrdPurchaseCreateOrConnectWithoutCustomerInput[]
    createMany?: UrdPurchaseCreateManyCustomerInputEnvelope
    connect?: UrdPurchaseWhereUniqueInput | UrdPurchaseWhereUniqueInput[]
  }

  export type CashbookEntryCreateNestedManyWithoutCustomerInput = {
    create?: XOR<CashbookEntryCreateWithoutCustomerInput, CashbookEntryUncheckedCreateWithoutCustomerInput> | CashbookEntryCreateWithoutCustomerInput[] | CashbookEntryUncheckedCreateWithoutCustomerInput[]
    connectOrCreate?: CashbookEntryCreateOrConnectWithoutCustomerInput | CashbookEntryCreateOrConnectWithoutCustomerInput[]
    createMany?: CashbookEntryCreateManyCustomerInputEnvelope
    connect?: CashbookEntryWhereUniqueInput | CashbookEntryWhereUniqueInput[]
  }

  export type SaleUncheckedCreateNestedManyWithoutCustomerInput = {
    create?: XOR<SaleCreateWithoutCustomerInput, SaleUncheckedCreateWithoutCustomerInput> | SaleCreateWithoutCustomerInput[] | SaleUncheckedCreateWithoutCustomerInput[]
    connectOrCreate?: SaleCreateOrConnectWithoutCustomerInput | SaleCreateOrConnectWithoutCustomerInput[]
    createMany?: SaleCreateManyCustomerInputEnvelope
    connect?: SaleWhereUniqueInput | SaleWhereUniqueInput[]
  }

  export type RepairUncheckedCreateNestedManyWithoutCustomerInput = {
    create?: XOR<RepairCreateWithoutCustomerInput, RepairUncheckedCreateWithoutCustomerInput> | RepairCreateWithoutCustomerInput[] | RepairUncheckedCreateWithoutCustomerInput[]
    connectOrCreate?: RepairCreateOrConnectWithoutCustomerInput | RepairCreateOrConnectWithoutCustomerInput[]
    createMany?: RepairCreateManyCustomerInputEnvelope
    connect?: RepairWhereUniqueInput | RepairWhereUniqueInput[]
  }

  export type CustomerLedgerUncheckedCreateNestedManyWithoutCustomerInput = {
    create?: XOR<CustomerLedgerCreateWithoutCustomerInput, CustomerLedgerUncheckedCreateWithoutCustomerInput> | CustomerLedgerCreateWithoutCustomerInput[] | CustomerLedgerUncheckedCreateWithoutCustomerInput[]
    connectOrCreate?: CustomerLedgerCreateOrConnectWithoutCustomerInput | CustomerLedgerCreateOrConnectWithoutCustomerInput[]
    createMany?: CustomerLedgerCreateManyCustomerInputEnvelope
    connect?: CustomerLedgerWhereUniqueInput | CustomerLedgerWhereUniqueInput[]
  }

  export type UrdPurchaseUncheckedCreateNestedManyWithoutCustomerInput = {
    create?: XOR<UrdPurchaseCreateWithoutCustomerInput, UrdPurchaseUncheckedCreateWithoutCustomerInput> | UrdPurchaseCreateWithoutCustomerInput[] | UrdPurchaseUncheckedCreateWithoutCustomerInput[]
    connectOrCreate?: UrdPurchaseCreateOrConnectWithoutCustomerInput | UrdPurchaseCreateOrConnectWithoutCustomerInput[]
    createMany?: UrdPurchaseCreateManyCustomerInputEnvelope
    connect?: UrdPurchaseWhereUniqueInput | UrdPurchaseWhereUniqueInput[]
  }

  export type CashbookEntryUncheckedCreateNestedManyWithoutCustomerInput = {
    create?: XOR<CashbookEntryCreateWithoutCustomerInput, CashbookEntryUncheckedCreateWithoutCustomerInput> | CashbookEntryCreateWithoutCustomerInput[] | CashbookEntryUncheckedCreateWithoutCustomerInput[]
    connectOrCreate?: CashbookEntryCreateOrConnectWithoutCustomerInput | CashbookEntryCreateOrConnectWithoutCustomerInput[]
    createMany?: CashbookEntryCreateManyCustomerInputEnvelope
    connect?: CashbookEntryWhereUniqueInput | CashbookEntryWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type SaleUpdateManyWithoutCustomerNestedInput = {
    create?: XOR<SaleCreateWithoutCustomerInput, SaleUncheckedCreateWithoutCustomerInput> | SaleCreateWithoutCustomerInput[] | SaleUncheckedCreateWithoutCustomerInput[]
    connectOrCreate?: SaleCreateOrConnectWithoutCustomerInput | SaleCreateOrConnectWithoutCustomerInput[]
    upsert?: SaleUpsertWithWhereUniqueWithoutCustomerInput | SaleUpsertWithWhereUniqueWithoutCustomerInput[]
    createMany?: SaleCreateManyCustomerInputEnvelope
    set?: SaleWhereUniqueInput | SaleWhereUniqueInput[]
    disconnect?: SaleWhereUniqueInput | SaleWhereUniqueInput[]
    delete?: SaleWhereUniqueInput | SaleWhereUniqueInput[]
    connect?: SaleWhereUniqueInput | SaleWhereUniqueInput[]
    update?: SaleUpdateWithWhereUniqueWithoutCustomerInput | SaleUpdateWithWhereUniqueWithoutCustomerInput[]
    updateMany?: SaleUpdateManyWithWhereWithoutCustomerInput | SaleUpdateManyWithWhereWithoutCustomerInput[]
    deleteMany?: SaleScalarWhereInput | SaleScalarWhereInput[]
  }

  export type RepairUpdateManyWithoutCustomerNestedInput = {
    create?: XOR<RepairCreateWithoutCustomerInput, RepairUncheckedCreateWithoutCustomerInput> | RepairCreateWithoutCustomerInput[] | RepairUncheckedCreateWithoutCustomerInput[]
    connectOrCreate?: RepairCreateOrConnectWithoutCustomerInput | RepairCreateOrConnectWithoutCustomerInput[]
    upsert?: RepairUpsertWithWhereUniqueWithoutCustomerInput | RepairUpsertWithWhereUniqueWithoutCustomerInput[]
    createMany?: RepairCreateManyCustomerInputEnvelope
    set?: RepairWhereUniqueInput | RepairWhereUniqueInput[]
    disconnect?: RepairWhereUniqueInput | RepairWhereUniqueInput[]
    delete?: RepairWhereUniqueInput | RepairWhereUniqueInput[]
    connect?: RepairWhereUniqueInput | RepairWhereUniqueInput[]
    update?: RepairUpdateWithWhereUniqueWithoutCustomerInput | RepairUpdateWithWhereUniqueWithoutCustomerInput[]
    updateMany?: RepairUpdateManyWithWhereWithoutCustomerInput | RepairUpdateManyWithWhereWithoutCustomerInput[]
    deleteMany?: RepairScalarWhereInput | RepairScalarWhereInput[]
  }

  export type CustomerLedgerUpdateManyWithoutCustomerNestedInput = {
    create?: XOR<CustomerLedgerCreateWithoutCustomerInput, CustomerLedgerUncheckedCreateWithoutCustomerInput> | CustomerLedgerCreateWithoutCustomerInput[] | CustomerLedgerUncheckedCreateWithoutCustomerInput[]
    connectOrCreate?: CustomerLedgerCreateOrConnectWithoutCustomerInput | CustomerLedgerCreateOrConnectWithoutCustomerInput[]
    upsert?: CustomerLedgerUpsertWithWhereUniqueWithoutCustomerInput | CustomerLedgerUpsertWithWhereUniqueWithoutCustomerInput[]
    createMany?: CustomerLedgerCreateManyCustomerInputEnvelope
    set?: CustomerLedgerWhereUniqueInput | CustomerLedgerWhereUniqueInput[]
    disconnect?: CustomerLedgerWhereUniqueInput | CustomerLedgerWhereUniqueInput[]
    delete?: CustomerLedgerWhereUniqueInput | CustomerLedgerWhereUniqueInput[]
    connect?: CustomerLedgerWhereUniqueInput | CustomerLedgerWhereUniqueInput[]
    update?: CustomerLedgerUpdateWithWhereUniqueWithoutCustomerInput | CustomerLedgerUpdateWithWhereUniqueWithoutCustomerInput[]
    updateMany?: CustomerLedgerUpdateManyWithWhereWithoutCustomerInput | CustomerLedgerUpdateManyWithWhereWithoutCustomerInput[]
    deleteMany?: CustomerLedgerScalarWhereInput | CustomerLedgerScalarWhereInput[]
  }

  export type UrdPurchaseUpdateManyWithoutCustomerNestedInput = {
    create?: XOR<UrdPurchaseCreateWithoutCustomerInput, UrdPurchaseUncheckedCreateWithoutCustomerInput> | UrdPurchaseCreateWithoutCustomerInput[] | UrdPurchaseUncheckedCreateWithoutCustomerInput[]
    connectOrCreate?: UrdPurchaseCreateOrConnectWithoutCustomerInput | UrdPurchaseCreateOrConnectWithoutCustomerInput[]
    upsert?: UrdPurchaseUpsertWithWhereUniqueWithoutCustomerInput | UrdPurchaseUpsertWithWhereUniqueWithoutCustomerInput[]
    createMany?: UrdPurchaseCreateManyCustomerInputEnvelope
    set?: UrdPurchaseWhereUniqueInput | UrdPurchaseWhereUniqueInput[]
    disconnect?: UrdPurchaseWhereUniqueInput | UrdPurchaseWhereUniqueInput[]
    delete?: UrdPurchaseWhereUniqueInput | UrdPurchaseWhereUniqueInput[]
    connect?: UrdPurchaseWhereUniqueInput | UrdPurchaseWhereUniqueInput[]
    update?: UrdPurchaseUpdateWithWhereUniqueWithoutCustomerInput | UrdPurchaseUpdateWithWhereUniqueWithoutCustomerInput[]
    updateMany?: UrdPurchaseUpdateManyWithWhereWithoutCustomerInput | UrdPurchaseUpdateManyWithWhereWithoutCustomerInput[]
    deleteMany?: UrdPurchaseScalarWhereInput | UrdPurchaseScalarWhereInput[]
  }

  export type CashbookEntryUpdateManyWithoutCustomerNestedInput = {
    create?: XOR<CashbookEntryCreateWithoutCustomerInput, CashbookEntryUncheckedCreateWithoutCustomerInput> | CashbookEntryCreateWithoutCustomerInput[] | CashbookEntryUncheckedCreateWithoutCustomerInput[]
    connectOrCreate?: CashbookEntryCreateOrConnectWithoutCustomerInput | CashbookEntryCreateOrConnectWithoutCustomerInput[]
    upsert?: CashbookEntryUpsertWithWhereUniqueWithoutCustomerInput | CashbookEntryUpsertWithWhereUniqueWithoutCustomerInput[]
    createMany?: CashbookEntryCreateManyCustomerInputEnvelope
    set?: CashbookEntryWhereUniqueInput | CashbookEntryWhereUniqueInput[]
    disconnect?: CashbookEntryWhereUniqueInput | CashbookEntryWhereUniqueInput[]
    delete?: CashbookEntryWhereUniqueInput | CashbookEntryWhereUniqueInput[]
    connect?: CashbookEntryWhereUniqueInput | CashbookEntryWhereUniqueInput[]
    update?: CashbookEntryUpdateWithWhereUniqueWithoutCustomerInput | CashbookEntryUpdateWithWhereUniqueWithoutCustomerInput[]
    updateMany?: CashbookEntryUpdateManyWithWhereWithoutCustomerInput | CashbookEntryUpdateManyWithWhereWithoutCustomerInput[]
    deleteMany?: CashbookEntryScalarWhereInput | CashbookEntryScalarWhereInput[]
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type SaleUncheckedUpdateManyWithoutCustomerNestedInput = {
    create?: XOR<SaleCreateWithoutCustomerInput, SaleUncheckedCreateWithoutCustomerInput> | SaleCreateWithoutCustomerInput[] | SaleUncheckedCreateWithoutCustomerInput[]
    connectOrCreate?: SaleCreateOrConnectWithoutCustomerInput | SaleCreateOrConnectWithoutCustomerInput[]
    upsert?: SaleUpsertWithWhereUniqueWithoutCustomerInput | SaleUpsertWithWhereUniqueWithoutCustomerInput[]
    createMany?: SaleCreateManyCustomerInputEnvelope
    set?: SaleWhereUniqueInput | SaleWhereUniqueInput[]
    disconnect?: SaleWhereUniqueInput | SaleWhereUniqueInput[]
    delete?: SaleWhereUniqueInput | SaleWhereUniqueInput[]
    connect?: SaleWhereUniqueInput | SaleWhereUniqueInput[]
    update?: SaleUpdateWithWhereUniqueWithoutCustomerInput | SaleUpdateWithWhereUniqueWithoutCustomerInput[]
    updateMany?: SaleUpdateManyWithWhereWithoutCustomerInput | SaleUpdateManyWithWhereWithoutCustomerInput[]
    deleteMany?: SaleScalarWhereInput | SaleScalarWhereInput[]
  }

  export type RepairUncheckedUpdateManyWithoutCustomerNestedInput = {
    create?: XOR<RepairCreateWithoutCustomerInput, RepairUncheckedCreateWithoutCustomerInput> | RepairCreateWithoutCustomerInput[] | RepairUncheckedCreateWithoutCustomerInput[]
    connectOrCreate?: RepairCreateOrConnectWithoutCustomerInput | RepairCreateOrConnectWithoutCustomerInput[]
    upsert?: RepairUpsertWithWhereUniqueWithoutCustomerInput | RepairUpsertWithWhereUniqueWithoutCustomerInput[]
    createMany?: RepairCreateManyCustomerInputEnvelope
    set?: RepairWhereUniqueInput | RepairWhereUniqueInput[]
    disconnect?: RepairWhereUniqueInput | RepairWhereUniqueInput[]
    delete?: RepairWhereUniqueInput | RepairWhereUniqueInput[]
    connect?: RepairWhereUniqueInput | RepairWhereUniqueInput[]
    update?: RepairUpdateWithWhereUniqueWithoutCustomerInput | RepairUpdateWithWhereUniqueWithoutCustomerInput[]
    updateMany?: RepairUpdateManyWithWhereWithoutCustomerInput | RepairUpdateManyWithWhereWithoutCustomerInput[]
    deleteMany?: RepairScalarWhereInput | RepairScalarWhereInput[]
  }

  export type CustomerLedgerUncheckedUpdateManyWithoutCustomerNestedInput = {
    create?: XOR<CustomerLedgerCreateWithoutCustomerInput, CustomerLedgerUncheckedCreateWithoutCustomerInput> | CustomerLedgerCreateWithoutCustomerInput[] | CustomerLedgerUncheckedCreateWithoutCustomerInput[]
    connectOrCreate?: CustomerLedgerCreateOrConnectWithoutCustomerInput | CustomerLedgerCreateOrConnectWithoutCustomerInput[]
    upsert?: CustomerLedgerUpsertWithWhereUniqueWithoutCustomerInput | CustomerLedgerUpsertWithWhereUniqueWithoutCustomerInput[]
    createMany?: CustomerLedgerCreateManyCustomerInputEnvelope
    set?: CustomerLedgerWhereUniqueInput | CustomerLedgerWhereUniqueInput[]
    disconnect?: CustomerLedgerWhereUniqueInput | CustomerLedgerWhereUniqueInput[]
    delete?: CustomerLedgerWhereUniqueInput | CustomerLedgerWhereUniqueInput[]
    connect?: CustomerLedgerWhereUniqueInput | CustomerLedgerWhereUniqueInput[]
    update?: CustomerLedgerUpdateWithWhereUniqueWithoutCustomerInput | CustomerLedgerUpdateWithWhereUniqueWithoutCustomerInput[]
    updateMany?: CustomerLedgerUpdateManyWithWhereWithoutCustomerInput | CustomerLedgerUpdateManyWithWhereWithoutCustomerInput[]
    deleteMany?: CustomerLedgerScalarWhereInput | CustomerLedgerScalarWhereInput[]
  }

  export type UrdPurchaseUncheckedUpdateManyWithoutCustomerNestedInput = {
    create?: XOR<UrdPurchaseCreateWithoutCustomerInput, UrdPurchaseUncheckedCreateWithoutCustomerInput> | UrdPurchaseCreateWithoutCustomerInput[] | UrdPurchaseUncheckedCreateWithoutCustomerInput[]
    connectOrCreate?: UrdPurchaseCreateOrConnectWithoutCustomerInput | UrdPurchaseCreateOrConnectWithoutCustomerInput[]
    upsert?: UrdPurchaseUpsertWithWhereUniqueWithoutCustomerInput | UrdPurchaseUpsertWithWhereUniqueWithoutCustomerInput[]
    createMany?: UrdPurchaseCreateManyCustomerInputEnvelope
    set?: UrdPurchaseWhereUniqueInput | UrdPurchaseWhereUniqueInput[]
    disconnect?: UrdPurchaseWhereUniqueInput | UrdPurchaseWhereUniqueInput[]
    delete?: UrdPurchaseWhereUniqueInput | UrdPurchaseWhereUniqueInput[]
    connect?: UrdPurchaseWhereUniqueInput | UrdPurchaseWhereUniqueInput[]
    update?: UrdPurchaseUpdateWithWhereUniqueWithoutCustomerInput | UrdPurchaseUpdateWithWhereUniqueWithoutCustomerInput[]
    updateMany?: UrdPurchaseUpdateManyWithWhereWithoutCustomerInput | UrdPurchaseUpdateManyWithWhereWithoutCustomerInput[]
    deleteMany?: UrdPurchaseScalarWhereInput | UrdPurchaseScalarWhereInput[]
  }

  export type CashbookEntryUncheckedUpdateManyWithoutCustomerNestedInput = {
    create?: XOR<CashbookEntryCreateWithoutCustomerInput, CashbookEntryUncheckedCreateWithoutCustomerInput> | CashbookEntryCreateWithoutCustomerInput[] | CashbookEntryUncheckedCreateWithoutCustomerInput[]
    connectOrCreate?: CashbookEntryCreateOrConnectWithoutCustomerInput | CashbookEntryCreateOrConnectWithoutCustomerInput[]
    upsert?: CashbookEntryUpsertWithWhereUniqueWithoutCustomerInput | CashbookEntryUpsertWithWhereUniqueWithoutCustomerInput[]
    createMany?: CashbookEntryCreateManyCustomerInputEnvelope
    set?: CashbookEntryWhereUniqueInput | CashbookEntryWhereUniqueInput[]
    disconnect?: CashbookEntryWhereUniqueInput | CashbookEntryWhereUniqueInput[]
    delete?: CashbookEntryWhereUniqueInput | CashbookEntryWhereUniqueInput[]
    connect?: CashbookEntryWhereUniqueInput | CashbookEntryWhereUniqueInput[]
    update?: CashbookEntryUpdateWithWhereUniqueWithoutCustomerInput | CashbookEntryUpdateWithWhereUniqueWithoutCustomerInput[]
    updateMany?: CashbookEntryUpdateManyWithWhereWithoutCustomerInput | CashbookEntryUpdateManyWithWhereWithoutCustomerInput[]
    deleteMany?: CashbookEntryScalarWhereInput | CashbookEntryScalarWhereInput[]
  }

  export type PurchaseCreateNestedManyWithoutSupplierInput = {
    create?: XOR<PurchaseCreateWithoutSupplierInput, PurchaseUncheckedCreateWithoutSupplierInput> | PurchaseCreateWithoutSupplierInput[] | PurchaseUncheckedCreateWithoutSupplierInput[]
    connectOrCreate?: PurchaseCreateOrConnectWithoutSupplierInput | PurchaseCreateOrConnectWithoutSupplierInput[]
    createMany?: PurchaseCreateManySupplierInputEnvelope
    connect?: PurchaseWhereUniqueInput | PurchaseWhereUniqueInput[]
  }

  export type PurchaseUncheckedCreateNestedManyWithoutSupplierInput = {
    create?: XOR<PurchaseCreateWithoutSupplierInput, PurchaseUncheckedCreateWithoutSupplierInput> | PurchaseCreateWithoutSupplierInput[] | PurchaseUncheckedCreateWithoutSupplierInput[]
    connectOrCreate?: PurchaseCreateOrConnectWithoutSupplierInput | PurchaseCreateOrConnectWithoutSupplierInput[]
    createMany?: PurchaseCreateManySupplierInputEnvelope
    connect?: PurchaseWhereUniqueInput | PurchaseWhereUniqueInput[]
  }

  export type PurchaseUpdateManyWithoutSupplierNestedInput = {
    create?: XOR<PurchaseCreateWithoutSupplierInput, PurchaseUncheckedCreateWithoutSupplierInput> | PurchaseCreateWithoutSupplierInput[] | PurchaseUncheckedCreateWithoutSupplierInput[]
    connectOrCreate?: PurchaseCreateOrConnectWithoutSupplierInput | PurchaseCreateOrConnectWithoutSupplierInput[]
    upsert?: PurchaseUpsertWithWhereUniqueWithoutSupplierInput | PurchaseUpsertWithWhereUniqueWithoutSupplierInput[]
    createMany?: PurchaseCreateManySupplierInputEnvelope
    set?: PurchaseWhereUniqueInput | PurchaseWhereUniqueInput[]
    disconnect?: PurchaseWhereUniqueInput | PurchaseWhereUniqueInput[]
    delete?: PurchaseWhereUniqueInput | PurchaseWhereUniqueInput[]
    connect?: PurchaseWhereUniqueInput | PurchaseWhereUniqueInput[]
    update?: PurchaseUpdateWithWhereUniqueWithoutSupplierInput | PurchaseUpdateWithWhereUniqueWithoutSupplierInput[]
    updateMany?: PurchaseUpdateManyWithWhereWithoutSupplierInput | PurchaseUpdateManyWithWhereWithoutSupplierInput[]
    deleteMany?: PurchaseScalarWhereInput | PurchaseScalarWhereInput[]
  }

  export type PurchaseUncheckedUpdateManyWithoutSupplierNestedInput = {
    create?: XOR<PurchaseCreateWithoutSupplierInput, PurchaseUncheckedCreateWithoutSupplierInput> | PurchaseCreateWithoutSupplierInput[] | PurchaseUncheckedCreateWithoutSupplierInput[]
    connectOrCreate?: PurchaseCreateOrConnectWithoutSupplierInput | PurchaseCreateOrConnectWithoutSupplierInput[]
    upsert?: PurchaseUpsertWithWhereUniqueWithoutSupplierInput | PurchaseUpsertWithWhereUniqueWithoutSupplierInput[]
    createMany?: PurchaseCreateManySupplierInputEnvelope
    set?: PurchaseWhereUniqueInput | PurchaseWhereUniqueInput[]
    disconnect?: PurchaseWhereUniqueInput | PurchaseWhereUniqueInput[]
    delete?: PurchaseWhereUniqueInput | PurchaseWhereUniqueInput[]
    connect?: PurchaseWhereUniqueInput | PurchaseWhereUniqueInput[]
    update?: PurchaseUpdateWithWhereUniqueWithoutSupplierInput | PurchaseUpdateWithWhereUniqueWithoutSupplierInput[]
    updateMany?: PurchaseUpdateManyWithWhereWithoutSupplierInput | PurchaseUpdateManyWithWhereWithoutSupplierInput[]
    deleteMany?: PurchaseScalarWhereInput | PurchaseScalarWhereInput[]
  }

  export type SaleItemCreateNestedManyWithoutProductInput = {
    create?: XOR<SaleItemCreateWithoutProductInput, SaleItemUncheckedCreateWithoutProductInput> | SaleItemCreateWithoutProductInput[] | SaleItemUncheckedCreateWithoutProductInput[]
    connectOrCreate?: SaleItemCreateOrConnectWithoutProductInput | SaleItemCreateOrConnectWithoutProductInput[]
    createMany?: SaleItemCreateManyProductInputEnvelope
    connect?: SaleItemWhereUniqueInput | SaleItemWhereUniqueInput[]
  }

  export type PurchaseItemCreateNestedManyWithoutProductInput = {
    create?: XOR<PurchaseItemCreateWithoutProductInput, PurchaseItemUncheckedCreateWithoutProductInput> | PurchaseItemCreateWithoutProductInput[] | PurchaseItemUncheckedCreateWithoutProductInput[]
    connectOrCreate?: PurchaseItemCreateOrConnectWithoutProductInput | PurchaseItemCreateOrConnectWithoutProductInput[]
    createMany?: PurchaseItemCreateManyProductInputEnvelope
    connect?: PurchaseItemWhereUniqueInput | PurchaseItemWhereUniqueInput[]
  }

  export type StockMovementCreateNestedManyWithoutProductInput = {
    create?: XOR<StockMovementCreateWithoutProductInput, StockMovementUncheckedCreateWithoutProductInput> | StockMovementCreateWithoutProductInput[] | StockMovementUncheckedCreateWithoutProductInput[]
    connectOrCreate?: StockMovementCreateOrConnectWithoutProductInput | StockMovementCreateOrConnectWithoutProductInput[]
    createMany?: StockMovementCreateManyProductInputEnvelope
    connect?: StockMovementWhereUniqueInput | StockMovementWhereUniqueInput[]
  }

  export type SaleItemUncheckedCreateNestedManyWithoutProductInput = {
    create?: XOR<SaleItemCreateWithoutProductInput, SaleItemUncheckedCreateWithoutProductInput> | SaleItemCreateWithoutProductInput[] | SaleItemUncheckedCreateWithoutProductInput[]
    connectOrCreate?: SaleItemCreateOrConnectWithoutProductInput | SaleItemCreateOrConnectWithoutProductInput[]
    createMany?: SaleItemCreateManyProductInputEnvelope
    connect?: SaleItemWhereUniqueInput | SaleItemWhereUniqueInput[]
  }

  export type PurchaseItemUncheckedCreateNestedManyWithoutProductInput = {
    create?: XOR<PurchaseItemCreateWithoutProductInput, PurchaseItemUncheckedCreateWithoutProductInput> | PurchaseItemCreateWithoutProductInput[] | PurchaseItemUncheckedCreateWithoutProductInput[]
    connectOrCreate?: PurchaseItemCreateOrConnectWithoutProductInput | PurchaseItemCreateOrConnectWithoutProductInput[]
    createMany?: PurchaseItemCreateManyProductInputEnvelope
    connect?: PurchaseItemWhereUniqueInput | PurchaseItemWhereUniqueInput[]
  }

  export type StockMovementUncheckedCreateNestedManyWithoutProductInput = {
    create?: XOR<StockMovementCreateWithoutProductInput, StockMovementUncheckedCreateWithoutProductInput> | StockMovementCreateWithoutProductInput[] | StockMovementUncheckedCreateWithoutProductInput[]
    connectOrCreate?: StockMovementCreateOrConnectWithoutProductInput | StockMovementCreateOrConnectWithoutProductInput[]
    createMany?: StockMovementCreateManyProductInputEnvelope
    connect?: StockMovementWhereUniqueInput | StockMovementWhereUniqueInput[]
  }

  export type EnumMetalTypeFieldUpdateOperationsInput = {
    set?: $Enums.MetalType
  }

  export type DecimalFieldUpdateOperationsInput = {
    set?: Decimal | DecimalJsLike | number | string
    increment?: Decimal | DecimalJsLike | number | string
    decrement?: Decimal | DecimalJsLike | number | string
    multiply?: Decimal | DecimalJsLike | number | string
    divide?: Decimal | DecimalJsLike | number | string
  }

  export type EnumMakingChargeTypeFieldUpdateOperationsInput = {
    set?: $Enums.MakingChargeType
  }

  export type EnumProductStatusFieldUpdateOperationsInput = {
    set?: $Enums.ProductStatus
  }

  export type SaleItemUpdateManyWithoutProductNestedInput = {
    create?: XOR<SaleItemCreateWithoutProductInput, SaleItemUncheckedCreateWithoutProductInput> | SaleItemCreateWithoutProductInput[] | SaleItemUncheckedCreateWithoutProductInput[]
    connectOrCreate?: SaleItemCreateOrConnectWithoutProductInput | SaleItemCreateOrConnectWithoutProductInput[]
    upsert?: SaleItemUpsertWithWhereUniqueWithoutProductInput | SaleItemUpsertWithWhereUniqueWithoutProductInput[]
    createMany?: SaleItemCreateManyProductInputEnvelope
    set?: SaleItemWhereUniqueInput | SaleItemWhereUniqueInput[]
    disconnect?: SaleItemWhereUniqueInput | SaleItemWhereUniqueInput[]
    delete?: SaleItemWhereUniqueInput | SaleItemWhereUniqueInput[]
    connect?: SaleItemWhereUniqueInput | SaleItemWhereUniqueInput[]
    update?: SaleItemUpdateWithWhereUniqueWithoutProductInput | SaleItemUpdateWithWhereUniqueWithoutProductInput[]
    updateMany?: SaleItemUpdateManyWithWhereWithoutProductInput | SaleItemUpdateManyWithWhereWithoutProductInput[]
    deleteMany?: SaleItemScalarWhereInput | SaleItemScalarWhereInput[]
  }

  export type PurchaseItemUpdateManyWithoutProductNestedInput = {
    create?: XOR<PurchaseItemCreateWithoutProductInput, PurchaseItemUncheckedCreateWithoutProductInput> | PurchaseItemCreateWithoutProductInput[] | PurchaseItemUncheckedCreateWithoutProductInput[]
    connectOrCreate?: PurchaseItemCreateOrConnectWithoutProductInput | PurchaseItemCreateOrConnectWithoutProductInput[]
    upsert?: PurchaseItemUpsertWithWhereUniqueWithoutProductInput | PurchaseItemUpsertWithWhereUniqueWithoutProductInput[]
    createMany?: PurchaseItemCreateManyProductInputEnvelope
    set?: PurchaseItemWhereUniqueInput | PurchaseItemWhereUniqueInput[]
    disconnect?: PurchaseItemWhereUniqueInput | PurchaseItemWhereUniqueInput[]
    delete?: PurchaseItemWhereUniqueInput | PurchaseItemWhereUniqueInput[]
    connect?: PurchaseItemWhereUniqueInput | PurchaseItemWhereUniqueInput[]
    update?: PurchaseItemUpdateWithWhereUniqueWithoutProductInput | PurchaseItemUpdateWithWhereUniqueWithoutProductInput[]
    updateMany?: PurchaseItemUpdateManyWithWhereWithoutProductInput | PurchaseItemUpdateManyWithWhereWithoutProductInput[]
    deleteMany?: PurchaseItemScalarWhereInput | PurchaseItemScalarWhereInput[]
  }

  export type StockMovementUpdateManyWithoutProductNestedInput = {
    create?: XOR<StockMovementCreateWithoutProductInput, StockMovementUncheckedCreateWithoutProductInput> | StockMovementCreateWithoutProductInput[] | StockMovementUncheckedCreateWithoutProductInput[]
    connectOrCreate?: StockMovementCreateOrConnectWithoutProductInput | StockMovementCreateOrConnectWithoutProductInput[]
    upsert?: StockMovementUpsertWithWhereUniqueWithoutProductInput | StockMovementUpsertWithWhereUniqueWithoutProductInput[]
    createMany?: StockMovementCreateManyProductInputEnvelope
    set?: StockMovementWhereUniqueInput | StockMovementWhereUniqueInput[]
    disconnect?: StockMovementWhereUniqueInput | StockMovementWhereUniqueInput[]
    delete?: StockMovementWhereUniqueInput | StockMovementWhereUniqueInput[]
    connect?: StockMovementWhereUniqueInput | StockMovementWhereUniqueInput[]
    update?: StockMovementUpdateWithWhereUniqueWithoutProductInput | StockMovementUpdateWithWhereUniqueWithoutProductInput[]
    updateMany?: StockMovementUpdateManyWithWhereWithoutProductInput | StockMovementUpdateManyWithWhereWithoutProductInput[]
    deleteMany?: StockMovementScalarWhereInput | StockMovementScalarWhereInput[]
  }

  export type SaleItemUncheckedUpdateManyWithoutProductNestedInput = {
    create?: XOR<SaleItemCreateWithoutProductInput, SaleItemUncheckedCreateWithoutProductInput> | SaleItemCreateWithoutProductInput[] | SaleItemUncheckedCreateWithoutProductInput[]
    connectOrCreate?: SaleItemCreateOrConnectWithoutProductInput | SaleItemCreateOrConnectWithoutProductInput[]
    upsert?: SaleItemUpsertWithWhereUniqueWithoutProductInput | SaleItemUpsertWithWhereUniqueWithoutProductInput[]
    createMany?: SaleItemCreateManyProductInputEnvelope
    set?: SaleItemWhereUniqueInput | SaleItemWhereUniqueInput[]
    disconnect?: SaleItemWhereUniqueInput | SaleItemWhereUniqueInput[]
    delete?: SaleItemWhereUniqueInput | SaleItemWhereUniqueInput[]
    connect?: SaleItemWhereUniqueInput | SaleItemWhereUniqueInput[]
    update?: SaleItemUpdateWithWhereUniqueWithoutProductInput | SaleItemUpdateWithWhereUniqueWithoutProductInput[]
    updateMany?: SaleItemUpdateManyWithWhereWithoutProductInput | SaleItemUpdateManyWithWhereWithoutProductInput[]
    deleteMany?: SaleItemScalarWhereInput | SaleItemScalarWhereInput[]
  }

  export type PurchaseItemUncheckedUpdateManyWithoutProductNestedInput = {
    create?: XOR<PurchaseItemCreateWithoutProductInput, PurchaseItemUncheckedCreateWithoutProductInput> | PurchaseItemCreateWithoutProductInput[] | PurchaseItemUncheckedCreateWithoutProductInput[]
    connectOrCreate?: PurchaseItemCreateOrConnectWithoutProductInput | PurchaseItemCreateOrConnectWithoutProductInput[]
    upsert?: PurchaseItemUpsertWithWhereUniqueWithoutProductInput | PurchaseItemUpsertWithWhereUniqueWithoutProductInput[]
    createMany?: PurchaseItemCreateManyProductInputEnvelope
    set?: PurchaseItemWhereUniqueInput | PurchaseItemWhereUniqueInput[]
    disconnect?: PurchaseItemWhereUniqueInput | PurchaseItemWhereUniqueInput[]
    delete?: PurchaseItemWhereUniqueInput | PurchaseItemWhereUniqueInput[]
    connect?: PurchaseItemWhereUniqueInput | PurchaseItemWhereUniqueInput[]
    update?: PurchaseItemUpdateWithWhereUniqueWithoutProductInput | PurchaseItemUpdateWithWhereUniqueWithoutProductInput[]
    updateMany?: PurchaseItemUpdateManyWithWhereWithoutProductInput | PurchaseItemUpdateManyWithWhereWithoutProductInput[]
    deleteMany?: PurchaseItemScalarWhereInput | PurchaseItemScalarWhereInput[]
  }

  export type StockMovementUncheckedUpdateManyWithoutProductNestedInput = {
    create?: XOR<StockMovementCreateWithoutProductInput, StockMovementUncheckedCreateWithoutProductInput> | StockMovementCreateWithoutProductInput[] | StockMovementUncheckedCreateWithoutProductInput[]
    connectOrCreate?: StockMovementCreateOrConnectWithoutProductInput | StockMovementCreateOrConnectWithoutProductInput[]
    upsert?: StockMovementUpsertWithWhereUniqueWithoutProductInput | StockMovementUpsertWithWhereUniqueWithoutProductInput[]
    createMany?: StockMovementCreateManyProductInputEnvelope
    set?: StockMovementWhereUniqueInput | StockMovementWhereUniqueInput[]
    disconnect?: StockMovementWhereUniqueInput | StockMovementWhereUniqueInput[]
    delete?: StockMovementWhereUniqueInput | StockMovementWhereUniqueInput[]
    connect?: StockMovementWhereUniqueInput | StockMovementWhereUniqueInput[]
    update?: StockMovementUpdateWithWhereUniqueWithoutProductInput | StockMovementUpdateWithWhereUniqueWithoutProductInput[]
    updateMany?: StockMovementUpdateManyWithWhereWithoutProductInput | StockMovementUpdateManyWithWhereWithoutProductInput[]
    deleteMany?: StockMovementScalarWhereInput | StockMovementScalarWhereInput[]
  }

  export type ProductCreateNestedOneWithoutMovementsInput = {
    create?: XOR<ProductCreateWithoutMovementsInput, ProductUncheckedCreateWithoutMovementsInput>
    connectOrCreate?: ProductCreateOrConnectWithoutMovementsInput
    connect?: ProductWhereUniqueInput
  }

  export type EnumMovementTypeFieldUpdateOperationsInput = {
    set?: $Enums.MovementType
  }

  export type ProductUpdateOneRequiredWithoutMovementsNestedInput = {
    create?: XOR<ProductCreateWithoutMovementsInput, ProductUncheckedCreateWithoutMovementsInput>
    connectOrCreate?: ProductCreateOrConnectWithoutMovementsInput
    upsert?: ProductUpsertWithoutMovementsInput
    connect?: ProductWhereUniqueInput
    update?: XOR<XOR<ProductUpdateToOneWithWhereWithoutMovementsInput, ProductUpdateWithoutMovementsInput>, ProductUncheckedUpdateWithoutMovementsInput>
  }

  export type SupplierCreateNestedOneWithoutPurchasesInput = {
    create?: XOR<SupplierCreateWithoutPurchasesInput, SupplierUncheckedCreateWithoutPurchasesInput>
    connectOrCreate?: SupplierCreateOrConnectWithoutPurchasesInput
    connect?: SupplierWhereUniqueInput
  }

  export type PurchaseItemCreateNestedManyWithoutPurchaseInput = {
    create?: XOR<PurchaseItemCreateWithoutPurchaseInput, PurchaseItemUncheckedCreateWithoutPurchaseInput> | PurchaseItemCreateWithoutPurchaseInput[] | PurchaseItemUncheckedCreateWithoutPurchaseInput[]
    connectOrCreate?: PurchaseItemCreateOrConnectWithoutPurchaseInput | PurchaseItemCreateOrConnectWithoutPurchaseInput[]
    createMany?: PurchaseItemCreateManyPurchaseInputEnvelope
    connect?: PurchaseItemWhereUniqueInput | PurchaseItemWhereUniqueInput[]
  }

  export type PurchaseItemUncheckedCreateNestedManyWithoutPurchaseInput = {
    create?: XOR<PurchaseItemCreateWithoutPurchaseInput, PurchaseItemUncheckedCreateWithoutPurchaseInput> | PurchaseItemCreateWithoutPurchaseInput[] | PurchaseItemUncheckedCreateWithoutPurchaseInput[]
    connectOrCreate?: PurchaseItemCreateOrConnectWithoutPurchaseInput | PurchaseItemCreateOrConnectWithoutPurchaseInput[]
    createMany?: PurchaseItemCreateManyPurchaseInputEnvelope
    connect?: PurchaseItemWhereUniqueInput | PurchaseItemWhereUniqueInput[]
  }

  export type EnumPaymentMethodFieldUpdateOperationsInput = {
    set?: $Enums.PaymentMethod
  }

  export type SupplierUpdateOneWithoutPurchasesNestedInput = {
    create?: XOR<SupplierCreateWithoutPurchasesInput, SupplierUncheckedCreateWithoutPurchasesInput>
    connectOrCreate?: SupplierCreateOrConnectWithoutPurchasesInput
    upsert?: SupplierUpsertWithoutPurchasesInput
    disconnect?: SupplierWhereInput | boolean
    delete?: SupplierWhereInput | boolean
    connect?: SupplierWhereUniqueInput
    update?: XOR<XOR<SupplierUpdateToOneWithWhereWithoutPurchasesInput, SupplierUpdateWithoutPurchasesInput>, SupplierUncheckedUpdateWithoutPurchasesInput>
  }

  export type PurchaseItemUpdateManyWithoutPurchaseNestedInput = {
    create?: XOR<PurchaseItemCreateWithoutPurchaseInput, PurchaseItemUncheckedCreateWithoutPurchaseInput> | PurchaseItemCreateWithoutPurchaseInput[] | PurchaseItemUncheckedCreateWithoutPurchaseInput[]
    connectOrCreate?: PurchaseItemCreateOrConnectWithoutPurchaseInput | PurchaseItemCreateOrConnectWithoutPurchaseInput[]
    upsert?: PurchaseItemUpsertWithWhereUniqueWithoutPurchaseInput | PurchaseItemUpsertWithWhereUniqueWithoutPurchaseInput[]
    createMany?: PurchaseItemCreateManyPurchaseInputEnvelope
    set?: PurchaseItemWhereUniqueInput | PurchaseItemWhereUniqueInput[]
    disconnect?: PurchaseItemWhereUniqueInput | PurchaseItemWhereUniqueInput[]
    delete?: PurchaseItemWhereUniqueInput | PurchaseItemWhereUniqueInput[]
    connect?: PurchaseItemWhereUniqueInput | PurchaseItemWhereUniqueInput[]
    update?: PurchaseItemUpdateWithWhereUniqueWithoutPurchaseInput | PurchaseItemUpdateWithWhereUniqueWithoutPurchaseInput[]
    updateMany?: PurchaseItemUpdateManyWithWhereWithoutPurchaseInput | PurchaseItemUpdateManyWithWhereWithoutPurchaseInput[]
    deleteMany?: PurchaseItemScalarWhereInput | PurchaseItemScalarWhereInput[]
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type PurchaseItemUncheckedUpdateManyWithoutPurchaseNestedInput = {
    create?: XOR<PurchaseItemCreateWithoutPurchaseInput, PurchaseItemUncheckedCreateWithoutPurchaseInput> | PurchaseItemCreateWithoutPurchaseInput[] | PurchaseItemUncheckedCreateWithoutPurchaseInput[]
    connectOrCreate?: PurchaseItemCreateOrConnectWithoutPurchaseInput | PurchaseItemCreateOrConnectWithoutPurchaseInput[]
    upsert?: PurchaseItemUpsertWithWhereUniqueWithoutPurchaseInput | PurchaseItemUpsertWithWhereUniqueWithoutPurchaseInput[]
    createMany?: PurchaseItemCreateManyPurchaseInputEnvelope
    set?: PurchaseItemWhereUniqueInput | PurchaseItemWhereUniqueInput[]
    disconnect?: PurchaseItemWhereUniqueInput | PurchaseItemWhereUniqueInput[]
    delete?: PurchaseItemWhereUniqueInput | PurchaseItemWhereUniqueInput[]
    connect?: PurchaseItemWhereUniqueInput | PurchaseItemWhereUniqueInput[]
    update?: PurchaseItemUpdateWithWhereUniqueWithoutPurchaseInput | PurchaseItemUpdateWithWhereUniqueWithoutPurchaseInput[]
    updateMany?: PurchaseItemUpdateManyWithWhereWithoutPurchaseInput | PurchaseItemUpdateManyWithWhereWithoutPurchaseInput[]
    deleteMany?: PurchaseItemScalarWhereInput | PurchaseItemScalarWhereInput[]
  }

  export type PurchaseCreateNestedOneWithoutItemsInput = {
    create?: XOR<PurchaseCreateWithoutItemsInput, PurchaseUncheckedCreateWithoutItemsInput>
    connectOrCreate?: PurchaseCreateOrConnectWithoutItemsInput
    connect?: PurchaseWhereUniqueInput
  }

  export type ProductCreateNestedOneWithoutPurchaseItemsInput = {
    create?: XOR<ProductCreateWithoutPurchaseItemsInput, ProductUncheckedCreateWithoutPurchaseItemsInput>
    connectOrCreate?: ProductCreateOrConnectWithoutPurchaseItemsInput
    connect?: ProductWhereUniqueInput
  }

  export type PurchaseUpdateOneRequiredWithoutItemsNestedInput = {
    create?: XOR<PurchaseCreateWithoutItemsInput, PurchaseUncheckedCreateWithoutItemsInput>
    connectOrCreate?: PurchaseCreateOrConnectWithoutItemsInput
    upsert?: PurchaseUpsertWithoutItemsInput
    connect?: PurchaseWhereUniqueInput
    update?: XOR<XOR<PurchaseUpdateToOneWithWhereWithoutItemsInput, PurchaseUpdateWithoutItemsInput>, PurchaseUncheckedUpdateWithoutItemsInput>
  }

  export type ProductUpdateOneRequiredWithoutPurchaseItemsNestedInput = {
    create?: XOR<ProductCreateWithoutPurchaseItemsInput, ProductUncheckedCreateWithoutPurchaseItemsInput>
    connectOrCreate?: ProductCreateOrConnectWithoutPurchaseItemsInput
    upsert?: ProductUpsertWithoutPurchaseItemsInput
    connect?: ProductWhereUniqueInput
    update?: XOR<XOR<ProductUpdateToOneWithWhereWithoutPurchaseItemsInput, ProductUpdateWithoutPurchaseItemsInput>, ProductUncheckedUpdateWithoutPurchaseItemsInput>
  }

  export type CustomerCreateNestedOneWithoutSalesInput = {
    create?: XOR<CustomerCreateWithoutSalesInput, CustomerUncheckedCreateWithoutSalesInput>
    connectOrCreate?: CustomerCreateOrConnectWithoutSalesInput
    connect?: CustomerWhereUniqueInput
  }

  export type SaleItemCreateNestedManyWithoutSaleInput = {
    create?: XOR<SaleItemCreateWithoutSaleInput, SaleItemUncheckedCreateWithoutSaleInput> | SaleItemCreateWithoutSaleInput[] | SaleItemUncheckedCreateWithoutSaleInput[]
    connectOrCreate?: SaleItemCreateOrConnectWithoutSaleInput | SaleItemCreateOrConnectWithoutSaleInput[]
    createMany?: SaleItemCreateManySaleInputEnvelope
    connect?: SaleItemWhereUniqueInput | SaleItemWhereUniqueInput[]
  }

  export type CustomerLedgerCreateNestedManyWithoutSaleInput = {
    create?: XOR<CustomerLedgerCreateWithoutSaleInput, CustomerLedgerUncheckedCreateWithoutSaleInput> | CustomerLedgerCreateWithoutSaleInput[] | CustomerLedgerUncheckedCreateWithoutSaleInput[]
    connectOrCreate?: CustomerLedgerCreateOrConnectWithoutSaleInput | CustomerLedgerCreateOrConnectWithoutSaleInput[]
    createMany?: CustomerLedgerCreateManySaleInputEnvelope
    connect?: CustomerLedgerWhereUniqueInput | CustomerLedgerWhereUniqueInput[]
  }

  export type UrdPurchaseCreateNestedOneWithoutSaleInput = {
    create?: XOR<UrdPurchaseCreateWithoutSaleInput, UrdPurchaseUncheckedCreateWithoutSaleInput>
    connectOrCreate?: UrdPurchaseCreateOrConnectWithoutSaleInput
    connect?: UrdPurchaseWhereUniqueInput
  }

  export type SaleItemUncheckedCreateNestedManyWithoutSaleInput = {
    create?: XOR<SaleItemCreateWithoutSaleInput, SaleItemUncheckedCreateWithoutSaleInput> | SaleItemCreateWithoutSaleInput[] | SaleItemUncheckedCreateWithoutSaleInput[]
    connectOrCreate?: SaleItemCreateOrConnectWithoutSaleInput | SaleItemCreateOrConnectWithoutSaleInput[]
    createMany?: SaleItemCreateManySaleInputEnvelope
    connect?: SaleItemWhereUniqueInput | SaleItemWhereUniqueInput[]
  }

  export type CustomerLedgerUncheckedCreateNestedManyWithoutSaleInput = {
    create?: XOR<CustomerLedgerCreateWithoutSaleInput, CustomerLedgerUncheckedCreateWithoutSaleInput> | CustomerLedgerCreateWithoutSaleInput[] | CustomerLedgerUncheckedCreateWithoutSaleInput[]
    connectOrCreate?: CustomerLedgerCreateOrConnectWithoutSaleInput | CustomerLedgerCreateOrConnectWithoutSaleInput[]
    createMany?: CustomerLedgerCreateManySaleInputEnvelope
    connect?: CustomerLedgerWhereUniqueInput | CustomerLedgerWhereUniqueInput[]
  }

  export type UrdPurchaseUncheckedCreateNestedOneWithoutSaleInput = {
    create?: XOR<UrdPurchaseCreateWithoutSaleInput, UrdPurchaseUncheckedCreateWithoutSaleInput>
    connectOrCreate?: UrdPurchaseCreateOrConnectWithoutSaleInput
    connect?: UrdPurchaseWhereUniqueInput
  }

  export type CustomerUpdateOneWithoutSalesNestedInput = {
    create?: XOR<CustomerCreateWithoutSalesInput, CustomerUncheckedCreateWithoutSalesInput>
    connectOrCreate?: CustomerCreateOrConnectWithoutSalesInput
    upsert?: CustomerUpsertWithoutSalesInput
    disconnect?: CustomerWhereInput | boolean
    delete?: CustomerWhereInput | boolean
    connect?: CustomerWhereUniqueInput
    update?: XOR<XOR<CustomerUpdateToOneWithWhereWithoutSalesInput, CustomerUpdateWithoutSalesInput>, CustomerUncheckedUpdateWithoutSalesInput>
  }

  export type SaleItemUpdateManyWithoutSaleNestedInput = {
    create?: XOR<SaleItemCreateWithoutSaleInput, SaleItemUncheckedCreateWithoutSaleInput> | SaleItemCreateWithoutSaleInput[] | SaleItemUncheckedCreateWithoutSaleInput[]
    connectOrCreate?: SaleItemCreateOrConnectWithoutSaleInput | SaleItemCreateOrConnectWithoutSaleInput[]
    upsert?: SaleItemUpsertWithWhereUniqueWithoutSaleInput | SaleItemUpsertWithWhereUniqueWithoutSaleInput[]
    createMany?: SaleItemCreateManySaleInputEnvelope
    set?: SaleItemWhereUniqueInput | SaleItemWhereUniqueInput[]
    disconnect?: SaleItemWhereUniqueInput | SaleItemWhereUniqueInput[]
    delete?: SaleItemWhereUniqueInput | SaleItemWhereUniqueInput[]
    connect?: SaleItemWhereUniqueInput | SaleItemWhereUniqueInput[]
    update?: SaleItemUpdateWithWhereUniqueWithoutSaleInput | SaleItemUpdateWithWhereUniqueWithoutSaleInput[]
    updateMany?: SaleItemUpdateManyWithWhereWithoutSaleInput | SaleItemUpdateManyWithWhereWithoutSaleInput[]
    deleteMany?: SaleItemScalarWhereInput | SaleItemScalarWhereInput[]
  }

  export type CustomerLedgerUpdateManyWithoutSaleNestedInput = {
    create?: XOR<CustomerLedgerCreateWithoutSaleInput, CustomerLedgerUncheckedCreateWithoutSaleInput> | CustomerLedgerCreateWithoutSaleInput[] | CustomerLedgerUncheckedCreateWithoutSaleInput[]
    connectOrCreate?: CustomerLedgerCreateOrConnectWithoutSaleInput | CustomerLedgerCreateOrConnectWithoutSaleInput[]
    upsert?: CustomerLedgerUpsertWithWhereUniqueWithoutSaleInput | CustomerLedgerUpsertWithWhereUniqueWithoutSaleInput[]
    createMany?: CustomerLedgerCreateManySaleInputEnvelope
    set?: CustomerLedgerWhereUniqueInput | CustomerLedgerWhereUniqueInput[]
    disconnect?: CustomerLedgerWhereUniqueInput | CustomerLedgerWhereUniqueInput[]
    delete?: CustomerLedgerWhereUniqueInput | CustomerLedgerWhereUniqueInput[]
    connect?: CustomerLedgerWhereUniqueInput | CustomerLedgerWhereUniqueInput[]
    update?: CustomerLedgerUpdateWithWhereUniqueWithoutSaleInput | CustomerLedgerUpdateWithWhereUniqueWithoutSaleInput[]
    updateMany?: CustomerLedgerUpdateManyWithWhereWithoutSaleInput | CustomerLedgerUpdateManyWithWhereWithoutSaleInput[]
    deleteMany?: CustomerLedgerScalarWhereInput | CustomerLedgerScalarWhereInput[]
  }

  export type UrdPurchaseUpdateOneWithoutSaleNestedInput = {
    create?: XOR<UrdPurchaseCreateWithoutSaleInput, UrdPurchaseUncheckedCreateWithoutSaleInput>
    connectOrCreate?: UrdPurchaseCreateOrConnectWithoutSaleInput
    upsert?: UrdPurchaseUpsertWithoutSaleInput
    disconnect?: UrdPurchaseWhereInput | boolean
    delete?: UrdPurchaseWhereInput | boolean
    connect?: UrdPurchaseWhereUniqueInput
    update?: XOR<XOR<UrdPurchaseUpdateToOneWithWhereWithoutSaleInput, UrdPurchaseUpdateWithoutSaleInput>, UrdPurchaseUncheckedUpdateWithoutSaleInput>
  }

  export type SaleItemUncheckedUpdateManyWithoutSaleNestedInput = {
    create?: XOR<SaleItemCreateWithoutSaleInput, SaleItemUncheckedCreateWithoutSaleInput> | SaleItemCreateWithoutSaleInput[] | SaleItemUncheckedCreateWithoutSaleInput[]
    connectOrCreate?: SaleItemCreateOrConnectWithoutSaleInput | SaleItemCreateOrConnectWithoutSaleInput[]
    upsert?: SaleItemUpsertWithWhereUniqueWithoutSaleInput | SaleItemUpsertWithWhereUniqueWithoutSaleInput[]
    createMany?: SaleItemCreateManySaleInputEnvelope
    set?: SaleItemWhereUniqueInput | SaleItemWhereUniqueInput[]
    disconnect?: SaleItemWhereUniqueInput | SaleItemWhereUniqueInput[]
    delete?: SaleItemWhereUniqueInput | SaleItemWhereUniqueInput[]
    connect?: SaleItemWhereUniqueInput | SaleItemWhereUniqueInput[]
    update?: SaleItemUpdateWithWhereUniqueWithoutSaleInput | SaleItemUpdateWithWhereUniqueWithoutSaleInput[]
    updateMany?: SaleItemUpdateManyWithWhereWithoutSaleInput | SaleItemUpdateManyWithWhereWithoutSaleInput[]
    deleteMany?: SaleItemScalarWhereInput | SaleItemScalarWhereInput[]
  }

  export type CustomerLedgerUncheckedUpdateManyWithoutSaleNestedInput = {
    create?: XOR<CustomerLedgerCreateWithoutSaleInput, CustomerLedgerUncheckedCreateWithoutSaleInput> | CustomerLedgerCreateWithoutSaleInput[] | CustomerLedgerUncheckedCreateWithoutSaleInput[]
    connectOrCreate?: CustomerLedgerCreateOrConnectWithoutSaleInput | CustomerLedgerCreateOrConnectWithoutSaleInput[]
    upsert?: CustomerLedgerUpsertWithWhereUniqueWithoutSaleInput | CustomerLedgerUpsertWithWhereUniqueWithoutSaleInput[]
    createMany?: CustomerLedgerCreateManySaleInputEnvelope
    set?: CustomerLedgerWhereUniqueInput | CustomerLedgerWhereUniqueInput[]
    disconnect?: CustomerLedgerWhereUniqueInput | CustomerLedgerWhereUniqueInput[]
    delete?: CustomerLedgerWhereUniqueInput | CustomerLedgerWhereUniqueInput[]
    connect?: CustomerLedgerWhereUniqueInput | CustomerLedgerWhereUniqueInput[]
    update?: CustomerLedgerUpdateWithWhereUniqueWithoutSaleInput | CustomerLedgerUpdateWithWhereUniqueWithoutSaleInput[]
    updateMany?: CustomerLedgerUpdateManyWithWhereWithoutSaleInput | CustomerLedgerUpdateManyWithWhereWithoutSaleInput[]
    deleteMany?: CustomerLedgerScalarWhereInput | CustomerLedgerScalarWhereInput[]
  }

  export type UrdPurchaseUncheckedUpdateOneWithoutSaleNestedInput = {
    create?: XOR<UrdPurchaseCreateWithoutSaleInput, UrdPurchaseUncheckedCreateWithoutSaleInput>
    connectOrCreate?: UrdPurchaseCreateOrConnectWithoutSaleInput
    upsert?: UrdPurchaseUpsertWithoutSaleInput
    disconnect?: UrdPurchaseWhereInput | boolean
    delete?: UrdPurchaseWhereInput | boolean
    connect?: UrdPurchaseWhereUniqueInput
    update?: XOR<XOR<UrdPurchaseUpdateToOneWithWhereWithoutSaleInput, UrdPurchaseUpdateWithoutSaleInput>, UrdPurchaseUncheckedUpdateWithoutSaleInput>
  }

  export type SaleCreateNestedOneWithoutItemsInput = {
    create?: XOR<SaleCreateWithoutItemsInput, SaleUncheckedCreateWithoutItemsInput>
    connectOrCreate?: SaleCreateOrConnectWithoutItemsInput
    connect?: SaleWhereUniqueInput
  }

  export type ProductCreateNestedOneWithoutSaleItemsInput = {
    create?: XOR<ProductCreateWithoutSaleItemsInput, ProductUncheckedCreateWithoutSaleItemsInput>
    connectOrCreate?: ProductCreateOrConnectWithoutSaleItemsInput
    connect?: ProductWhereUniqueInput
  }

  export type SaleUpdateOneRequiredWithoutItemsNestedInput = {
    create?: XOR<SaleCreateWithoutItemsInput, SaleUncheckedCreateWithoutItemsInput>
    connectOrCreate?: SaleCreateOrConnectWithoutItemsInput
    upsert?: SaleUpsertWithoutItemsInput
    connect?: SaleWhereUniqueInput
    update?: XOR<XOR<SaleUpdateToOneWithWhereWithoutItemsInput, SaleUpdateWithoutItemsInput>, SaleUncheckedUpdateWithoutItemsInput>
  }

  export type ProductUpdateOneRequiredWithoutSaleItemsNestedInput = {
    create?: XOR<ProductCreateWithoutSaleItemsInput, ProductUncheckedCreateWithoutSaleItemsInput>
    connectOrCreate?: ProductCreateOrConnectWithoutSaleItemsInput
    upsert?: ProductUpsertWithoutSaleItemsInput
    connect?: ProductWhereUniqueInput
    update?: XOR<XOR<ProductUpdateToOneWithWhereWithoutSaleItemsInput, ProductUpdateWithoutSaleItemsInput>, ProductUncheckedUpdateWithoutSaleItemsInput>
  }

  export type CustomerCreateNestedOneWithoutLedgerInput = {
    create?: XOR<CustomerCreateWithoutLedgerInput, CustomerUncheckedCreateWithoutLedgerInput>
    connectOrCreate?: CustomerCreateOrConnectWithoutLedgerInput
    connect?: CustomerWhereUniqueInput
  }

  export type SaleCreateNestedOneWithoutLedgerEntriesInput = {
    create?: XOR<SaleCreateWithoutLedgerEntriesInput, SaleUncheckedCreateWithoutLedgerEntriesInput>
    connectOrCreate?: SaleCreateOrConnectWithoutLedgerEntriesInput
    connect?: SaleWhereUniqueInput
  }

  export type EnumLedgerEntryTypeFieldUpdateOperationsInput = {
    set?: $Enums.LedgerEntryType
  }

  export type NullableEnumPaymentMethodFieldUpdateOperationsInput = {
    set?: $Enums.PaymentMethod | null
  }

  export type CustomerUpdateOneRequiredWithoutLedgerNestedInput = {
    create?: XOR<CustomerCreateWithoutLedgerInput, CustomerUncheckedCreateWithoutLedgerInput>
    connectOrCreate?: CustomerCreateOrConnectWithoutLedgerInput
    upsert?: CustomerUpsertWithoutLedgerInput
    connect?: CustomerWhereUniqueInput
    update?: XOR<XOR<CustomerUpdateToOneWithWhereWithoutLedgerInput, CustomerUpdateWithoutLedgerInput>, CustomerUncheckedUpdateWithoutLedgerInput>
  }

  export type SaleUpdateOneWithoutLedgerEntriesNestedInput = {
    create?: XOR<SaleCreateWithoutLedgerEntriesInput, SaleUncheckedCreateWithoutLedgerEntriesInput>
    connectOrCreate?: SaleCreateOrConnectWithoutLedgerEntriesInput
    upsert?: SaleUpsertWithoutLedgerEntriesInput
    disconnect?: SaleWhereInput | boolean
    delete?: SaleWhereInput | boolean
    connect?: SaleWhereUniqueInput
    update?: XOR<XOR<SaleUpdateToOneWithWhereWithoutLedgerEntriesInput, SaleUpdateWithoutLedgerEntriesInput>, SaleUncheckedUpdateWithoutLedgerEntriesInput>
  }

  export type CustomerCreateNestedOneWithoutRepairsInput = {
    create?: XOR<CustomerCreateWithoutRepairsInput, CustomerUncheckedCreateWithoutRepairsInput>
    connectOrCreate?: CustomerCreateOrConnectWithoutRepairsInput
    connect?: CustomerWhereUniqueInput
  }

  export type NullableEnumMetalTypeFieldUpdateOperationsInput = {
    set?: $Enums.MetalType | null
  }

  export type NullableDecimalFieldUpdateOperationsInput = {
    set?: Decimal | DecimalJsLike | number | string | null
    increment?: Decimal | DecimalJsLike | number | string
    decrement?: Decimal | DecimalJsLike | number | string
    multiply?: Decimal | DecimalJsLike | number | string
    divide?: Decimal | DecimalJsLike | number | string
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type EnumRepairStatusFieldUpdateOperationsInput = {
    set?: $Enums.RepairStatus
  }

  export type CustomerUpdateOneRequiredWithoutRepairsNestedInput = {
    create?: XOR<CustomerCreateWithoutRepairsInput, CustomerUncheckedCreateWithoutRepairsInput>
    connectOrCreate?: CustomerCreateOrConnectWithoutRepairsInput
    upsert?: CustomerUpsertWithoutRepairsInput
    connect?: CustomerWhereUniqueInput
    update?: XOR<XOR<CustomerUpdateToOneWithWhereWithoutRepairsInput, CustomerUpdateWithoutRepairsInput>, CustomerUncheckedUpdateWithoutRepairsInput>
  }

  export type CustomerCreateNestedOneWithoutCashbookEntriesInput = {
    create?: XOR<CustomerCreateWithoutCashbookEntriesInput, CustomerUncheckedCreateWithoutCashbookEntriesInput>
    connectOrCreate?: CustomerCreateOrConnectWithoutCashbookEntriesInput
    connect?: CustomerWhereUniqueInput
  }

  export type EnumCashbookTypeFieldUpdateOperationsInput = {
    set?: $Enums.CashbookType
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type CustomerUpdateOneWithoutCashbookEntriesNestedInput = {
    create?: XOR<CustomerCreateWithoutCashbookEntriesInput, CustomerUncheckedCreateWithoutCashbookEntriesInput>
    connectOrCreate?: CustomerCreateOrConnectWithoutCashbookEntriesInput
    upsert?: CustomerUpsertWithoutCashbookEntriesInput
    disconnect?: CustomerWhereInput | boolean
    delete?: CustomerWhereInput | boolean
    connect?: CustomerWhereUniqueInput
    update?: XOR<XOR<CustomerUpdateToOneWithWhereWithoutCashbookEntriesInput, CustomerUpdateWithoutCashbookEntriesInput>, CustomerUncheckedUpdateWithoutCashbookEntriesInput>
  }

  export type CustomerCreateNestedOneWithoutUrdPurchasesInput = {
    create?: XOR<CustomerCreateWithoutUrdPurchasesInput, CustomerUncheckedCreateWithoutUrdPurchasesInput>
    connectOrCreate?: CustomerCreateOrConnectWithoutUrdPurchasesInput
    connect?: CustomerWhereUniqueInput
  }

  export type SaleCreateNestedOneWithoutUrdPurchaseInput = {
    create?: XOR<SaleCreateWithoutUrdPurchaseInput, SaleUncheckedCreateWithoutUrdPurchaseInput>
    connectOrCreate?: SaleCreateOrConnectWithoutUrdPurchaseInput
    connect?: SaleWhereUniqueInput
  }

  export type CustomerUpdateOneRequiredWithoutUrdPurchasesNestedInput = {
    create?: XOR<CustomerCreateWithoutUrdPurchasesInput, CustomerUncheckedCreateWithoutUrdPurchasesInput>
    connectOrCreate?: CustomerCreateOrConnectWithoutUrdPurchasesInput
    upsert?: CustomerUpsertWithoutUrdPurchasesInput
    connect?: CustomerWhereUniqueInput
    update?: XOR<XOR<CustomerUpdateToOneWithWhereWithoutUrdPurchasesInput, CustomerUpdateWithoutUrdPurchasesInput>, CustomerUncheckedUpdateWithoutUrdPurchasesInput>
  }

  export type SaleUpdateOneWithoutUrdPurchaseNestedInput = {
    create?: XOR<SaleCreateWithoutUrdPurchaseInput, SaleUncheckedCreateWithoutUrdPurchaseInput>
    connectOrCreate?: SaleCreateOrConnectWithoutUrdPurchaseInput
    upsert?: SaleUpsertWithoutUrdPurchaseInput
    disconnect?: SaleWhereInput | boolean
    delete?: SaleWhereInput | boolean
    connect?: SaleWhereUniqueInput
    update?: XOR<XOR<SaleUpdateToOneWithWhereWithoutUrdPurchaseInput, SaleUpdateWithoutUrdPurchaseInput>, SaleUncheckedUpdateWithoutUrdPurchaseInput>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedEnumMetalTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.MetalType | EnumMetalTypeFieldRefInput<$PrismaModel>
    in?: $Enums.MetalType[]
    notIn?: $Enums.MetalType[]
    not?: NestedEnumMetalTypeFilter<$PrismaModel> | $Enums.MetalType
  }

  export type NestedDecimalFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[]
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[]
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
  }

  export type NestedEnumMakingChargeTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.MakingChargeType | EnumMakingChargeTypeFieldRefInput<$PrismaModel>
    in?: $Enums.MakingChargeType[]
    notIn?: $Enums.MakingChargeType[]
    not?: NestedEnumMakingChargeTypeFilter<$PrismaModel> | $Enums.MakingChargeType
  }

  export type NestedEnumProductStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ProductStatus | EnumProductStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ProductStatus[]
    notIn?: $Enums.ProductStatus[]
    not?: NestedEnumProductStatusFilter<$PrismaModel> | $Enums.ProductStatus
  }

  export type NestedEnumMetalTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.MetalType | EnumMetalTypeFieldRefInput<$PrismaModel>
    in?: $Enums.MetalType[]
    notIn?: $Enums.MetalType[]
    not?: NestedEnumMetalTypeWithAggregatesFilter<$PrismaModel> | $Enums.MetalType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumMetalTypeFilter<$PrismaModel>
    _max?: NestedEnumMetalTypeFilter<$PrismaModel>
  }

  export type NestedDecimalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[]
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[]
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedDecimalFilter<$PrismaModel>
    _sum?: NestedDecimalFilter<$PrismaModel>
    _min?: NestedDecimalFilter<$PrismaModel>
    _max?: NestedDecimalFilter<$PrismaModel>
  }

  export type NestedEnumMakingChargeTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.MakingChargeType | EnumMakingChargeTypeFieldRefInput<$PrismaModel>
    in?: $Enums.MakingChargeType[]
    notIn?: $Enums.MakingChargeType[]
    not?: NestedEnumMakingChargeTypeWithAggregatesFilter<$PrismaModel> | $Enums.MakingChargeType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumMakingChargeTypeFilter<$PrismaModel>
    _max?: NestedEnumMakingChargeTypeFilter<$PrismaModel>
  }

  export type NestedEnumProductStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ProductStatus | EnumProductStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ProductStatus[]
    notIn?: $Enums.ProductStatus[]
    not?: NestedEnumProductStatusWithAggregatesFilter<$PrismaModel> | $Enums.ProductStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumProductStatusFilter<$PrismaModel>
    _max?: NestedEnumProductStatusFilter<$PrismaModel>
  }

  export type NestedEnumMovementTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.MovementType | EnumMovementTypeFieldRefInput<$PrismaModel>
    in?: $Enums.MovementType[]
    notIn?: $Enums.MovementType[]
    not?: NestedEnumMovementTypeFilter<$PrismaModel> | $Enums.MovementType
  }

  export type NestedEnumMovementTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.MovementType | EnumMovementTypeFieldRefInput<$PrismaModel>
    in?: $Enums.MovementType[]
    notIn?: $Enums.MovementType[]
    not?: NestedEnumMovementTypeWithAggregatesFilter<$PrismaModel> | $Enums.MovementType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumMovementTypeFilter<$PrismaModel>
    _max?: NestedEnumMovementTypeFilter<$PrismaModel>
  }

  export type NestedEnumPaymentMethodFilter<$PrismaModel = never> = {
    equals?: $Enums.PaymentMethod | EnumPaymentMethodFieldRefInput<$PrismaModel>
    in?: $Enums.PaymentMethod[]
    notIn?: $Enums.PaymentMethod[]
    not?: NestedEnumPaymentMethodFilter<$PrismaModel> | $Enums.PaymentMethod
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedEnumPaymentMethodWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PaymentMethod | EnumPaymentMethodFieldRefInput<$PrismaModel>
    in?: $Enums.PaymentMethod[]
    notIn?: $Enums.PaymentMethod[]
    not?: NestedEnumPaymentMethodWithAggregatesFilter<$PrismaModel> | $Enums.PaymentMethod
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumPaymentMethodFilter<$PrismaModel>
    _max?: NestedEnumPaymentMethodFilter<$PrismaModel>
  }

  export type NestedEnumLedgerEntryTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.LedgerEntryType | EnumLedgerEntryTypeFieldRefInput<$PrismaModel>
    in?: $Enums.LedgerEntryType[]
    notIn?: $Enums.LedgerEntryType[]
    not?: NestedEnumLedgerEntryTypeFilter<$PrismaModel> | $Enums.LedgerEntryType
  }

  export type NestedEnumPaymentMethodNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.PaymentMethod | EnumPaymentMethodFieldRefInput<$PrismaModel> | null
    in?: $Enums.PaymentMethod[] | null
    notIn?: $Enums.PaymentMethod[] | null
    not?: NestedEnumPaymentMethodNullableFilter<$PrismaModel> | $Enums.PaymentMethod | null
  }

  export type NestedEnumLedgerEntryTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.LedgerEntryType | EnumLedgerEntryTypeFieldRefInput<$PrismaModel>
    in?: $Enums.LedgerEntryType[]
    notIn?: $Enums.LedgerEntryType[]
    not?: NestedEnumLedgerEntryTypeWithAggregatesFilter<$PrismaModel> | $Enums.LedgerEntryType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumLedgerEntryTypeFilter<$PrismaModel>
    _max?: NestedEnumLedgerEntryTypeFilter<$PrismaModel>
  }

  export type NestedEnumPaymentMethodNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PaymentMethod | EnumPaymentMethodFieldRefInput<$PrismaModel> | null
    in?: $Enums.PaymentMethod[] | null
    notIn?: $Enums.PaymentMethod[] | null
    not?: NestedEnumPaymentMethodNullableWithAggregatesFilter<$PrismaModel> | $Enums.PaymentMethod | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumPaymentMethodNullableFilter<$PrismaModel>
    _max?: NestedEnumPaymentMethodNullableFilter<$PrismaModel>
  }

  export type NestedEnumMetalTypeNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.MetalType | EnumMetalTypeFieldRefInput<$PrismaModel> | null
    in?: $Enums.MetalType[] | null
    notIn?: $Enums.MetalType[] | null
    not?: NestedEnumMetalTypeNullableFilter<$PrismaModel> | $Enums.MetalType | null
  }

  export type NestedDecimalNullableFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedEnumRepairStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.RepairStatus | EnumRepairStatusFieldRefInput<$PrismaModel>
    in?: $Enums.RepairStatus[]
    notIn?: $Enums.RepairStatus[]
    not?: NestedEnumRepairStatusFilter<$PrismaModel> | $Enums.RepairStatus
  }

  export type NestedEnumMetalTypeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.MetalType | EnumMetalTypeFieldRefInput<$PrismaModel> | null
    in?: $Enums.MetalType[] | null
    notIn?: $Enums.MetalType[] | null
    not?: NestedEnumMetalTypeNullableWithAggregatesFilter<$PrismaModel> | $Enums.MetalType | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumMetalTypeNullableFilter<$PrismaModel>
    _max?: NestedEnumMetalTypeNullableFilter<$PrismaModel>
  }

  export type NestedDecimalNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedDecimalNullableFilter<$PrismaModel>
    _sum?: NestedDecimalNullableFilter<$PrismaModel>
    _min?: NestedDecimalNullableFilter<$PrismaModel>
    _max?: NestedDecimalNullableFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedEnumRepairStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.RepairStatus | EnumRepairStatusFieldRefInput<$PrismaModel>
    in?: $Enums.RepairStatus[]
    notIn?: $Enums.RepairStatus[]
    not?: NestedEnumRepairStatusWithAggregatesFilter<$PrismaModel> | $Enums.RepairStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRepairStatusFilter<$PrismaModel>
    _max?: NestedEnumRepairStatusFilter<$PrismaModel>
  }

  export type NestedEnumCashbookTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.CashbookType | EnumCashbookTypeFieldRefInput<$PrismaModel>
    in?: $Enums.CashbookType[]
    notIn?: $Enums.CashbookType[]
    not?: NestedEnumCashbookTypeFilter<$PrismaModel> | $Enums.CashbookType
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedEnumCashbookTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.CashbookType | EnumCashbookTypeFieldRefInput<$PrismaModel>
    in?: $Enums.CashbookType[]
    notIn?: $Enums.CashbookType[]
    not?: NestedEnumCashbookTypeWithAggregatesFilter<$PrismaModel> | $Enums.CashbookType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumCashbookTypeFilter<$PrismaModel>
    _max?: NestedEnumCashbookTypeFilter<$PrismaModel>
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type SaleCreateWithoutCustomerInput = {
    invoiceNumber: string
    saleDate?: Date | string
    subtotal?: Decimal | DecimalJsLike | number | string
    discount?: Decimal | DecimalJsLike | number | string
    gstRate?: Decimal | DecimalJsLike | number | string
    gstAmount?: Decimal | DecimalJsLike | number | string
    total?: Decimal | DecimalJsLike | number | string
    urdOffset?: Decimal | DecimalJsLike | number | string
    paid?: Decimal | DecimalJsLike | number | string
    cashPaid?: Decimal | DecimalJsLike | number | string
    upiPaid?: Decimal | DecimalJsLike | number | string
    balance?: Decimal | DecimalJsLike | number | string
    paymentMethod?: $Enums.PaymentMethod
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    items?: SaleItemCreateNestedManyWithoutSaleInput
    ledgerEntries?: CustomerLedgerCreateNestedManyWithoutSaleInput
    urdPurchase?: UrdPurchaseCreateNestedOneWithoutSaleInput
  }

  export type SaleUncheckedCreateWithoutCustomerInput = {
    id?: number
    invoiceNumber: string
    saleDate?: Date | string
    subtotal?: Decimal | DecimalJsLike | number | string
    discount?: Decimal | DecimalJsLike | number | string
    gstRate?: Decimal | DecimalJsLike | number | string
    gstAmount?: Decimal | DecimalJsLike | number | string
    total?: Decimal | DecimalJsLike | number | string
    urdOffset?: Decimal | DecimalJsLike | number | string
    paid?: Decimal | DecimalJsLike | number | string
    cashPaid?: Decimal | DecimalJsLike | number | string
    upiPaid?: Decimal | DecimalJsLike | number | string
    balance?: Decimal | DecimalJsLike | number | string
    paymentMethod?: $Enums.PaymentMethod
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    items?: SaleItemUncheckedCreateNestedManyWithoutSaleInput
    ledgerEntries?: CustomerLedgerUncheckedCreateNestedManyWithoutSaleInput
    urdPurchase?: UrdPurchaseUncheckedCreateNestedOneWithoutSaleInput
  }

  export type SaleCreateOrConnectWithoutCustomerInput = {
    where: SaleWhereUniqueInput
    create: XOR<SaleCreateWithoutCustomerInput, SaleUncheckedCreateWithoutCustomerInput>
  }

  export type SaleCreateManyCustomerInputEnvelope = {
    data: SaleCreateManyCustomerInput | SaleCreateManyCustomerInput[]
    skipDuplicates?: boolean
  }

  export type RepairCreateWithoutCustomerInput = {
    repairNumber: string
    itemDescription: string
    metal?: $Enums.MetalType | null
    grossWeight?: Decimal | DecimalJsLike | number | string | null
    issueDescription?: string | null
    estimatedCharge?: Decimal | DecimalJsLike | number | string
    finalCharge?: Decimal | DecimalJsLike | number | string | null
    advancePaid?: Decimal | DecimalJsLike | number | string
    advancePaymentMethod?: $Enums.PaymentMethod
    dueDate?: Date | string | null
    status?: $Enums.RepairStatus
    receivedAt?: Date | string
    deliveredAt?: Date | string | null
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type RepairUncheckedCreateWithoutCustomerInput = {
    id?: number
    repairNumber: string
    itemDescription: string
    metal?: $Enums.MetalType | null
    grossWeight?: Decimal | DecimalJsLike | number | string | null
    issueDescription?: string | null
    estimatedCharge?: Decimal | DecimalJsLike | number | string
    finalCharge?: Decimal | DecimalJsLike | number | string | null
    advancePaid?: Decimal | DecimalJsLike | number | string
    advancePaymentMethod?: $Enums.PaymentMethod
    dueDate?: Date | string | null
    status?: $Enums.RepairStatus
    receivedAt?: Date | string
    deliveredAt?: Date | string | null
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type RepairCreateOrConnectWithoutCustomerInput = {
    where: RepairWhereUniqueInput
    create: XOR<RepairCreateWithoutCustomerInput, RepairUncheckedCreateWithoutCustomerInput>
  }

  export type RepairCreateManyCustomerInputEnvelope = {
    data: RepairCreateManyCustomerInput | RepairCreateManyCustomerInput[]
    skipDuplicates?: boolean
  }

  export type CustomerLedgerCreateWithoutCustomerInput = {
    type: $Enums.LedgerEntryType
    amount: Decimal | DecimalJsLike | number | string
    paymentMethod?: $Enums.PaymentMethod | null
    reference?: string | null
    note?: string | null
    createdAt?: Date | string
    sale?: SaleCreateNestedOneWithoutLedgerEntriesInput
  }

  export type CustomerLedgerUncheckedCreateWithoutCustomerInput = {
    id?: number
    saleId?: number | null
    type: $Enums.LedgerEntryType
    amount: Decimal | DecimalJsLike | number | string
    paymentMethod?: $Enums.PaymentMethod | null
    reference?: string | null
    note?: string | null
    createdAt?: Date | string
  }

  export type CustomerLedgerCreateOrConnectWithoutCustomerInput = {
    where: CustomerLedgerWhereUniqueInput
    create: XOR<CustomerLedgerCreateWithoutCustomerInput, CustomerLedgerUncheckedCreateWithoutCustomerInput>
  }

  export type CustomerLedgerCreateManyCustomerInputEnvelope = {
    data: CustomerLedgerCreateManyCustomerInput | CustomerLedgerCreateManyCustomerInput[]
    skipDuplicates?: boolean
  }

  export type UrdPurchaseCreateWithoutCustomerInput = {
    purchaseNumber: string
    purchaseDate?: Date | string
    metal?: $Enums.MetalType
    purity?: string | null
    grossWeight?: Decimal | DecimalJsLike | number | string
    netWeight?: Decimal | DecimalJsLike | number | string
    ratePerGram?: Decimal | DecimalJsLike | number | string
    totalAmount?: Decimal | DecimalJsLike | number | string
    saleOffset?: Decimal | DecimalJsLike | number | string
    paid?: Decimal | DecimalJsLike | number | string
    paymentMethod?: $Enums.PaymentMethod
    description?: string | null
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    sale?: SaleCreateNestedOneWithoutUrdPurchaseInput
  }

  export type UrdPurchaseUncheckedCreateWithoutCustomerInput = {
    id?: number
    purchaseNumber: string
    purchaseDate?: Date | string
    metal?: $Enums.MetalType
    purity?: string | null
    grossWeight?: Decimal | DecimalJsLike | number | string
    netWeight?: Decimal | DecimalJsLike | number | string
    ratePerGram?: Decimal | DecimalJsLike | number | string
    totalAmount?: Decimal | DecimalJsLike | number | string
    saleOffset?: Decimal | DecimalJsLike | number | string
    paid?: Decimal | DecimalJsLike | number | string
    paymentMethod?: $Enums.PaymentMethod
    description?: string | null
    notes?: string | null
    saleId?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UrdPurchaseCreateOrConnectWithoutCustomerInput = {
    where: UrdPurchaseWhereUniqueInput
    create: XOR<UrdPurchaseCreateWithoutCustomerInput, UrdPurchaseUncheckedCreateWithoutCustomerInput>
  }

  export type UrdPurchaseCreateManyCustomerInputEnvelope = {
    data: UrdPurchaseCreateManyCustomerInput | UrdPurchaseCreateManyCustomerInput[]
    skipDuplicates?: boolean
  }

  export type CashbookEntryCreateWithoutCustomerInput = {
    entryDate: string
    type: $Enums.CashbookType
    paymentMethod: $Enums.PaymentMethod
    description: string
    amount: Decimal | DecimalJsLike | number | string
    reference?: string | null
    notes?: string | null
    syncLedger?: boolean
    createdAt?: Date | string
  }

  export type CashbookEntryUncheckedCreateWithoutCustomerInput = {
    id?: number
    entryDate: string
    type: $Enums.CashbookType
    paymentMethod: $Enums.PaymentMethod
    description: string
    amount: Decimal | DecimalJsLike | number | string
    reference?: string | null
    notes?: string | null
    syncLedger?: boolean
    createdAt?: Date | string
  }

  export type CashbookEntryCreateOrConnectWithoutCustomerInput = {
    where: CashbookEntryWhereUniqueInput
    create: XOR<CashbookEntryCreateWithoutCustomerInput, CashbookEntryUncheckedCreateWithoutCustomerInput>
  }

  export type CashbookEntryCreateManyCustomerInputEnvelope = {
    data: CashbookEntryCreateManyCustomerInput | CashbookEntryCreateManyCustomerInput[]
    skipDuplicates?: boolean
  }

  export type SaleUpsertWithWhereUniqueWithoutCustomerInput = {
    where: SaleWhereUniqueInput
    update: XOR<SaleUpdateWithoutCustomerInput, SaleUncheckedUpdateWithoutCustomerInput>
    create: XOR<SaleCreateWithoutCustomerInput, SaleUncheckedCreateWithoutCustomerInput>
  }

  export type SaleUpdateWithWhereUniqueWithoutCustomerInput = {
    where: SaleWhereUniqueInput
    data: XOR<SaleUpdateWithoutCustomerInput, SaleUncheckedUpdateWithoutCustomerInput>
  }

  export type SaleUpdateManyWithWhereWithoutCustomerInput = {
    where: SaleScalarWhereInput
    data: XOR<SaleUpdateManyMutationInput, SaleUncheckedUpdateManyWithoutCustomerInput>
  }

  export type SaleScalarWhereInput = {
    AND?: SaleScalarWhereInput | SaleScalarWhereInput[]
    OR?: SaleScalarWhereInput[]
    NOT?: SaleScalarWhereInput | SaleScalarWhereInput[]
    id?: IntFilter<"Sale"> | number
    invoiceNumber?: StringFilter<"Sale"> | string
    customerId?: IntNullableFilter<"Sale"> | number | null
    saleDate?: DateTimeFilter<"Sale"> | Date | string
    subtotal?: DecimalFilter<"Sale"> | Decimal | DecimalJsLike | number | string
    discount?: DecimalFilter<"Sale"> | Decimal | DecimalJsLike | number | string
    gstRate?: DecimalFilter<"Sale"> | Decimal | DecimalJsLike | number | string
    gstAmount?: DecimalFilter<"Sale"> | Decimal | DecimalJsLike | number | string
    total?: DecimalFilter<"Sale"> | Decimal | DecimalJsLike | number | string
    urdOffset?: DecimalFilter<"Sale"> | Decimal | DecimalJsLike | number | string
    paid?: DecimalFilter<"Sale"> | Decimal | DecimalJsLike | number | string
    cashPaid?: DecimalFilter<"Sale"> | Decimal | DecimalJsLike | number | string
    upiPaid?: DecimalFilter<"Sale"> | Decimal | DecimalJsLike | number | string
    balance?: DecimalFilter<"Sale"> | Decimal | DecimalJsLike | number | string
    paymentMethod?: EnumPaymentMethodFilter<"Sale"> | $Enums.PaymentMethod
    notes?: StringNullableFilter<"Sale"> | string | null
    createdAt?: DateTimeFilter<"Sale"> | Date | string
    updatedAt?: DateTimeFilter<"Sale"> | Date | string
  }

  export type RepairUpsertWithWhereUniqueWithoutCustomerInput = {
    where: RepairWhereUniqueInput
    update: XOR<RepairUpdateWithoutCustomerInput, RepairUncheckedUpdateWithoutCustomerInput>
    create: XOR<RepairCreateWithoutCustomerInput, RepairUncheckedCreateWithoutCustomerInput>
  }

  export type RepairUpdateWithWhereUniqueWithoutCustomerInput = {
    where: RepairWhereUniqueInput
    data: XOR<RepairUpdateWithoutCustomerInput, RepairUncheckedUpdateWithoutCustomerInput>
  }

  export type RepairUpdateManyWithWhereWithoutCustomerInput = {
    where: RepairScalarWhereInput
    data: XOR<RepairUpdateManyMutationInput, RepairUncheckedUpdateManyWithoutCustomerInput>
  }

  export type RepairScalarWhereInput = {
    AND?: RepairScalarWhereInput | RepairScalarWhereInput[]
    OR?: RepairScalarWhereInput[]
    NOT?: RepairScalarWhereInput | RepairScalarWhereInput[]
    id?: IntFilter<"Repair"> | number
    repairNumber?: StringFilter<"Repair"> | string
    customerId?: IntFilter<"Repair"> | number
    itemDescription?: StringFilter<"Repair"> | string
    metal?: EnumMetalTypeNullableFilter<"Repair"> | $Enums.MetalType | null
    grossWeight?: DecimalNullableFilter<"Repair"> | Decimal | DecimalJsLike | number | string | null
    issueDescription?: StringNullableFilter<"Repair"> | string | null
    estimatedCharge?: DecimalFilter<"Repair"> | Decimal | DecimalJsLike | number | string
    finalCharge?: DecimalNullableFilter<"Repair"> | Decimal | DecimalJsLike | number | string | null
    advancePaid?: DecimalFilter<"Repair"> | Decimal | DecimalJsLike | number | string
    advancePaymentMethod?: EnumPaymentMethodFilter<"Repair"> | $Enums.PaymentMethod
    dueDate?: DateTimeNullableFilter<"Repair"> | Date | string | null
    status?: EnumRepairStatusFilter<"Repair"> | $Enums.RepairStatus
    receivedAt?: DateTimeFilter<"Repair"> | Date | string
    deliveredAt?: DateTimeNullableFilter<"Repair"> | Date | string | null
    notes?: StringNullableFilter<"Repair"> | string | null
    createdAt?: DateTimeFilter<"Repair"> | Date | string
    updatedAt?: DateTimeFilter<"Repair"> | Date | string
  }

  export type CustomerLedgerUpsertWithWhereUniqueWithoutCustomerInput = {
    where: CustomerLedgerWhereUniqueInput
    update: XOR<CustomerLedgerUpdateWithoutCustomerInput, CustomerLedgerUncheckedUpdateWithoutCustomerInput>
    create: XOR<CustomerLedgerCreateWithoutCustomerInput, CustomerLedgerUncheckedCreateWithoutCustomerInput>
  }

  export type CustomerLedgerUpdateWithWhereUniqueWithoutCustomerInput = {
    where: CustomerLedgerWhereUniqueInput
    data: XOR<CustomerLedgerUpdateWithoutCustomerInput, CustomerLedgerUncheckedUpdateWithoutCustomerInput>
  }

  export type CustomerLedgerUpdateManyWithWhereWithoutCustomerInput = {
    where: CustomerLedgerScalarWhereInput
    data: XOR<CustomerLedgerUpdateManyMutationInput, CustomerLedgerUncheckedUpdateManyWithoutCustomerInput>
  }

  export type CustomerLedgerScalarWhereInput = {
    AND?: CustomerLedgerScalarWhereInput | CustomerLedgerScalarWhereInput[]
    OR?: CustomerLedgerScalarWhereInput[]
    NOT?: CustomerLedgerScalarWhereInput | CustomerLedgerScalarWhereInput[]
    id?: IntFilter<"CustomerLedger"> | number
    customerId?: IntFilter<"CustomerLedger"> | number
    saleId?: IntNullableFilter<"CustomerLedger"> | number | null
    type?: EnumLedgerEntryTypeFilter<"CustomerLedger"> | $Enums.LedgerEntryType
    amount?: DecimalFilter<"CustomerLedger"> | Decimal | DecimalJsLike | number | string
    paymentMethod?: EnumPaymentMethodNullableFilter<"CustomerLedger"> | $Enums.PaymentMethod | null
    reference?: StringNullableFilter<"CustomerLedger"> | string | null
    note?: StringNullableFilter<"CustomerLedger"> | string | null
    createdAt?: DateTimeFilter<"CustomerLedger"> | Date | string
  }

  export type UrdPurchaseUpsertWithWhereUniqueWithoutCustomerInput = {
    where: UrdPurchaseWhereUniqueInput
    update: XOR<UrdPurchaseUpdateWithoutCustomerInput, UrdPurchaseUncheckedUpdateWithoutCustomerInput>
    create: XOR<UrdPurchaseCreateWithoutCustomerInput, UrdPurchaseUncheckedCreateWithoutCustomerInput>
  }

  export type UrdPurchaseUpdateWithWhereUniqueWithoutCustomerInput = {
    where: UrdPurchaseWhereUniqueInput
    data: XOR<UrdPurchaseUpdateWithoutCustomerInput, UrdPurchaseUncheckedUpdateWithoutCustomerInput>
  }

  export type UrdPurchaseUpdateManyWithWhereWithoutCustomerInput = {
    where: UrdPurchaseScalarWhereInput
    data: XOR<UrdPurchaseUpdateManyMutationInput, UrdPurchaseUncheckedUpdateManyWithoutCustomerInput>
  }

  export type UrdPurchaseScalarWhereInput = {
    AND?: UrdPurchaseScalarWhereInput | UrdPurchaseScalarWhereInput[]
    OR?: UrdPurchaseScalarWhereInput[]
    NOT?: UrdPurchaseScalarWhereInput | UrdPurchaseScalarWhereInput[]
    id?: IntFilter<"UrdPurchase"> | number
    purchaseNumber?: StringFilter<"UrdPurchase"> | string
    customerId?: IntFilter<"UrdPurchase"> | number
    purchaseDate?: DateTimeFilter<"UrdPurchase"> | Date | string
    metal?: EnumMetalTypeFilter<"UrdPurchase"> | $Enums.MetalType
    purity?: StringNullableFilter<"UrdPurchase"> | string | null
    grossWeight?: DecimalFilter<"UrdPurchase"> | Decimal | DecimalJsLike | number | string
    netWeight?: DecimalFilter<"UrdPurchase"> | Decimal | DecimalJsLike | number | string
    ratePerGram?: DecimalFilter<"UrdPurchase"> | Decimal | DecimalJsLike | number | string
    totalAmount?: DecimalFilter<"UrdPurchase"> | Decimal | DecimalJsLike | number | string
    saleOffset?: DecimalFilter<"UrdPurchase"> | Decimal | DecimalJsLike | number | string
    paid?: DecimalFilter<"UrdPurchase"> | Decimal | DecimalJsLike | number | string
    paymentMethod?: EnumPaymentMethodFilter<"UrdPurchase"> | $Enums.PaymentMethod
    description?: StringNullableFilter<"UrdPurchase"> | string | null
    notes?: StringNullableFilter<"UrdPurchase"> | string | null
    saleId?: IntNullableFilter<"UrdPurchase"> | number | null
    createdAt?: DateTimeFilter<"UrdPurchase"> | Date | string
    updatedAt?: DateTimeFilter<"UrdPurchase"> | Date | string
  }

  export type CashbookEntryUpsertWithWhereUniqueWithoutCustomerInput = {
    where: CashbookEntryWhereUniqueInput
    update: XOR<CashbookEntryUpdateWithoutCustomerInput, CashbookEntryUncheckedUpdateWithoutCustomerInput>
    create: XOR<CashbookEntryCreateWithoutCustomerInput, CashbookEntryUncheckedCreateWithoutCustomerInput>
  }

  export type CashbookEntryUpdateWithWhereUniqueWithoutCustomerInput = {
    where: CashbookEntryWhereUniqueInput
    data: XOR<CashbookEntryUpdateWithoutCustomerInput, CashbookEntryUncheckedUpdateWithoutCustomerInput>
  }

  export type CashbookEntryUpdateManyWithWhereWithoutCustomerInput = {
    where: CashbookEntryScalarWhereInput
    data: XOR<CashbookEntryUpdateManyMutationInput, CashbookEntryUncheckedUpdateManyWithoutCustomerInput>
  }

  export type CashbookEntryScalarWhereInput = {
    AND?: CashbookEntryScalarWhereInput | CashbookEntryScalarWhereInput[]
    OR?: CashbookEntryScalarWhereInput[]
    NOT?: CashbookEntryScalarWhereInput | CashbookEntryScalarWhereInput[]
    id?: IntFilter<"CashbookEntry"> | number
    entryDate?: StringFilter<"CashbookEntry"> | string
    type?: EnumCashbookTypeFilter<"CashbookEntry"> | $Enums.CashbookType
    paymentMethod?: EnumPaymentMethodFilter<"CashbookEntry"> | $Enums.PaymentMethod
    description?: StringFilter<"CashbookEntry"> | string
    amount?: DecimalFilter<"CashbookEntry"> | Decimal | DecimalJsLike | number | string
    reference?: StringNullableFilter<"CashbookEntry"> | string | null
    notes?: StringNullableFilter<"CashbookEntry"> | string | null
    customerId?: IntNullableFilter<"CashbookEntry"> | number | null
    syncLedger?: BoolFilter<"CashbookEntry"> | boolean
    createdAt?: DateTimeFilter<"CashbookEntry"> | Date | string
  }

  export type PurchaseCreateWithoutSupplierInput = {
    purchaseNumber: string
    purchaseDate?: Date | string
    subtotal?: Decimal | DecimalJsLike | number | string
    discount?: Decimal | DecimalJsLike | number | string
    total?: Decimal | DecimalJsLike | number | string
    paid?: Decimal | DecimalJsLike | number | string
    paymentMethod?: $Enums.PaymentMethod
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    items?: PurchaseItemCreateNestedManyWithoutPurchaseInput
  }

  export type PurchaseUncheckedCreateWithoutSupplierInput = {
    id?: number
    purchaseNumber: string
    purchaseDate?: Date | string
    subtotal?: Decimal | DecimalJsLike | number | string
    discount?: Decimal | DecimalJsLike | number | string
    total?: Decimal | DecimalJsLike | number | string
    paid?: Decimal | DecimalJsLike | number | string
    paymentMethod?: $Enums.PaymentMethod
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    items?: PurchaseItemUncheckedCreateNestedManyWithoutPurchaseInput
  }

  export type PurchaseCreateOrConnectWithoutSupplierInput = {
    where: PurchaseWhereUniqueInput
    create: XOR<PurchaseCreateWithoutSupplierInput, PurchaseUncheckedCreateWithoutSupplierInput>
  }

  export type PurchaseCreateManySupplierInputEnvelope = {
    data: PurchaseCreateManySupplierInput | PurchaseCreateManySupplierInput[]
    skipDuplicates?: boolean
  }

  export type PurchaseUpsertWithWhereUniqueWithoutSupplierInput = {
    where: PurchaseWhereUniqueInput
    update: XOR<PurchaseUpdateWithoutSupplierInput, PurchaseUncheckedUpdateWithoutSupplierInput>
    create: XOR<PurchaseCreateWithoutSupplierInput, PurchaseUncheckedCreateWithoutSupplierInput>
  }

  export type PurchaseUpdateWithWhereUniqueWithoutSupplierInput = {
    where: PurchaseWhereUniqueInput
    data: XOR<PurchaseUpdateWithoutSupplierInput, PurchaseUncheckedUpdateWithoutSupplierInput>
  }

  export type PurchaseUpdateManyWithWhereWithoutSupplierInput = {
    where: PurchaseScalarWhereInput
    data: XOR<PurchaseUpdateManyMutationInput, PurchaseUncheckedUpdateManyWithoutSupplierInput>
  }

  export type PurchaseScalarWhereInput = {
    AND?: PurchaseScalarWhereInput | PurchaseScalarWhereInput[]
    OR?: PurchaseScalarWhereInput[]
    NOT?: PurchaseScalarWhereInput | PurchaseScalarWhereInput[]
    id?: IntFilter<"Purchase"> | number
    purchaseNumber?: StringFilter<"Purchase"> | string
    supplierId?: IntNullableFilter<"Purchase"> | number | null
    purchaseDate?: DateTimeFilter<"Purchase"> | Date | string
    subtotal?: DecimalFilter<"Purchase"> | Decimal | DecimalJsLike | number | string
    discount?: DecimalFilter<"Purchase"> | Decimal | DecimalJsLike | number | string
    total?: DecimalFilter<"Purchase"> | Decimal | DecimalJsLike | number | string
    paid?: DecimalFilter<"Purchase"> | Decimal | DecimalJsLike | number | string
    paymentMethod?: EnumPaymentMethodFilter<"Purchase"> | $Enums.PaymentMethod
    notes?: StringNullableFilter<"Purchase"> | string | null
    createdAt?: DateTimeFilter<"Purchase"> | Date | string
    updatedAt?: DateTimeFilter<"Purchase"> | Date | string
  }

  export type SaleItemCreateWithoutProductInput = {
    quantity: number
    weight?: Decimal | DecimalJsLike | number | string
    unitPrice: Decimal | DecimalJsLike | number | string
    metalRate?: Decimal | DecimalJsLike | number | string
    metalAmount?: Decimal | DecimalJsLike | number | string
    makingCharge?: Decimal | DecimalJsLike | number | string
    makingChargeType?: $Enums.MakingChargeType
    makingChargeValue?: Decimal | DecimalJsLike | number | string
    taxableAmount?: Decimal | DecimalJsLike | number | string
    lineTotal: Decimal | DecimalJsLike | number | string
    sale: SaleCreateNestedOneWithoutItemsInput
  }

  export type SaleItemUncheckedCreateWithoutProductInput = {
    id?: number
    saleId: number
    quantity: number
    weight?: Decimal | DecimalJsLike | number | string
    unitPrice: Decimal | DecimalJsLike | number | string
    metalRate?: Decimal | DecimalJsLike | number | string
    metalAmount?: Decimal | DecimalJsLike | number | string
    makingCharge?: Decimal | DecimalJsLike | number | string
    makingChargeType?: $Enums.MakingChargeType
    makingChargeValue?: Decimal | DecimalJsLike | number | string
    taxableAmount?: Decimal | DecimalJsLike | number | string
    lineTotal: Decimal | DecimalJsLike | number | string
  }

  export type SaleItemCreateOrConnectWithoutProductInput = {
    where: SaleItemWhereUniqueInput
    create: XOR<SaleItemCreateWithoutProductInput, SaleItemUncheckedCreateWithoutProductInput>
  }

  export type SaleItemCreateManyProductInputEnvelope = {
    data: SaleItemCreateManyProductInput | SaleItemCreateManyProductInput[]
    skipDuplicates?: boolean
  }

  export type PurchaseItemCreateWithoutProductInput = {
    quantity: number
    unitCost: Decimal | DecimalJsLike | number | string
    lineTotal: Decimal | DecimalJsLike | number | string
    purchase: PurchaseCreateNestedOneWithoutItemsInput
  }

  export type PurchaseItemUncheckedCreateWithoutProductInput = {
    id?: number
    purchaseId: number
    quantity: number
    unitCost: Decimal | DecimalJsLike | number | string
    lineTotal: Decimal | DecimalJsLike | number | string
  }

  export type PurchaseItemCreateOrConnectWithoutProductInput = {
    where: PurchaseItemWhereUniqueInput
    create: XOR<PurchaseItemCreateWithoutProductInput, PurchaseItemUncheckedCreateWithoutProductInput>
  }

  export type PurchaseItemCreateManyProductInputEnvelope = {
    data: PurchaseItemCreateManyProductInput | PurchaseItemCreateManyProductInput[]
    skipDuplicates?: boolean
  }

  export type StockMovementCreateWithoutProductInput = {
    type: $Enums.MovementType
    quantity: number
    note?: string | null
    createdAt?: Date | string
  }

  export type StockMovementUncheckedCreateWithoutProductInput = {
    id?: number
    type: $Enums.MovementType
    quantity: number
    note?: string | null
    createdAt?: Date | string
  }

  export type StockMovementCreateOrConnectWithoutProductInput = {
    where: StockMovementWhereUniqueInput
    create: XOR<StockMovementCreateWithoutProductInput, StockMovementUncheckedCreateWithoutProductInput>
  }

  export type StockMovementCreateManyProductInputEnvelope = {
    data: StockMovementCreateManyProductInput | StockMovementCreateManyProductInput[]
    skipDuplicates?: boolean
  }

  export type SaleItemUpsertWithWhereUniqueWithoutProductInput = {
    where: SaleItemWhereUniqueInput
    update: XOR<SaleItemUpdateWithoutProductInput, SaleItemUncheckedUpdateWithoutProductInput>
    create: XOR<SaleItemCreateWithoutProductInput, SaleItemUncheckedCreateWithoutProductInput>
  }

  export type SaleItemUpdateWithWhereUniqueWithoutProductInput = {
    where: SaleItemWhereUniqueInput
    data: XOR<SaleItemUpdateWithoutProductInput, SaleItemUncheckedUpdateWithoutProductInput>
  }

  export type SaleItemUpdateManyWithWhereWithoutProductInput = {
    where: SaleItemScalarWhereInput
    data: XOR<SaleItemUpdateManyMutationInput, SaleItemUncheckedUpdateManyWithoutProductInput>
  }

  export type SaleItemScalarWhereInput = {
    AND?: SaleItemScalarWhereInput | SaleItemScalarWhereInput[]
    OR?: SaleItemScalarWhereInput[]
    NOT?: SaleItemScalarWhereInput | SaleItemScalarWhereInput[]
    id?: IntFilter<"SaleItem"> | number
    saleId?: IntFilter<"SaleItem"> | number
    productId?: IntFilter<"SaleItem"> | number
    quantity?: IntFilter<"SaleItem"> | number
    weight?: DecimalFilter<"SaleItem"> | Decimal | DecimalJsLike | number | string
    unitPrice?: DecimalFilter<"SaleItem"> | Decimal | DecimalJsLike | number | string
    metalRate?: DecimalFilter<"SaleItem"> | Decimal | DecimalJsLike | number | string
    metalAmount?: DecimalFilter<"SaleItem"> | Decimal | DecimalJsLike | number | string
    makingCharge?: DecimalFilter<"SaleItem"> | Decimal | DecimalJsLike | number | string
    makingChargeType?: EnumMakingChargeTypeFilter<"SaleItem"> | $Enums.MakingChargeType
    makingChargeValue?: DecimalFilter<"SaleItem"> | Decimal | DecimalJsLike | number | string
    taxableAmount?: DecimalFilter<"SaleItem"> | Decimal | DecimalJsLike | number | string
    lineTotal?: DecimalFilter<"SaleItem"> | Decimal | DecimalJsLike | number | string
  }

  export type PurchaseItemUpsertWithWhereUniqueWithoutProductInput = {
    where: PurchaseItemWhereUniqueInput
    update: XOR<PurchaseItemUpdateWithoutProductInput, PurchaseItemUncheckedUpdateWithoutProductInput>
    create: XOR<PurchaseItemCreateWithoutProductInput, PurchaseItemUncheckedCreateWithoutProductInput>
  }

  export type PurchaseItemUpdateWithWhereUniqueWithoutProductInput = {
    where: PurchaseItemWhereUniqueInput
    data: XOR<PurchaseItemUpdateWithoutProductInput, PurchaseItemUncheckedUpdateWithoutProductInput>
  }

  export type PurchaseItemUpdateManyWithWhereWithoutProductInput = {
    where: PurchaseItemScalarWhereInput
    data: XOR<PurchaseItemUpdateManyMutationInput, PurchaseItemUncheckedUpdateManyWithoutProductInput>
  }

  export type PurchaseItemScalarWhereInput = {
    AND?: PurchaseItemScalarWhereInput | PurchaseItemScalarWhereInput[]
    OR?: PurchaseItemScalarWhereInput[]
    NOT?: PurchaseItemScalarWhereInput | PurchaseItemScalarWhereInput[]
    id?: IntFilter<"PurchaseItem"> | number
    purchaseId?: IntFilter<"PurchaseItem"> | number
    productId?: IntFilter<"PurchaseItem"> | number
    quantity?: IntFilter<"PurchaseItem"> | number
    unitCost?: DecimalFilter<"PurchaseItem"> | Decimal | DecimalJsLike | number | string
    lineTotal?: DecimalFilter<"PurchaseItem"> | Decimal | DecimalJsLike | number | string
  }

  export type StockMovementUpsertWithWhereUniqueWithoutProductInput = {
    where: StockMovementWhereUniqueInput
    update: XOR<StockMovementUpdateWithoutProductInput, StockMovementUncheckedUpdateWithoutProductInput>
    create: XOR<StockMovementCreateWithoutProductInput, StockMovementUncheckedCreateWithoutProductInput>
  }

  export type StockMovementUpdateWithWhereUniqueWithoutProductInput = {
    where: StockMovementWhereUniqueInput
    data: XOR<StockMovementUpdateWithoutProductInput, StockMovementUncheckedUpdateWithoutProductInput>
  }

  export type StockMovementUpdateManyWithWhereWithoutProductInput = {
    where: StockMovementScalarWhereInput
    data: XOR<StockMovementUpdateManyMutationInput, StockMovementUncheckedUpdateManyWithoutProductInput>
  }

  export type StockMovementScalarWhereInput = {
    AND?: StockMovementScalarWhereInput | StockMovementScalarWhereInput[]
    OR?: StockMovementScalarWhereInput[]
    NOT?: StockMovementScalarWhereInput | StockMovementScalarWhereInput[]
    id?: IntFilter<"StockMovement"> | number
    productId?: IntFilter<"StockMovement"> | number
    type?: EnumMovementTypeFilter<"StockMovement"> | $Enums.MovementType
    quantity?: IntFilter<"StockMovement"> | number
    note?: StringNullableFilter<"StockMovement"> | string | null
    createdAt?: DateTimeFilter<"StockMovement"> | Date | string
  }

  export type ProductCreateWithoutMovementsInput = {
    barcode?: string | null
    sku: string
    name: string
    category: string
    metal?: $Enums.MetalType
    purity?: string | null
    grossWeight?: Decimal | DecimalJsLike | number | string
    stoneWeight?: Decimal | DecimalJsLike | number | string
    netWeight?: Decimal | DecimalJsLike | number | string
    quantity?: number
    reorderLevel?: number
    purchasePrice?: Decimal | DecimalJsLike | number | string
    sellingPrice?: Decimal | DecimalJsLike | number | string
    makingChargePerGram?: Decimal | DecimalJsLike | number | string
    makingChargeType?: $Enums.MakingChargeType
    makingChargeValue?: Decimal | DecimalJsLike | number | string
    location?: string | null
    notes?: string | null
    status?: $Enums.ProductStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    saleItems?: SaleItemCreateNestedManyWithoutProductInput
    purchaseItems?: PurchaseItemCreateNestedManyWithoutProductInput
  }

  export type ProductUncheckedCreateWithoutMovementsInput = {
    id?: number
    barcode?: string | null
    sku: string
    name: string
    category: string
    metal?: $Enums.MetalType
    purity?: string | null
    grossWeight?: Decimal | DecimalJsLike | number | string
    stoneWeight?: Decimal | DecimalJsLike | number | string
    netWeight?: Decimal | DecimalJsLike | number | string
    quantity?: number
    reorderLevel?: number
    purchasePrice?: Decimal | DecimalJsLike | number | string
    sellingPrice?: Decimal | DecimalJsLike | number | string
    makingChargePerGram?: Decimal | DecimalJsLike | number | string
    makingChargeType?: $Enums.MakingChargeType
    makingChargeValue?: Decimal | DecimalJsLike | number | string
    location?: string | null
    notes?: string | null
    status?: $Enums.ProductStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    saleItems?: SaleItemUncheckedCreateNestedManyWithoutProductInput
    purchaseItems?: PurchaseItemUncheckedCreateNestedManyWithoutProductInput
  }

  export type ProductCreateOrConnectWithoutMovementsInput = {
    where: ProductWhereUniqueInput
    create: XOR<ProductCreateWithoutMovementsInput, ProductUncheckedCreateWithoutMovementsInput>
  }

  export type ProductUpsertWithoutMovementsInput = {
    update: XOR<ProductUpdateWithoutMovementsInput, ProductUncheckedUpdateWithoutMovementsInput>
    create: XOR<ProductCreateWithoutMovementsInput, ProductUncheckedCreateWithoutMovementsInput>
    where?: ProductWhereInput
  }

  export type ProductUpdateToOneWithWhereWithoutMovementsInput = {
    where?: ProductWhereInput
    data: XOR<ProductUpdateWithoutMovementsInput, ProductUncheckedUpdateWithoutMovementsInput>
  }

  export type ProductUpdateWithoutMovementsInput = {
    barcode?: NullableStringFieldUpdateOperationsInput | string | null
    sku?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    metal?: EnumMetalTypeFieldUpdateOperationsInput | $Enums.MetalType
    purity?: NullableStringFieldUpdateOperationsInput | string | null
    grossWeight?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    stoneWeight?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    netWeight?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    quantity?: IntFieldUpdateOperationsInput | number
    reorderLevel?: IntFieldUpdateOperationsInput | number
    purchasePrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    sellingPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    makingChargePerGram?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    makingChargeType?: EnumMakingChargeTypeFieldUpdateOperationsInput | $Enums.MakingChargeType
    makingChargeValue?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    location?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumProductStatusFieldUpdateOperationsInput | $Enums.ProductStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    saleItems?: SaleItemUpdateManyWithoutProductNestedInput
    purchaseItems?: PurchaseItemUpdateManyWithoutProductNestedInput
  }

  export type ProductUncheckedUpdateWithoutMovementsInput = {
    id?: IntFieldUpdateOperationsInput | number
    barcode?: NullableStringFieldUpdateOperationsInput | string | null
    sku?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    metal?: EnumMetalTypeFieldUpdateOperationsInput | $Enums.MetalType
    purity?: NullableStringFieldUpdateOperationsInput | string | null
    grossWeight?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    stoneWeight?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    netWeight?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    quantity?: IntFieldUpdateOperationsInput | number
    reorderLevel?: IntFieldUpdateOperationsInput | number
    purchasePrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    sellingPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    makingChargePerGram?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    makingChargeType?: EnumMakingChargeTypeFieldUpdateOperationsInput | $Enums.MakingChargeType
    makingChargeValue?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    location?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumProductStatusFieldUpdateOperationsInput | $Enums.ProductStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    saleItems?: SaleItemUncheckedUpdateManyWithoutProductNestedInput
    purchaseItems?: PurchaseItemUncheckedUpdateManyWithoutProductNestedInput
  }

  export type SupplierCreateWithoutPurchasesInput = {
    name: string
    phone?: string | null
    email?: string | null
    address?: string | null
    gstin?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SupplierUncheckedCreateWithoutPurchasesInput = {
    id?: number
    name: string
    phone?: string | null
    email?: string | null
    address?: string | null
    gstin?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SupplierCreateOrConnectWithoutPurchasesInput = {
    where: SupplierWhereUniqueInput
    create: XOR<SupplierCreateWithoutPurchasesInput, SupplierUncheckedCreateWithoutPurchasesInput>
  }

  export type PurchaseItemCreateWithoutPurchaseInput = {
    quantity: number
    unitCost: Decimal | DecimalJsLike | number | string
    lineTotal: Decimal | DecimalJsLike | number | string
    product: ProductCreateNestedOneWithoutPurchaseItemsInput
  }

  export type PurchaseItemUncheckedCreateWithoutPurchaseInput = {
    id?: number
    productId: number
    quantity: number
    unitCost: Decimal | DecimalJsLike | number | string
    lineTotal: Decimal | DecimalJsLike | number | string
  }

  export type PurchaseItemCreateOrConnectWithoutPurchaseInput = {
    where: PurchaseItemWhereUniqueInput
    create: XOR<PurchaseItemCreateWithoutPurchaseInput, PurchaseItemUncheckedCreateWithoutPurchaseInput>
  }

  export type PurchaseItemCreateManyPurchaseInputEnvelope = {
    data: PurchaseItemCreateManyPurchaseInput | PurchaseItemCreateManyPurchaseInput[]
    skipDuplicates?: boolean
  }

  export type SupplierUpsertWithoutPurchasesInput = {
    update: XOR<SupplierUpdateWithoutPurchasesInput, SupplierUncheckedUpdateWithoutPurchasesInput>
    create: XOR<SupplierCreateWithoutPurchasesInput, SupplierUncheckedCreateWithoutPurchasesInput>
    where?: SupplierWhereInput
  }

  export type SupplierUpdateToOneWithWhereWithoutPurchasesInput = {
    where?: SupplierWhereInput
    data: XOR<SupplierUpdateWithoutPurchasesInput, SupplierUncheckedUpdateWithoutPurchasesInput>
  }

  export type SupplierUpdateWithoutPurchasesInput = {
    name?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    gstin?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SupplierUncheckedUpdateWithoutPurchasesInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    gstin?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PurchaseItemUpsertWithWhereUniqueWithoutPurchaseInput = {
    where: PurchaseItemWhereUniqueInput
    update: XOR<PurchaseItemUpdateWithoutPurchaseInput, PurchaseItemUncheckedUpdateWithoutPurchaseInput>
    create: XOR<PurchaseItemCreateWithoutPurchaseInput, PurchaseItemUncheckedCreateWithoutPurchaseInput>
  }

  export type PurchaseItemUpdateWithWhereUniqueWithoutPurchaseInput = {
    where: PurchaseItemWhereUniqueInput
    data: XOR<PurchaseItemUpdateWithoutPurchaseInput, PurchaseItemUncheckedUpdateWithoutPurchaseInput>
  }

  export type PurchaseItemUpdateManyWithWhereWithoutPurchaseInput = {
    where: PurchaseItemScalarWhereInput
    data: XOR<PurchaseItemUpdateManyMutationInput, PurchaseItemUncheckedUpdateManyWithoutPurchaseInput>
  }

  export type PurchaseCreateWithoutItemsInput = {
    purchaseNumber: string
    purchaseDate?: Date | string
    subtotal?: Decimal | DecimalJsLike | number | string
    discount?: Decimal | DecimalJsLike | number | string
    total?: Decimal | DecimalJsLike | number | string
    paid?: Decimal | DecimalJsLike | number | string
    paymentMethod?: $Enums.PaymentMethod
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    supplier?: SupplierCreateNestedOneWithoutPurchasesInput
  }

  export type PurchaseUncheckedCreateWithoutItemsInput = {
    id?: number
    purchaseNumber: string
    supplierId?: number | null
    purchaseDate?: Date | string
    subtotal?: Decimal | DecimalJsLike | number | string
    discount?: Decimal | DecimalJsLike | number | string
    total?: Decimal | DecimalJsLike | number | string
    paid?: Decimal | DecimalJsLike | number | string
    paymentMethod?: $Enums.PaymentMethod
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PurchaseCreateOrConnectWithoutItemsInput = {
    where: PurchaseWhereUniqueInput
    create: XOR<PurchaseCreateWithoutItemsInput, PurchaseUncheckedCreateWithoutItemsInput>
  }

  export type ProductCreateWithoutPurchaseItemsInput = {
    barcode?: string | null
    sku: string
    name: string
    category: string
    metal?: $Enums.MetalType
    purity?: string | null
    grossWeight?: Decimal | DecimalJsLike | number | string
    stoneWeight?: Decimal | DecimalJsLike | number | string
    netWeight?: Decimal | DecimalJsLike | number | string
    quantity?: number
    reorderLevel?: number
    purchasePrice?: Decimal | DecimalJsLike | number | string
    sellingPrice?: Decimal | DecimalJsLike | number | string
    makingChargePerGram?: Decimal | DecimalJsLike | number | string
    makingChargeType?: $Enums.MakingChargeType
    makingChargeValue?: Decimal | DecimalJsLike | number | string
    location?: string | null
    notes?: string | null
    status?: $Enums.ProductStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    saleItems?: SaleItemCreateNestedManyWithoutProductInput
    movements?: StockMovementCreateNestedManyWithoutProductInput
  }

  export type ProductUncheckedCreateWithoutPurchaseItemsInput = {
    id?: number
    barcode?: string | null
    sku: string
    name: string
    category: string
    metal?: $Enums.MetalType
    purity?: string | null
    grossWeight?: Decimal | DecimalJsLike | number | string
    stoneWeight?: Decimal | DecimalJsLike | number | string
    netWeight?: Decimal | DecimalJsLike | number | string
    quantity?: number
    reorderLevel?: number
    purchasePrice?: Decimal | DecimalJsLike | number | string
    sellingPrice?: Decimal | DecimalJsLike | number | string
    makingChargePerGram?: Decimal | DecimalJsLike | number | string
    makingChargeType?: $Enums.MakingChargeType
    makingChargeValue?: Decimal | DecimalJsLike | number | string
    location?: string | null
    notes?: string | null
    status?: $Enums.ProductStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    saleItems?: SaleItemUncheckedCreateNestedManyWithoutProductInput
    movements?: StockMovementUncheckedCreateNestedManyWithoutProductInput
  }

  export type ProductCreateOrConnectWithoutPurchaseItemsInput = {
    where: ProductWhereUniqueInput
    create: XOR<ProductCreateWithoutPurchaseItemsInput, ProductUncheckedCreateWithoutPurchaseItemsInput>
  }

  export type PurchaseUpsertWithoutItemsInput = {
    update: XOR<PurchaseUpdateWithoutItemsInput, PurchaseUncheckedUpdateWithoutItemsInput>
    create: XOR<PurchaseCreateWithoutItemsInput, PurchaseUncheckedCreateWithoutItemsInput>
    where?: PurchaseWhereInput
  }

  export type PurchaseUpdateToOneWithWhereWithoutItemsInput = {
    where?: PurchaseWhereInput
    data: XOR<PurchaseUpdateWithoutItemsInput, PurchaseUncheckedUpdateWithoutItemsInput>
  }

  export type PurchaseUpdateWithoutItemsInput = {
    purchaseNumber?: StringFieldUpdateOperationsInput | string
    purchaseDate?: DateTimeFieldUpdateOperationsInput | Date | string
    subtotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    discount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    total?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    paid?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    paymentMethod?: EnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    supplier?: SupplierUpdateOneWithoutPurchasesNestedInput
  }

  export type PurchaseUncheckedUpdateWithoutItemsInput = {
    id?: IntFieldUpdateOperationsInput | number
    purchaseNumber?: StringFieldUpdateOperationsInput | string
    supplierId?: NullableIntFieldUpdateOperationsInput | number | null
    purchaseDate?: DateTimeFieldUpdateOperationsInput | Date | string
    subtotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    discount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    total?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    paid?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    paymentMethod?: EnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProductUpsertWithoutPurchaseItemsInput = {
    update: XOR<ProductUpdateWithoutPurchaseItemsInput, ProductUncheckedUpdateWithoutPurchaseItemsInput>
    create: XOR<ProductCreateWithoutPurchaseItemsInput, ProductUncheckedCreateWithoutPurchaseItemsInput>
    where?: ProductWhereInput
  }

  export type ProductUpdateToOneWithWhereWithoutPurchaseItemsInput = {
    where?: ProductWhereInput
    data: XOR<ProductUpdateWithoutPurchaseItemsInput, ProductUncheckedUpdateWithoutPurchaseItemsInput>
  }

  export type ProductUpdateWithoutPurchaseItemsInput = {
    barcode?: NullableStringFieldUpdateOperationsInput | string | null
    sku?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    metal?: EnumMetalTypeFieldUpdateOperationsInput | $Enums.MetalType
    purity?: NullableStringFieldUpdateOperationsInput | string | null
    grossWeight?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    stoneWeight?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    netWeight?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    quantity?: IntFieldUpdateOperationsInput | number
    reorderLevel?: IntFieldUpdateOperationsInput | number
    purchasePrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    sellingPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    makingChargePerGram?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    makingChargeType?: EnumMakingChargeTypeFieldUpdateOperationsInput | $Enums.MakingChargeType
    makingChargeValue?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    location?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumProductStatusFieldUpdateOperationsInput | $Enums.ProductStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    saleItems?: SaleItemUpdateManyWithoutProductNestedInput
    movements?: StockMovementUpdateManyWithoutProductNestedInput
  }

  export type ProductUncheckedUpdateWithoutPurchaseItemsInput = {
    id?: IntFieldUpdateOperationsInput | number
    barcode?: NullableStringFieldUpdateOperationsInput | string | null
    sku?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    metal?: EnumMetalTypeFieldUpdateOperationsInput | $Enums.MetalType
    purity?: NullableStringFieldUpdateOperationsInput | string | null
    grossWeight?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    stoneWeight?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    netWeight?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    quantity?: IntFieldUpdateOperationsInput | number
    reorderLevel?: IntFieldUpdateOperationsInput | number
    purchasePrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    sellingPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    makingChargePerGram?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    makingChargeType?: EnumMakingChargeTypeFieldUpdateOperationsInput | $Enums.MakingChargeType
    makingChargeValue?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    location?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumProductStatusFieldUpdateOperationsInput | $Enums.ProductStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    saleItems?: SaleItemUncheckedUpdateManyWithoutProductNestedInput
    movements?: StockMovementUncheckedUpdateManyWithoutProductNestedInput
  }

  export type CustomerCreateWithoutSalesInput = {
    name: string
    phone?: string | null
    email?: string | null
    address?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    repairs?: RepairCreateNestedManyWithoutCustomerInput
    ledger?: CustomerLedgerCreateNestedManyWithoutCustomerInput
    urdPurchases?: UrdPurchaseCreateNestedManyWithoutCustomerInput
    cashbookEntries?: CashbookEntryCreateNestedManyWithoutCustomerInput
  }

  export type CustomerUncheckedCreateWithoutSalesInput = {
    id?: number
    name: string
    phone?: string | null
    email?: string | null
    address?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    repairs?: RepairUncheckedCreateNestedManyWithoutCustomerInput
    ledger?: CustomerLedgerUncheckedCreateNestedManyWithoutCustomerInput
    urdPurchases?: UrdPurchaseUncheckedCreateNestedManyWithoutCustomerInput
    cashbookEntries?: CashbookEntryUncheckedCreateNestedManyWithoutCustomerInput
  }

  export type CustomerCreateOrConnectWithoutSalesInput = {
    where: CustomerWhereUniqueInput
    create: XOR<CustomerCreateWithoutSalesInput, CustomerUncheckedCreateWithoutSalesInput>
  }

  export type SaleItemCreateWithoutSaleInput = {
    quantity: number
    weight?: Decimal | DecimalJsLike | number | string
    unitPrice: Decimal | DecimalJsLike | number | string
    metalRate?: Decimal | DecimalJsLike | number | string
    metalAmount?: Decimal | DecimalJsLike | number | string
    makingCharge?: Decimal | DecimalJsLike | number | string
    makingChargeType?: $Enums.MakingChargeType
    makingChargeValue?: Decimal | DecimalJsLike | number | string
    taxableAmount?: Decimal | DecimalJsLike | number | string
    lineTotal: Decimal | DecimalJsLike | number | string
    product: ProductCreateNestedOneWithoutSaleItemsInput
  }

  export type SaleItemUncheckedCreateWithoutSaleInput = {
    id?: number
    productId: number
    quantity: number
    weight?: Decimal | DecimalJsLike | number | string
    unitPrice: Decimal | DecimalJsLike | number | string
    metalRate?: Decimal | DecimalJsLike | number | string
    metalAmount?: Decimal | DecimalJsLike | number | string
    makingCharge?: Decimal | DecimalJsLike | number | string
    makingChargeType?: $Enums.MakingChargeType
    makingChargeValue?: Decimal | DecimalJsLike | number | string
    taxableAmount?: Decimal | DecimalJsLike | number | string
    lineTotal: Decimal | DecimalJsLike | number | string
  }

  export type SaleItemCreateOrConnectWithoutSaleInput = {
    where: SaleItemWhereUniqueInput
    create: XOR<SaleItemCreateWithoutSaleInput, SaleItemUncheckedCreateWithoutSaleInput>
  }

  export type SaleItemCreateManySaleInputEnvelope = {
    data: SaleItemCreateManySaleInput | SaleItemCreateManySaleInput[]
    skipDuplicates?: boolean
  }

  export type CustomerLedgerCreateWithoutSaleInput = {
    type: $Enums.LedgerEntryType
    amount: Decimal | DecimalJsLike | number | string
    paymentMethod?: $Enums.PaymentMethod | null
    reference?: string | null
    note?: string | null
    createdAt?: Date | string
    customer: CustomerCreateNestedOneWithoutLedgerInput
  }

  export type CustomerLedgerUncheckedCreateWithoutSaleInput = {
    id?: number
    customerId: number
    type: $Enums.LedgerEntryType
    amount: Decimal | DecimalJsLike | number | string
    paymentMethod?: $Enums.PaymentMethod | null
    reference?: string | null
    note?: string | null
    createdAt?: Date | string
  }

  export type CustomerLedgerCreateOrConnectWithoutSaleInput = {
    where: CustomerLedgerWhereUniqueInput
    create: XOR<CustomerLedgerCreateWithoutSaleInput, CustomerLedgerUncheckedCreateWithoutSaleInput>
  }

  export type CustomerLedgerCreateManySaleInputEnvelope = {
    data: CustomerLedgerCreateManySaleInput | CustomerLedgerCreateManySaleInput[]
    skipDuplicates?: boolean
  }

  export type UrdPurchaseCreateWithoutSaleInput = {
    purchaseNumber: string
    purchaseDate?: Date | string
    metal?: $Enums.MetalType
    purity?: string | null
    grossWeight?: Decimal | DecimalJsLike | number | string
    netWeight?: Decimal | DecimalJsLike | number | string
    ratePerGram?: Decimal | DecimalJsLike | number | string
    totalAmount?: Decimal | DecimalJsLike | number | string
    saleOffset?: Decimal | DecimalJsLike | number | string
    paid?: Decimal | DecimalJsLike | number | string
    paymentMethod?: $Enums.PaymentMethod
    description?: string | null
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    customer: CustomerCreateNestedOneWithoutUrdPurchasesInput
  }

  export type UrdPurchaseUncheckedCreateWithoutSaleInput = {
    id?: number
    purchaseNumber: string
    customerId: number
    purchaseDate?: Date | string
    metal?: $Enums.MetalType
    purity?: string | null
    grossWeight?: Decimal | DecimalJsLike | number | string
    netWeight?: Decimal | DecimalJsLike | number | string
    ratePerGram?: Decimal | DecimalJsLike | number | string
    totalAmount?: Decimal | DecimalJsLike | number | string
    saleOffset?: Decimal | DecimalJsLike | number | string
    paid?: Decimal | DecimalJsLike | number | string
    paymentMethod?: $Enums.PaymentMethod
    description?: string | null
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UrdPurchaseCreateOrConnectWithoutSaleInput = {
    where: UrdPurchaseWhereUniqueInput
    create: XOR<UrdPurchaseCreateWithoutSaleInput, UrdPurchaseUncheckedCreateWithoutSaleInput>
  }

  export type CustomerUpsertWithoutSalesInput = {
    update: XOR<CustomerUpdateWithoutSalesInput, CustomerUncheckedUpdateWithoutSalesInput>
    create: XOR<CustomerCreateWithoutSalesInput, CustomerUncheckedCreateWithoutSalesInput>
    where?: CustomerWhereInput
  }

  export type CustomerUpdateToOneWithWhereWithoutSalesInput = {
    where?: CustomerWhereInput
    data: XOR<CustomerUpdateWithoutSalesInput, CustomerUncheckedUpdateWithoutSalesInput>
  }

  export type CustomerUpdateWithoutSalesInput = {
    name?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    repairs?: RepairUpdateManyWithoutCustomerNestedInput
    ledger?: CustomerLedgerUpdateManyWithoutCustomerNestedInput
    urdPurchases?: UrdPurchaseUpdateManyWithoutCustomerNestedInput
    cashbookEntries?: CashbookEntryUpdateManyWithoutCustomerNestedInput
  }

  export type CustomerUncheckedUpdateWithoutSalesInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    repairs?: RepairUncheckedUpdateManyWithoutCustomerNestedInput
    ledger?: CustomerLedgerUncheckedUpdateManyWithoutCustomerNestedInput
    urdPurchases?: UrdPurchaseUncheckedUpdateManyWithoutCustomerNestedInput
    cashbookEntries?: CashbookEntryUncheckedUpdateManyWithoutCustomerNestedInput
  }

  export type SaleItemUpsertWithWhereUniqueWithoutSaleInput = {
    where: SaleItemWhereUniqueInput
    update: XOR<SaleItemUpdateWithoutSaleInput, SaleItemUncheckedUpdateWithoutSaleInput>
    create: XOR<SaleItemCreateWithoutSaleInput, SaleItemUncheckedCreateWithoutSaleInput>
  }

  export type SaleItemUpdateWithWhereUniqueWithoutSaleInput = {
    where: SaleItemWhereUniqueInput
    data: XOR<SaleItemUpdateWithoutSaleInput, SaleItemUncheckedUpdateWithoutSaleInput>
  }

  export type SaleItemUpdateManyWithWhereWithoutSaleInput = {
    where: SaleItemScalarWhereInput
    data: XOR<SaleItemUpdateManyMutationInput, SaleItemUncheckedUpdateManyWithoutSaleInput>
  }

  export type CustomerLedgerUpsertWithWhereUniqueWithoutSaleInput = {
    where: CustomerLedgerWhereUniqueInput
    update: XOR<CustomerLedgerUpdateWithoutSaleInput, CustomerLedgerUncheckedUpdateWithoutSaleInput>
    create: XOR<CustomerLedgerCreateWithoutSaleInput, CustomerLedgerUncheckedCreateWithoutSaleInput>
  }

  export type CustomerLedgerUpdateWithWhereUniqueWithoutSaleInput = {
    where: CustomerLedgerWhereUniqueInput
    data: XOR<CustomerLedgerUpdateWithoutSaleInput, CustomerLedgerUncheckedUpdateWithoutSaleInput>
  }

  export type CustomerLedgerUpdateManyWithWhereWithoutSaleInput = {
    where: CustomerLedgerScalarWhereInput
    data: XOR<CustomerLedgerUpdateManyMutationInput, CustomerLedgerUncheckedUpdateManyWithoutSaleInput>
  }

  export type UrdPurchaseUpsertWithoutSaleInput = {
    update: XOR<UrdPurchaseUpdateWithoutSaleInput, UrdPurchaseUncheckedUpdateWithoutSaleInput>
    create: XOR<UrdPurchaseCreateWithoutSaleInput, UrdPurchaseUncheckedCreateWithoutSaleInput>
    where?: UrdPurchaseWhereInput
  }

  export type UrdPurchaseUpdateToOneWithWhereWithoutSaleInput = {
    where?: UrdPurchaseWhereInput
    data: XOR<UrdPurchaseUpdateWithoutSaleInput, UrdPurchaseUncheckedUpdateWithoutSaleInput>
  }

  export type UrdPurchaseUpdateWithoutSaleInput = {
    purchaseNumber?: StringFieldUpdateOperationsInput | string
    purchaseDate?: DateTimeFieldUpdateOperationsInput | Date | string
    metal?: EnumMetalTypeFieldUpdateOperationsInput | $Enums.MetalType
    purity?: NullableStringFieldUpdateOperationsInput | string | null
    grossWeight?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    netWeight?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    ratePerGram?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    saleOffset?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    paid?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    paymentMethod?: EnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod
    description?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    customer?: CustomerUpdateOneRequiredWithoutUrdPurchasesNestedInput
  }

  export type UrdPurchaseUncheckedUpdateWithoutSaleInput = {
    id?: IntFieldUpdateOperationsInput | number
    purchaseNumber?: StringFieldUpdateOperationsInput | string
    customerId?: IntFieldUpdateOperationsInput | number
    purchaseDate?: DateTimeFieldUpdateOperationsInput | Date | string
    metal?: EnumMetalTypeFieldUpdateOperationsInput | $Enums.MetalType
    purity?: NullableStringFieldUpdateOperationsInput | string | null
    grossWeight?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    netWeight?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    ratePerGram?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    saleOffset?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    paid?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    paymentMethod?: EnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod
    description?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SaleCreateWithoutItemsInput = {
    invoiceNumber: string
    saleDate?: Date | string
    subtotal?: Decimal | DecimalJsLike | number | string
    discount?: Decimal | DecimalJsLike | number | string
    gstRate?: Decimal | DecimalJsLike | number | string
    gstAmount?: Decimal | DecimalJsLike | number | string
    total?: Decimal | DecimalJsLike | number | string
    urdOffset?: Decimal | DecimalJsLike | number | string
    paid?: Decimal | DecimalJsLike | number | string
    cashPaid?: Decimal | DecimalJsLike | number | string
    upiPaid?: Decimal | DecimalJsLike | number | string
    balance?: Decimal | DecimalJsLike | number | string
    paymentMethod?: $Enums.PaymentMethod
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    customer?: CustomerCreateNestedOneWithoutSalesInput
    ledgerEntries?: CustomerLedgerCreateNestedManyWithoutSaleInput
    urdPurchase?: UrdPurchaseCreateNestedOneWithoutSaleInput
  }

  export type SaleUncheckedCreateWithoutItemsInput = {
    id?: number
    invoiceNumber: string
    customerId?: number | null
    saleDate?: Date | string
    subtotal?: Decimal | DecimalJsLike | number | string
    discount?: Decimal | DecimalJsLike | number | string
    gstRate?: Decimal | DecimalJsLike | number | string
    gstAmount?: Decimal | DecimalJsLike | number | string
    total?: Decimal | DecimalJsLike | number | string
    urdOffset?: Decimal | DecimalJsLike | number | string
    paid?: Decimal | DecimalJsLike | number | string
    cashPaid?: Decimal | DecimalJsLike | number | string
    upiPaid?: Decimal | DecimalJsLike | number | string
    balance?: Decimal | DecimalJsLike | number | string
    paymentMethod?: $Enums.PaymentMethod
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    ledgerEntries?: CustomerLedgerUncheckedCreateNestedManyWithoutSaleInput
    urdPurchase?: UrdPurchaseUncheckedCreateNestedOneWithoutSaleInput
  }

  export type SaleCreateOrConnectWithoutItemsInput = {
    where: SaleWhereUniqueInput
    create: XOR<SaleCreateWithoutItemsInput, SaleUncheckedCreateWithoutItemsInput>
  }

  export type ProductCreateWithoutSaleItemsInput = {
    barcode?: string | null
    sku: string
    name: string
    category: string
    metal?: $Enums.MetalType
    purity?: string | null
    grossWeight?: Decimal | DecimalJsLike | number | string
    stoneWeight?: Decimal | DecimalJsLike | number | string
    netWeight?: Decimal | DecimalJsLike | number | string
    quantity?: number
    reorderLevel?: number
    purchasePrice?: Decimal | DecimalJsLike | number | string
    sellingPrice?: Decimal | DecimalJsLike | number | string
    makingChargePerGram?: Decimal | DecimalJsLike | number | string
    makingChargeType?: $Enums.MakingChargeType
    makingChargeValue?: Decimal | DecimalJsLike | number | string
    location?: string | null
    notes?: string | null
    status?: $Enums.ProductStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    purchaseItems?: PurchaseItemCreateNestedManyWithoutProductInput
    movements?: StockMovementCreateNestedManyWithoutProductInput
  }

  export type ProductUncheckedCreateWithoutSaleItemsInput = {
    id?: number
    barcode?: string | null
    sku: string
    name: string
    category: string
    metal?: $Enums.MetalType
    purity?: string | null
    grossWeight?: Decimal | DecimalJsLike | number | string
    stoneWeight?: Decimal | DecimalJsLike | number | string
    netWeight?: Decimal | DecimalJsLike | number | string
    quantity?: number
    reorderLevel?: number
    purchasePrice?: Decimal | DecimalJsLike | number | string
    sellingPrice?: Decimal | DecimalJsLike | number | string
    makingChargePerGram?: Decimal | DecimalJsLike | number | string
    makingChargeType?: $Enums.MakingChargeType
    makingChargeValue?: Decimal | DecimalJsLike | number | string
    location?: string | null
    notes?: string | null
    status?: $Enums.ProductStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    purchaseItems?: PurchaseItemUncheckedCreateNestedManyWithoutProductInput
    movements?: StockMovementUncheckedCreateNestedManyWithoutProductInput
  }

  export type ProductCreateOrConnectWithoutSaleItemsInput = {
    where: ProductWhereUniqueInput
    create: XOR<ProductCreateWithoutSaleItemsInput, ProductUncheckedCreateWithoutSaleItemsInput>
  }

  export type SaleUpsertWithoutItemsInput = {
    update: XOR<SaleUpdateWithoutItemsInput, SaleUncheckedUpdateWithoutItemsInput>
    create: XOR<SaleCreateWithoutItemsInput, SaleUncheckedCreateWithoutItemsInput>
    where?: SaleWhereInput
  }

  export type SaleUpdateToOneWithWhereWithoutItemsInput = {
    where?: SaleWhereInput
    data: XOR<SaleUpdateWithoutItemsInput, SaleUncheckedUpdateWithoutItemsInput>
  }

  export type SaleUpdateWithoutItemsInput = {
    invoiceNumber?: StringFieldUpdateOperationsInput | string
    saleDate?: DateTimeFieldUpdateOperationsInput | Date | string
    subtotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    discount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    gstRate?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    gstAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    total?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    urdOffset?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    paid?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    cashPaid?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    upiPaid?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    balance?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    paymentMethod?: EnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    customer?: CustomerUpdateOneWithoutSalesNestedInput
    ledgerEntries?: CustomerLedgerUpdateManyWithoutSaleNestedInput
    urdPurchase?: UrdPurchaseUpdateOneWithoutSaleNestedInput
  }

  export type SaleUncheckedUpdateWithoutItemsInput = {
    id?: IntFieldUpdateOperationsInput | number
    invoiceNumber?: StringFieldUpdateOperationsInput | string
    customerId?: NullableIntFieldUpdateOperationsInput | number | null
    saleDate?: DateTimeFieldUpdateOperationsInput | Date | string
    subtotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    discount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    gstRate?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    gstAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    total?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    urdOffset?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    paid?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    cashPaid?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    upiPaid?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    balance?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    paymentMethod?: EnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ledgerEntries?: CustomerLedgerUncheckedUpdateManyWithoutSaleNestedInput
    urdPurchase?: UrdPurchaseUncheckedUpdateOneWithoutSaleNestedInput
  }

  export type ProductUpsertWithoutSaleItemsInput = {
    update: XOR<ProductUpdateWithoutSaleItemsInput, ProductUncheckedUpdateWithoutSaleItemsInput>
    create: XOR<ProductCreateWithoutSaleItemsInput, ProductUncheckedCreateWithoutSaleItemsInput>
    where?: ProductWhereInput
  }

  export type ProductUpdateToOneWithWhereWithoutSaleItemsInput = {
    where?: ProductWhereInput
    data: XOR<ProductUpdateWithoutSaleItemsInput, ProductUncheckedUpdateWithoutSaleItemsInput>
  }

  export type ProductUpdateWithoutSaleItemsInput = {
    barcode?: NullableStringFieldUpdateOperationsInput | string | null
    sku?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    metal?: EnumMetalTypeFieldUpdateOperationsInput | $Enums.MetalType
    purity?: NullableStringFieldUpdateOperationsInput | string | null
    grossWeight?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    stoneWeight?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    netWeight?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    quantity?: IntFieldUpdateOperationsInput | number
    reorderLevel?: IntFieldUpdateOperationsInput | number
    purchasePrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    sellingPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    makingChargePerGram?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    makingChargeType?: EnumMakingChargeTypeFieldUpdateOperationsInput | $Enums.MakingChargeType
    makingChargeValue?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    location?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumProductStatusFieldUpdateOperationsInput | $Enums.ProductStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    purchaseItems?: PurchaseItemUpdateManyWithoutProductNestedInput
    movements?: StockMovementUpdateManyWithoutProductNestedInput
  }

  export type ProductUncheckedUpdateWithoutSaleItemsInput = {
    id?: IntFieldUpdateOperationsInput | number
    barcode?: NullableStringFieldUpdateOperationsInput | string | null
    sku?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    metal?: EnumMetalTypeFieldUpdateOperationsInput | $Enums.MetalType
    purity?: NullableStringFieldUpdateOperationsInput | string | null
    grossWeight?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    stoneWeight?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    netWeight?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    quantity?: IntFieldUpdateOperationsInput | number
    reorderLevel?: IntFieldUpdateOperationsInput | number
    purchasePrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    sellingPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    makingChargePerGram?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    makingChargeType?: EnumMakingChargeTypeFieldUpdateOperationsInput | $Enums.MakingChargeType
    makingChargeValue?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    location?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumProductStatusFieldUpdateOperationsInput | $Enums.ProductStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    purchaseItems?: PurchaseItemUncheckedUpdateManyWithoutProductNestedInput
    movements?: StockMovementUncheckedUpdateManyWithoutProductNestedInput
  }

  export type CustomerCreateWithoutLedgerInput = {
    name: string
    phone?: string | null
    email?: string | null
    address?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    sales?: SaleCreateNestedManyWithoutCustomerInput
    repairs?: RepairCreateNestedManyWithoutCustomerInput
    urdPurchases?: UrdPurchaseCreateNestedManyWithoutCustomerInput
    cashbookEntries?: CashbookEntryCreateNestedManyWithoutCustomerInput
  }

  export type CustomerUncheckedCreateWithoutLedgerInput = {
    id?: number
    name: string
    phone?: string | null
    email?: string | null
    address?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    sales?: SaleUncheckedCreateNestedManyWithoutCustomerInput
    repairs?: RepairUncheckedCreateNestedManyWithoutCustomerInput
    urdPurchases?: UrdPurchaseUncheckedCreateNestedManyWithoutCustomerInput
    cashbookEntries?: CashbookEntryUncheckedCreateNestedManyWithoutCustomerInput
  }

  export type CustomerCreateOrConnectWithoutLedgerInput = {
    where: CustomerWhereUniqueInput
    create: XOR<CustomerCreateWithoutLedgerInput, CustomerUncheckedCreateWithoutLedgerInput>
  }

  export type SaleCreateWithoutLedgerEntriesInput = {
    invoiceNumber: string
    saleDate?: Date | string
    subtotal?: Decimal | DecimalJsLike | number | string
    discount?: Decimal | DecimalJsLike | number | string
    gstRate?: Decimal | DecimalJsLike | number | string
    gstAmount?: Decimal | DecimalJsLike | number | string
    total?: Decimal | DecimalJsLike | number | string
    urdOffset?: Decimal | DecimalJsLike | number | string
    paid?: Decimal | DecimalJsLike | number | string
    cashPaid?: Decimal | DecimalJsLike | number | string
    upiPaid?: Decimal | DecimalJsLike | number | string
    balance?: Decimal | DecimalJsLike | number | string
    paymentMethod?: $Enums.PaymentMethod
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    customer?: CustomerCreateNestedOneWithoutSalesInput
    items?: SaleItemCreateNestedManyWithoutSaleInput
    urdPurchase?: UrdPurchaseCreateNestedOneWithoutSaleInput
  }

  export type SaleUncheckedCreateWithoutLedgerEntriesInput = {
    id?: number
    invoiceNumber: string
    customerId?: number | null
    saleDate?: Date | string
    subtotal?: Decimal | DecimalJsLike | number | string
    discount?: Decimal | DecimalJsLike | number | string
    gstRate?: Decimal | DecimalJsLike | number | string
    gstAmount?: Decimal | DecimalJsLike | number | string
    total?: Decimal | DecimalJsLike | number | string
    urdOffset?: Decimal | DecimalJsLike | number | string
    paid?: Decimal | DecimalJsLike | number | string
    cashPaid?: Decimal | DecimalJsLike | number | string
    upiPaid?: Decimal | DecimalJsLike | number | string
    balance?: Decimal | DecimalJsLike | number | string
    paymentMethod?: $Enums.PaymentMethod
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    items?: SaleItemUncheckedCreateNestedManyWithoutSaleInput
    urdPurchase?: UrdPurchaseUncheckedCreateNestedOneWithoutSaleInput
  }

  export type SaleCreateOrConnectWithoutLedgerEntriesInput = {
    where: SaleWhereUniqueInput
    create: XOR<SaleCreateWithoutLedgerEntriesInput, SaleUncheckedCreateWithoutLedgerEntriesInput>
  }

  export type CustomerUpsertWithoutLedgerInput = {
    update: XOR<CustomerUpdateWithoutLedgerInput, CustomerUncheckedUpdateWithoutLedgerInput>
    create: XOR<CustomerCreateWithoutLedgerInput, CustomerUncheckedCreateWithoutLedgerInput>
    where?: CustomerWhereInput
  }

  export type CustomerUpdateToOneWithWhereWithoutLedgerInput = {
    where?: CustomerWhereInput
    data: XOR<CustomerUpdateWithoutLedgerInput, CustomerUncheckedUpdateWithoutLedgerInput>
  }

  export type CustomerUpdateWithoutLedgerInput = {
    name?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sales?: SaleUpdateManyWithoutCustomerNestedInput
    repairs?: RepairUpdateManyWithoutCustomerNestedInput
    urdPurchases?: UrdPurchaseUpdateManyWithoutCustomerNestedInput
    cashbookEntries?: CashbookEntryUpdateManyWithoutCustomerNestedInput
  }

  export type CustomerUncheckedUpdateWithoutLedgerInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sales?: SaleUncheckedUpdateManyWithoutCustomerNestedInput
    repairs?: RepairUncheckedUpdateManyWithoutCustomerNestedInput
    urdPurchases?: UrdPurchaseUncheckedUpdateManyWithoutCustomerNestedInput
    cashbookEntries?: CashbookEntryUncheckedUpdateManyWithoutCustomerNestedInput
  }

  export type SaleUpsertWithoutLedgerEntriesInput = {
    update: XOR<SaleUpdateWithoutLedgerEntriesInput, SaleUncheckedUpdateWithoutLedgerEntriesInput>
    create: XOR<SaleCreateWithoutLedgerEntriesInput, SaleUncheckedCreateWithoutLedgerEntriesInput>
    where?: SaleWhereInput
  }

  export type SaleUpdateToOneWithWhereWithoutLedgerEntriesInput = {
    where?: SaleWhereInput
    data: XOR<SaleUpdateWithoutLedgerEntriesInput, SaleUncheckedUpdateWithoutLedgerEntriesInput>
  }

  export type SaleUpdateWithoutLedgerEntriesInput = {
    invoiceNumber?: StringFieldUpdateOperationsInput | string
    saleDate?: DateTimeFieldUpdateOperationsInput | Date | string
    subtotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    discount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    gstRate?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    gstAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    total?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    urdOffset?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    paid?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    cashPaid?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    upiPaid?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    balance?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    paymentMethod?: EnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    customer?: CustomerUpdateOneWithoutSalesNestedInput
    items?: SaleItemUpdateManyWithoutSaleNestedInput
    urdPurchase?: UrdPurchaseUpdateOneWithoutSaleNestedInput
  }

  export type SaleUncheckedUpdateWithoutLedgerEntriesInput = {
    id?: IntFieldUpdateOperationsInput | number
    invoiceNumber?: StringFieldUpdateOperationsInput | string
    customerId?: NullableIntFieldUpdateOperationsInput | number | null
    saleDate?: DateTimeFieldUpdateOperationsInput | Date | string
    subtotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    discount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    gstRate?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    gstAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    total?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    urdOffset?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    paid?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    cashPaid?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    upiPaid?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    balance?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    paymentMethod?: EnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    items?: SaleItemUncheckedUpdateManyWithoutSaleNestedInput
    urdPurchase?: UrdPurchaseUncheckedUpdateOneWithoutSaleNestedInput
  }

  export type CustomerCreateWithoutRepairsInput = {
    name: string
    phone?: string | null
    email?: string | null
    address?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    sales?: SaleCreateNestedManyWithoutCustomerInput
    ledger?: CustomerLedgerCreateNestedManyWithoutCustomerInput
    urdPurchases?: UrdPurchaseCreateNestedManyWithoutCustomerInput
    cashbookEntries?: CashbookEntryCreateNestedManyWithoutCustomerInput
  }

  export type CustomerUncheckedCreateWithoutRepairsInput = {
    id?: number
    name: string
    phone?: string | null
    email?: string | null
    address?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    sales?: SaleUncheckedCreateNestedManyWithoutCustomerInput
    ledger?: CustomerLedgerUncheckedCreateNestedManyWithoutCustomerInput
    urdPurchases?: UrdPurchaseUncheckedCreateNestedManyWithoutCustomerInput
    cashbookEntries?: CashbookEntryUncheckedCreateNestedManyWithoutCustomerInput
  }

  export type CustomerCreateOrConnectWithoutRepairsInput = {
    where: CustomerWhereUniqueInput
    create: XOR<CustomerCreateWithoutRepairsInput, CustomerUncheckedCreateWithoutRepairsInput>
  }

  export type CustomerUpsertWithoutRepairsInput = {
    update: XOR<CustomerUpdateWithoutRepairsInput, CustomerUncheckedUpdateWithoutRepairsInput>
    create: XOR<CustomerCreateWithoutRepairsInput, CustomerUncheckedCreateWithoutRepairsInput>
    where?: CustomerWhereInput
  }

  export type CustomerUpdateToOneWithWhereWithoutRepairsInput = {
    where?: CustomerWhereInput
    data: XOR<CustomerUpdateWithoutRepairsInput, CustomerUncheckedUpdateWithoutRepairsInput>
  }

  export type CustomerUpdateWithoutRepairsInput = {
    name?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sales?: SaleUpdateManyWithoutCustomerNestedInput
    ledger?: CustomerLedgerUpdateManyWithoutCustomerNestedInput
    urdPurchases?: UrdPurchaseUpdateManyWithoutCustomerNestedInput
    cashbookEntries?: CashbookEntryUpdateManyWithoutCustomerNestedInput
  }

  export type CustomerUncheckedUpdateWithoutRepairsInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sales?: SaleUncheckedUpdateManyWithoutCustomerNestedInput
    ledger?: CustomerLedgerUncheckedUpdateManyWithoutCustomerNestedInput
    urdPurchases?: UrdPurchaseUncheckedUpdateManyWithoutCustomerNestedInput
    cashbookEntries?: CashbookEntryUncheckedUpdateManyWithoutCustomerNestedInput
  }

  export type CustomerCreateWithoutCashbookEntriesInput = {
    name: string
    phone?: string | null
    email?: string | null
    address?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    sales?: SaleCreateNestedManyWithoutCustomerInput
    repairs?: RepairCreateNestedManyWithoutCustomerInput
    ledger?: CustomerLedgerCreateNestedManyWithoutCustomerInput
    urdPurchases?: UrdPurchaseCreateNestedManyWithoutCustomerInput
  }

  export type CustomerUncheckedCreateWithoutCashbookEntriesInput = {
    id?: number
    name: string
    phone?: string | null
    email?: string | null
    address?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    sales?: SaleUncheckedCreateNestedManyWithoutCustomerInput
    repairs?: RepairUncheckedCreateNestedManyWithoutCustomerInput
    ledger?: CustomerLedgerUncheckedCreateNestedManyWithoutCustomerInput
    urdPurchases?: UrdPurchaseUncheckedCreateNestedManyWithoutCustomerInput
  }

  export type CustomerCreateOrConnectWithoutCashbookEntriesInput = {
    where: CustomerWhereUniqueInput
    create: XOR<CustomerCreateWithoutCashbookEntriesInput, CustomerUncheckedCreateWithoutCashbookEntriesInput>
  }

  export type CustomerUpsertWithoutCashbookEntriesInput = {
    update: XOR<CustomerUpdateWithoutCashbookEntriesInput, CustomerUncheckedUpdateWithoutCashbookEntriesInput>
    create: XOR<CustomerCreateWithoutCashbookEntriesInput, CustomerUncheckedCreateWithoutCashbookEntriesInput>
    where?: CustomerWhereInput
  }

  export type CustomerUpdateToOneWithWhereWithoutCashbookEntriesInput = {
    where?: CustomerWhereInput
    data: XOR<CustomerUpdateWithoutCashbookEntriesInput, CustomerUncheckedUpdateWithoutCashbookEntriesInput>
  }

  export type CustomerUpdateWithoutCashbookEntriesInput = {
    name?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sales?: SaleUpdateManyWithoutCustomerNestedInput
    repairs?: RepairUpdateManyWithoutCustomerNestedInput
    ledger?: CustomerLedgerUpdateManyWithoutCustomerNestedInput
    urdPurchases?: UrdPurchaseUpdateManyWithoutCustomerNestedInput
  }

  export type CustomerUncheckedUpdateWithoutCashbookEntriesInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sales?: SaleUncheckedUpdateManyWithoutCustomerNestedInput
    repairs?: RepairUncheckedUpdateManyWithoutCustomerNestedInput
    ledger?: CustomerLedgerUncheckedUpdateManyWithoutCustomerNestedInput
    urdPurchases?: UrdPurchaseUncheckedUpdateManyWithoutCustomerNestedInput
  }

  export type CustomerCreateWithoutUrdPurchasesInput = {
    name: string
    phone?: string | null
    email?: string | null
    address?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    sales?: SaleCreateNestedManyWithoutCustomerInput
    repairs?: RepairCreateNestedManyWithoutCustomerInput
    ledger?: CustomerLedgerCreateNestedManyWithoutCustomerInput
    cashbookEntries?: CashbookEntryCreateNestedManyWithoutCustomerInput
  }

  export type CustomerUncheckedCreateWithoutUrdPurchasesInput = {
    id?: number
    name: string
    phone?: string | null
    email?: string | null
    address?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    sales?: SaleUncheckedCreateNestedManyWithoutCustomerInput
    repairs?: RepairUncheckedCreateNestedManyWithoutCustomerInput
    ledger?: CustomerLedgerUncheckedCreateNestedManyWithoutCustomerInput
    cashbookEntries?: CashbookEntryUncheckedCreateNestedManyWithoutCustomerInput
  }

  export type CustomerCreateOrConnectWithoutUrdPurchasesInput = {
    where: CustomerWhereUniqueInput
    create: XOR<CustomerCreateWithoutUrdPurchasesInput, CustomerUncheckedCreateWithoutUrdPurchasesInput>
  }

  export type SaleCreateWithoutUrdPurchaseInput = {
    invoiceNumber: string
    saleDate?: Date | string
    subtotal?: Decimal | DecimalJsLike | number | string
    discount?: Decimal | DecimalJsLike | number | string
    gstRate?: Decimal | DecimalJsLike | number | string
    gstAmount?: Decimal | DecimalJsLike | number | string
    total?: Decimal | DecimalJsLike | number | string
    urdOffset?: Decimal | DecimalJsLike | number | string
    paid?: Decimal | DecimalJsLike | number | string
    cashPaid?: Decimal | DecimalJsLike | number | string
    upiPaid?: Decimal | DecimalJsLike | number | string
    balance?: Decimal | DecimalJsLike | number | string
    paymentMethod?: $Enums.PaymentMethod
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    customer?: CustomerCreateNestedOneWithoutSalesInput
    items?: SaleItemCreateNestedManyWithoutSaleInput
    ledgerEntries?: CustomerLedgerCreateNestedManyWithoutSaleInput
  }

  export type SaleUncheckedCreateWithoutUrdPurchaseInput = {
    id?: number
    invoiceNumber: string
    customerId?: number | null
    saleDate?: Date | string
    subtotal?: Decimal | DecimalJsLike | number | string
    discount?: Decimal | DecimalJsLike | number | string
    gstRate?: Decimal | DecimalJsLike | number | string
    gstAmount?: Decimal | DecimalJsLike | number | string
    total?: Decimal | DecimalJsLike | number | string
    urdOffset?: Decimal | DecimalJsLike | number | string
    paid?: Decimal | DecimalJsLike | number | string
    cashPaid?: Decimal | DecimalJsLike | number | string
    upiPaid?: Decimal | DecimalJsLike | number | string
    balance?: Decimal | DecimalJsLike | number | string
    paymentMethod?: $Enums.PaymentMethod
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    items?: SaleItemUncheckedCreateNestedManyWithoutSaleInput
    ledgerEntries?: CustomerLedgerUncheckedCreateNestedManyWithoutSaleInput
  }

  export type SaleCreateOrConnectWithoutUrdPurchaseInput = {
    where: SaleWhereUniqueInput
    create: XOR<SaleCreateWithoutUrdPurchaseInput, SaleUncheckedCreateWithoutUrdPurchaseInput>
  }

  export type CustomerUpsertWithoutUrdPurchasesInput = {
    update: XOR<CustomerUpdateWithoutUrdPurchasesInput, CustomerUncheckedUpdateWithoutUrdPurchasesInput>
    create: XOR<CustomerCreateWithoutUrdPurchasesInput, CustomerUncheckedCreateWithoutUrdPurchasesInput>
    where?: CustomerWhereInput
  }

  export type CustomerUpdateToOneWithWhereWithoutUrdPurchasesInput = {
    where?: CustomerWhereInput
    data: XOR<CustomerUpdateWithoutUrdPurchasesInput, CustomerUncheckedUpdateWithoutUrdPurchasesInput>
  }

  export type CustomerUpdateWithoutUrdPurchasesInput = {
    name?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sales?: SaleUpdateManyWithoutCustomerNestedInput
    repairs?: RepairUpdateManyWithoutCustomerNestedInput
    ledger?: CustomerLedgerUpdateManyWithoutCustomerNestedInput
    cashbookEntries?: CashbookEntryUpdateManyWithoutCustomerNestedInput
  }

  export type CustomerUncheckedUpdateWithoutUrdPurchasesInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sales?: SaleUncheckedUpdateManyWithoutCustomerNestedInput
    repairs?: RepairUncheckedUpdateManyWithoutCustomerNestedInput
    ledger?: CustomerLedgerUncheckedUpdateManyWithoutCustomerNestedInput
    cashbookEntries?: CashbookEntryUncheckedUpdateManyWithoutCustomerNestedInput
  }

  export type SaleUpsertWithoutUrdPurchaseInput = {
    update: XOR<SaleUpdateWithoutUrdPurchaseInput, SaleUncheckedUpdateWithoutUrdPurchaseInput>
    create: XOR<SaleCreateWithoutUrdPurchaseInput, SaleUncheckedCreateWithoutUrdPurchaseInput>
    where?: SaleWhereInput
  }

  export type SaleUpdateToOneWithWhereWithoutUrdPurchaseInput = {
    where?: SaleWhereInput
    data: XOR<SaleUpdateWithoutUrdPurchaseInput, SaleUncheckedUpdateWithoutUrdPurchaseInput>
  }

  export type SaleUpdateWithoutUrdPurchaseInput = {
    invoiceNumber?: StringFieldUpdateOperationsInput | string
    saleDate?: DateTimeFieldUpdateOperationsInput | Date | string
    subtotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    discount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    gstRate?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    gstAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    total?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    urdOffset?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    paid?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    cashPaid?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    upiPaid?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    balance?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    paymentMethod?: EnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    customer?: CustomerUpdateOneWithoutSalesNestedInput
    items?: SaleItemUpdateManyWithoutSaleNestedInput
    ledgerEntries?: CustomerLedgerUpdateManyWithoutSaleNestedInput
  }

  export type SaleUncheckedUpdateWithoutUrdPurchaseInput = {
    id?: IntFieldUpdateOperationsInput | number
    invoiceNumber?: StringFieldUpdateOperationsInput | string
    customerId?: NullableIntFieldUpdateOperationsInput | number | null
    saleDate?: DateTimeFieldUpdateOperationsInput | Date | string
    subtotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    discount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    gstRate?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    gstAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    total?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    urdOffset?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    paid?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    cashPaid?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    upiPaid?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    balance?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    paymentMethod?: EnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    items?: SaleItemUncheckedUpdateManyWithoutSaleNestedInput
    ledgerEntries?: CustomerLedgerUncheckedUpdateManyWithoutSaleNestedInput
  }

  export type SaleCreateManyCustomerInput = {
    id?: number
    invoiceNumber: string
    saleDate?: Date | string
    subtotal?: Decimal | DecimalJsLike | number | string
    discount?: Decimal | DecimalJsLike | number | string
    gstRate?: Decimal | DecimalJsLike | number | string
    gstAmount?: Decimal | DecimalJsLike | number | string
    total?: Decimal | DecimalJsLike | number | string
    urdOffset?: Decimal | DecimalJsLike | number | string
    paid?: Decimal | DecimalJsLike | number | string
    cashPaid?: Decimal | DecimalJsLike | number | string
    upiPaid?: Decimal | DecimalJsLike | number | string
    balance?: Decimal | DecimalJsLike | number | string
    paymentMethod?: $Enums.PaymentMethod
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type RepairCreateManyCustomerInput = {
    id?: number
    repairNumber: string
    itemDescription: string
    metal?: $Enums.MetalType | null
    grossWeight?: Decimal | DecimalJsLike | number | string | null
    issueDescription?: string | null
    estimatedCharge?: Decimal | DecimalJsLike | number | string
    finalCharge?: Decimal | DecimalJsLike | number | string | null
    advancePaid?: Decimal | DecimalJsLike | number | string
    advancePaymentMethod?: $Enums.PaymentMethod
    dueDate?: Date | string | null
    status?: $Enums.RepairStatus
    receivedAt?: Date | string
    deliveredAt?: Date | string | null
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CustomerLedgerCreateManyCustomerInput = {
    id?: number
    saleId?: number | null
    type: $Enums.LedgerEntryType
    amount: Decimal | DecimalJsLike | number | string
    paymentMethod?: $Enums.PaymentMethod | null
    reference?: string | null
    note?: string | null
    createdAt?: Date | string
  }

  export type UrdPurchaseCreateManyCustomerInput = {
    id?: number
    purchaseNumber: string
    purchaseDate?: Date | string
    metal?: $Enums.MetalType
    purity?: string | null
    grossWeight?: Decimal | DecimalJsLike | number | string
    netWeight?: Decimal | DecimalJsLike | number | string
    ratePerGram?: Decimal | DecimalJsLike | number | string
    totalAmount?: Decimal | DecimalJsLike | number | string
    saleOffset?: Decimal | DecimalJsLike | number | string
    paid?: Decimal | DecimalJsLike | number | string
    paymentMethod?: $Enums.PaymentMethod
    description?: string | null
    notes?: string | null
    saleId?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CashbookEntryCreateManyCustomerInput = {
    id?: number
    entryDate: string
    type: $Enums.CashbookType
    paymentMethod: $Enums.PaymentMethod
    description: string
    amount: Decimal | DecimalJsLike | number | string
    reference?: string | null
    notes?: string | null
    syncLedger?: boolean
    createdAt?: Date | string
  }

  export type SaleUpdateWithoutCustomerInput = {
    invoiceNumber?: StringFieldUpdateOperationsInput | string
    saleDate?: DateTimeFieldUpdateOperationsInput | Date | string
    subtotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    discount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    gstRate?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    gstAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    total?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    urdOffset?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    paid?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    cashPaid?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    upiPaid?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    balance?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    paymentMethod?: EnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    items?: SaleItemUpdateManyWithoutSaleNestedInput
    ledgerEntries?: CustomerLedgerUpdateManyWithoutSaleNestedInput
    urdPurchase?: UrdPurchaseUpdateOneWithoutSaleNestedInput
  }

  export type SaleUncheckedUpdateWithoutCustomerInput = {
    id?: IntFieldUpdateOperationsInput | number
    invoiceNumber?: StringFieldUpdateOperationsInput | string
    saleDate?: DateTimeFieldUpdateOperationsInput | Date | string
    subtotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    discount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    gstRate?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    gstAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    total?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    urdOffset?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    paid?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    cashPaid?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    upiPaid?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    balance?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    paymentMethod?: EnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    items?: SaleItemUncheckedUpdateManyWithoutSaleNestedInput
    ledgerEntries?: CustomerLedgerUncheckedUpdateManyWithoutSaleNestedInput
    urdPurchase?: UrdPurchaseUncheckedUpdateOneWithoutSaleNestedInput
  }

  export type SaleUncheckedUpdateManyWithoutCustomerInput = {
    id?: IntFieldUpdateOperationsInput | number
    invoiceNumber?: StringFieldUpdateOperationsInput | string
    saleDate?: DateTimeFieldUpdateOperationsInput | Date | string
    subtotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    discount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    gstRate?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    gstAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    total?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    urdOffset?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    paid?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    cashPaid?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    upiPaid?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    balance?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    paymentMethod?: EnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RepairUpdateWithoutCustomerInput = {
    repairNumber?: StringFieldUpdateOperationsInput | string
    itemDescription?: StringFieldUpdateOperationsInput | string
    metal?: NullableEnumMetalTypeFieldUpdateOperationsInput | $Enums.MetalType | null
    grossWeight?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    issueDescription?: NullableStringFieldUpdateOperationsInput | string | null
    estimatedCharge?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    finalCharge?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    advancePaid?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    advancePaymentMethod?: EnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod
    dueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumRepairStatusFieldUpdateOperationsInput | $Enums.RepairStatus
    receivedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deliveredAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RepairUncheckedUpdateWithoutCustomerInput = {
    id?: IntFieldUpdateOperationsInput | number
    repairNumber?: StringFieldUpdateOperationsInput | string
    itemDescription?: StringFieldUpdateOperationsInput | string
    metal?: NullableEnumMetalTypeFieldUpdateOperationsInput | $Enums.MetalType | null
    grossWeight?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    issueDescription?: NullableStringFieldUpdateOperationsInput | string | null
    estimatedCharge?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    finalCharge?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    advancePaid?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    advancePaymentMethod?: EnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod
    dueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumRepairStatusFieldUpdateOperationsInput | $Enums.RepairStatus
    receivedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deliveredAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RepairUncheckedUpdateManyWithoutCustomerInput = {
    id?: IntFieldUpdateOperationsInput | number
    repairNumber?: StringFieldUpdateOperationsInput | string
    itemDescription?: StringFieldUpdateOperationsInput | string
    metal?: NullableEnumMetalTypeFieldUpdateOperationsInput | $Enums.MetalType | null
    grossWeight?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    issueDescription?: NullableStringFieldUpdateOperationsInput | string | null
    estimatedCharge?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    finalCharge?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    advancePaid?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    advancePaymentMethod?: EnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod
    dueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumRepairStatusFieldUpdateOperationsInput | $Enums.RepairStatus
    receivedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deliveredAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CustomerLedgerUpdateWithoutCustomerInput = {
    type?: EnumLedgerEntryTypeFieldUpdateOperationsInput | $Enums.LedgerEntryType
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    paymentMethod?: NullableEnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod | null
    reference?: NullableStringFieldUpdateOperationsInput | string | null
    note?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sale?: SaleUpdateOneWithoutLedgerEntriesNestedInput
  }

  export type CustomerLedgerUncheckedUpdateWithoutCustomerInput = {
    id?: IntFieldUpdateOperationsInput | number
    saleId?: NullableIntFieldUpdateOperationsInput | number | null
    type?: EnumLedgerEntryTypeFieldUpdateOperationsInput | $Enums.LedgerEntryType
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    paymentMethod?: NullableEnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod | null
    reference?: NullableStringFieldUpdateOperationsInput | string | null
    note?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CustomerLedgerUncheckedUpdateManyWithoutCustomerInput = {
    id?: IntFieldUpdateOperationsInput | number
    saleId?: NullableIntFieldUpdateOperationsInput | number | null
    type?: EnumLedgerEntryTypeFieldUpdateOperationsInput | $Enums.LedgerEntryType
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    paymentMethod?: NullableEnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod | null
    reference?: NullableStringFieldUpdateOperationsInput | string | null
    note?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UrdPurchaseUpdateWithoutCustomerInput = {
    purchaseNumber?: StringFieldUpdateOperationsInput | string
    purchaseDate?: DateTimeFieldUpdateOperationsInput | Date | string
    metal?: EnumMetalTypeFieldUpdateOperationsInput | $Enums.MetalType
    purity?: NullableStringFieldUpdateOperationsInput | string | null
    grossWeight?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    netWeight?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    ratePerGram?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    saleOffset?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    paid?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    paymentMethod?: EnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod
    description?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sale?: SaleUpdateOneWithoutUrdPurchaseNestedInput
  }

  export type UrdPurchaseUncheckedUpdateWithoutCustomerInput = {
    id?: IntFieldUpdateOperationsInput | number
    purchaseNumber?: StringFieldUpdateOperationsInput | string
    purchaseDate?: DateTimeFieldUpdateOperationsInput | Date | string
    metal?: EnumMetalTypeFieldUpdateOperationsInput | $Enums.MetalType
    purity?: NullableStringFieldUpdateOperationsInput | string | null
    grossWeight?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    netWeight?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    ratePerGram?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    saleOffset?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    paid?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    paymentMethod?: EnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod
    description?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    saleId?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UrdPurchaseUncheckedUpdateManyWithoutCustomerInput = {
    id?: IntFieldUpdateOperationsInput | number
    purchaseNumber?: StringFieldUpdateOperationsInput | string
    purchaseDate?: DateTimeFieldUpdateOperationsInput | Date | string
    metal?: EnumMetalTypeFieldUpdateOperationsInput | $Enums.MetalType
    purity?: NullableStringFieldUpdateOperationsInput | string | null
    grossWeight?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    netWeight?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    ratePerGram?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    saleOffset?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    paid?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    paymentMethod?: EnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod
    description?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    saleId?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CashbookEntryUpdateWithoutCustomerInput = {
    entryDate?: StringFieldUpdateOperationsInput | string
    type?: EnumCashbookTypeFieldUpdateOperationsInput | $Enums.CashbookType
    paymentMethod?: EnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod
    description?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    reference?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    syncLedger?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CashbookEntryUncheckedUpdateWithoutCustomerInput = {
    id?: IntFieldUpdateOperationsInput | number
    entryDate?: StringFieldUpdateOperationsInput | string
    type?: EnumCashbookTypeFieldUpdateOperationsInput | $Enums.CashbookType
    paymentMethod?: EnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod
    description?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    reference?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    syncLedger?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CashbookEntryUncheckedUpdateManyWithoutCustomerInput = {
    id?: IntFieldUpdateOperationsInput | number
    entryDate?: StringFieldUpdateOperationsInput | string
    type?: EnumCashbookTypeFieldUpdateOperationsInput | $Enums.CashbookType
    paymentMethod?: EnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod
    description?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    reference?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    syncLedger?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PurchaseCreateManySupplierInput = {
    id?: number
    purchaseNumber: string
    purchaseDate?: Date | string
    subtotal?: Decimal | DecimalJsLike | number | string
    discount?: Decimal | DecimalJsLike | number | string
    total?: Decimal | DecimalJsLike | number | string
    paid?: Decimal | DecimalJsLike | number | string
    paymentMethod?: $Enums.PaymentMethod
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PurchaseUpdateWithoutSupplierInput = {
    purchaseNumber?: StringFieldUpdateOperationsInput | string
    purchaseDate?: DateTimeFieldUpdateOperationsInput | Date | string
    subtotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    discount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    total?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    paid?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    paymentMethod?: EnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    items?: PurchaseItemUpdateManyWithoutPurchaseNestedInput
  }

  export type PurchaseUncheckedUpdateWithoutSupplierInput = {
    id?: IntFieldUpdateOperationsInput | number
    purchaseNumber?: StringFieldUpdateOperationsInput | string
    purchaseDate?: DateTimeFieldUpdateOperationsInput | Date | string
    subtotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    discount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    total?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    paid?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    paymentMethod?: EnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    items?: PurchaseItemUncheckedUpdateManyWithoutPurchaseNestedInput
  }

  export type PurchaseUncheckedUpdateManyWithoutSupplierInput = {
    id?: IntFieldUpdateOperationsInput | number
    purchaseNumber?: StringFieldUpdateOperationsInput | string
    purchaseDate?: DateTimeFieldUpdateOperationsInput | Date | string
    subtotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    discount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    total?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    paid?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    paymentMethod?: EnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SaleItemCreateManyProductInput = {
    id?: number
    saleId: number
    quantity: number
    weight?: Decimal | DecimalJsLike | number | string
    unitPrice: Decimal | DecimalJsLike | number | string
    metalRate?: Decimal | DecimalJsLike | number | string
    metalAmount?: Decimal | DecimalJsLike | number | string
    makingCharge?: Decimal | DecimalJsLike | number | string
    makingChargeType?: $Enums.MakingChargeType
    makingChargeValue?: Decimal | DecimalJsLike | number | string
    taxableAmount?: Decimal | DecimalJsLike | number | string
    lineTotal: Decimal | DecimalJsLike | number | string
  }

  export type PurchaseItemCreateManyProductInput = {
    id?: number
    purchaseId: number
    quantity: number
    unitCost: Decimal | DecimalJsLike | number | string
    lineTotal: Decimal | DecimalJsLike | number | string
  }

  export type StockMovementCreateManyProductInput = {
    id?: number
    type: $Enums.MovementType
    quantity: number
    note?: string | null
    createdAt?: Date | string
  }

  export type SaleItemUpdateWithoutProductInput = {
    quantity?: IntFieldUpdateOperationsInput | number
    weight?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    unitPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    metalRate?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    metalAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    makingCharge?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    makingChargeType?: EnumMakingChargeTypeFieldUpdateOperationsInput | $Enums.MakingChargeType
    makingChargeValue?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    taxableAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    lineTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    sale?: SaleUpdateOneRequiredWithoutItemsNestedInput
  }

  export type SaleItemUncheckedUpdateWithoutProductInput = {
    id?: IntFieldUpdateOperationsInput | number
    saleId?: IntFieldUpdateOperationsInput | number
    quantity?: IntFieldUpdateOperationsInput | number
    weight?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    unitPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    metalRate?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    metalAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    makingCharge?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    makingChargeType?: EnumMakingChargeTypeFieldUpdateOperationsInput | $Enums.MakingChargeType
    makingChargeValue?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    taxableAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    lineTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
  }

  export type SaleItemUncheckedUpdateManyWithoutProductInput = {
    id?: IntFieldUpdateOperationsInput | number
    saleId?: IntFieldUpdateOperationsInput | number
    quantity?: IntFieldUpdateOperationsInput | number
    weight?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    unitPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    metalRate?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    metalAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    makingCharge?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    makingChargeType?: EnumMakingChargeTypeFieldUpdateOperationsInput | $Enums.MakingChargeType
    makingChargeValue?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    taxableAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    lineTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
  }

  export type PurchaseItemUpdateWithoutProductInput = {
    quantity?: IntFieldUpdateOperationsInput | number
    unitCost?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    lineTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    purchase?: PurchaseUpdateOneRequiredWithoutItemsNestedInput
  }

  export type PurchaseItemUncheckedUpdateWithoutProductInput = {
    id?: IntFieldUpdateOperationsInput | number
    purchaseId?: IntFieldUpdateOperationsInput | number
    quantity?: IntFieldUpdateOperationsInput | number
    unitCost?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    lineTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
  }

  export type PurchaseItemUncheckedUpdateManyWithoutProductInput = {
    id?: IntFieldUpdateOperationsInput | number
    purchaseId?: IntFieldUpdateOperationsInput | number
    quantity?: IntFieldUpdateOperationsInput | number
    unitCost?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    lineTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
  }

  export type StockMovementUpdateWithoutProductInput = {
    type?: EnumMovementTypeFieldUpdateOperationsInput | $Enums.MovementType
    quantity?: IntFieldUpdateOperationsInput | number
    note?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StockMovementUncheckedUpdateWithoutProductInput = {
    id?: IntFieldUpdateOperationsInput | number
    type?: EnumMovementTypeFieldUpdateOperationsInput | $Enums.MovementType
    quantity?: IntFieldUpdateOperationsInput | number
    note?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StockMovementUncheckedUpdateManyWithoutProductInput = {
    id?: IntFieldUpdateOperationsInput | number
    type?: EnumMovementTypeFieldUpdateOperationsInput | $Enums.MovementType
    quantity?: IntFieldUpdateOperationsInput | number
    note?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PurchaseItemCreateManyPurchaseInput = {
    id?: number
    productId: number
    quantity: number
    unitCost: Decimal | DecimalJsLike | number | string
    lineTotal: Decimal | DecimalJsLike | number | string
  }

  export type PurchaseItemUpdateWithoutPurchaseInput = {
    quantity?: IntFieldUpdateOperationsInput | number
    unitCost?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    lineTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    product?: ProductUpdateOneRequiredWithoutPurchaseItemsNestedInput
  }

  export type PurchaseItemUncheckedUpdateWithoutPurchaseInput = {
    id?: IntFieldUpdateOperationsInput | number
    productId?: IntFieldUpdateOperationsInput | number
    quantity?: IntFieldUpdateOperationsInput | number
    unitCost?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    lineTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
  }

  export type PurchaseItemUncheckedUpdateManyWithoutPurchaseInput = {
    id?: IntFieldUpdateOperationsInput | number
    productId?: IntFieldUpdateOperationsInput | number
    quantity?: IntFieldUpdateOperationsInput | number
    unitCost?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    lineTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
  }

  export type SaleItemCreateManySaleInput = {
    id?: number
    productId: number
    quantity: number
    weight?: Decimal | DecimalJsLike | number | string
    unitPrice: Decimal | DecimalJsLike | number | string
    metalRate?: Decimal | DecimalJsLike | number | string
    metalAmount?: Decimal | DecimalJsLike | number | string
    makingCharge?: Decimal | DecimalJsLike | number | string
    makingChargeType?: $Enums.MakingChargeType
    makingChargeValue?: Decimal | DecimalJsLike | number | string
    taxableAmount?: Decimal | DecimalJsLike | number | string
    lineTotal: Decimal | DecimalJsLike | number | string
  }

  export type CustomerLedgerCreateManySaleInput = {
    id?: number
    customerId: number
    type: $Enums.LedgerEntryType
    amount: Decimal | DecimalJsLike | number | string
    paymentMethod?: $Enums.PaymentMethod | null
    reference?: string | null
    note?: string | null
    createdAt?: Date | string
  }

  export type SaleItemUpdateWithoutSaleInput = {
    quantity?: IntFieldUpdateOperationsInput | number
    weight?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    unitPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    metalRate?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    metalAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    makingCharge?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    makingChargeType?: EnumMakingChargeTypeFieldUpdateOperationsInput | $Enums.MakingChargeType
    makingChargeValue?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    taxableAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    lineTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    product?: ProductUpdateOneRequiredWithoutSaleItemsNestedInput
  }

  export type SaleItemUncheckedUpdateWithoutSaleInput = {
    id?: IntFieldUpdateOperationsInput | number
    productId?: IntFieldUpdateOperationsInput | number
    quantity?: IntFieldUpdateOperationsInput | number
    weight?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    unitPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    metalRate?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    metalAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    makingCharge?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    makingChargeType?: EnumMakingChargeTypeFieldUpdateOperationsInput | $Enums.MakingChargeType
    makingChargeValue?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    taxableAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    lineTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
  }

  export type SaleItemUncheckedUpdateManyWithoutSaleInput = {
    id?: IntFieldUpdateOperationsInput | number
    productId?: IntFieldUpdateOperationsInput | number
    quantity?: IntFieldUpdateOperationsInput | number
    weight?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    unitPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    metalRate?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    metalAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    makingCharge?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    makingChargeType?: EnumMakingChargeTypeFieldUpdateOperationsInput | $Enums.MakingChargeType
    makingChargeValue?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    taxableAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    lineTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
  }

  export type CustomerLedgerUpdateWithoutSaleInput = {
    type?: EnumLedgerEntryTypeFieldUpdateOperationsInput | $Enums.LedgerEntryType
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    paymentMethod?: NullableEnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod | null
    reference?: NullableStringFieldUpdateOperationsInput | string | null
    note?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    customer?: CustomerUpdateOneRequiredWithoutLedgerNestedInput
  }

  export type CustomerLedgerUncheckedUpdateWithoutSaleInput = {
    id?: IntFieldUpdateOperationsInput | number
    customerId?: IntFieldUpdateOperationsInput | number
    type?: EnumLedgerEntryTypeFieldUpdateOperationsInput | $Enums.LedgerEntryType
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    paymentMethod?: NullableEnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod | null
    reference?: NullableStringFieldUpdateOperationsInput | string | null
    note?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CustomerLedgerUncheckedUpdateManyWithoutSaleInput = {
    id?: IntFieldUpdateOperationsInput | number
    customerId?: IntFieldUpdateOperationsInput | number
    type?: EnumLedgerEntryTypeFieldUpdateOperationsInput | $Enums.LedgerEntryType
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    paymentMethod?: NullableEnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod | null
    reference?: NullableStringFieldUpdateOperationsInput | string | null
    note?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}