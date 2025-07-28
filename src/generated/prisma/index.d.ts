
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
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model District
 * 
 */
export type District = $Result.DefaultSelection<Prisma.$DistrictPayload>
/**
 * Model FacilityType
 * 
 */
export type FacilityType = $Result.DefaultSelection<Prisma.$FacilityTypePayload>
/**
 * Model Facility
 * 
 */
export type Facility = $Result.DefaultSelection<Prisma.$FacilityPayload>
/**
 * Model MonthlyHealthData
 * 
 */
export type MonthlyHealthData = $Result.DefaultSelection<Prisma.$MonthlyHealthDataPayload>
/**
 * Model DataUploadSession
 * 
 */
export type DataUploadSession = $Result.DefaultSelection<Prisma.$DataUploadSessionPayload>
/**
 * Model Formula
 * 
 */
export type Formula = $Result.DefaultSelection<Prisma.$FormulaPayload>
/**
 * Model Indicator
 * 
 */
export type Indicator = $Result.DefaultSelection<Prisma.$IndicatorPayload>
/**
 * Model field
 * 
 */
export type field = $Result.DefaultSelection<Prisma.$fieldPayload>
/**
 * Model sub_centre
 * 
 */
export type sub_centre = $Result.DefaultSelection<Prisma.$sub_centrePayload>

/**
 * Enums
 */
export namespace $Enums {
  export const UserRole: {
  admin: 'admin',
  staff: 'staff'
};

export type UserRole = (typeof UserRole)[keyof typeof UserRole]


export const CalculationType: {
  DIRECT_INPUT: 'DIRECT_INPUT',
  CALCULATED: 'CALCULATED',
  AGGREGATED: 'AGGREGATED',
  PERCENTAGE: 'PERCENTAGE'
};

export type CalculationType = (typeof CalculationType)[keyof typeof CalculationType]


export const DataQuality: {
  PENDING: 'PENDING',
  VALIDATED: 'VALIDATED',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED'
};

export type DataQuality = (typeof DataQuality)[keyof typeof DataQuality]


export const UploadStatus: {
  PROCESSING: 'PROCESSING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
  CANCELLED: 'CANCELLED'
};

export type UploadStatus = (typeof UploadStatus)[keyof typeof UploadStatus]

}

export type UserRole = $Enums.UserRole

export const UserRole: typeof $Enums.UserRole

export type CalculationType = $Enums.CalculationType

export const CalculationType: typeof $Enums.CalculationType

export type DataQuality = $Enums.DataQuality

export const DataQuality: typeof $Enums.DataQuality

export type UploadStatus = $Enums.UploadStatus

export const UploadStatus: typeof $Enums.UploadStatus

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
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
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
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
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

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
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.district`: Exposes CRUD operations for the **District** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Districts
    * const districts = await prisma.district.findMany()
    * ```
    */
  get district(): Prisma.DistrictDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.facilityType`: Exposes CRUD operations for the **FacilityType** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more FacilityTypes
    * const facilityTypes = await prisma.facilityType.findMany()
    * ```
    */
  get facilityType(): Prisma.FacilityTypeDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.facility`: Exposes CRUD operations for the **Facility** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Facilities
    * const facilities = await prisma.facility.findMany()
    * ```
    */
  get facility(): Prisma.FacilityDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.monthlyHealthData`: Exposes CRUD operations for the **MonthlyHealthData** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more MonthlyHealthData
    * const monthlyHealthData = await prisma.monthlyHealthData.findMany()
    * ```
    */
  get monthlyHealthData(): Prisma.MonthlyHealthDataDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.dataUploadSession`: Exposes CRUD operations for the **DataUploadSession** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more DataUploadSessions
    * const dataUploadSessions = await prisma.dataUploadSession.findMany()
    * ```
    */
  get dataUploadSession(): Prisma.DataUploadSessionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.formula`: Exposes CRUD operations for the **Formula** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Formulas
    * const formulas = await prisma.formula.findMany()
    * ```
    */
  get formula(): Prisma.FormulaDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.indicator`: Exposes CRUD operations for the **Indicator** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Indicators
    * const indicators = await prisma.indicator.findMany()
    * ```
    */
  get indicator(): Prisma.IndicatorDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.field`: Exposes CRUD operations for the **field** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Fields
    * const fields = await prisma.field.findMany()
    * ```
    */
  get field(): Prisma.fieldDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.sub_centre`: Exposes CRUD operations for the **sub_centre** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Sub_centres
    * const sub_centres = await prisma.sub_centre.findMany()
    * ```
    */
  get sub_centre(): Prisma.sub_centreDelegate<ExtArgs, ClientOptions>;
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
   * Prisma Client JS version: 6.8.2
   * Query Engine version: 2060c79ba17c6bb9f5823312b6f6b7f4a845738e
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


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
    User: 'User',
    District: 'District',
    FacilityType: 'FacilityType',
    Facility: 'Facility',
    MonthlyHealthData: 'MonthlyHealthData',
    DataUploadSession: 'DataUploadSession',
    Formula: 'Formula',
    Indicator: 'Indicator',
    field: 'field',
    sub_centre: 'sub_centre'
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
      modelProps: "user" | "district" | "facilityType" | "facility" | "monthlyHealthData" | "dataUploadSession" | "formula" | "indicator" | "field" | "sub_centre"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      District: {
        payload: Prisma.$DistrictPayload<ExtArgs>
        fields: Prisma.DistrictFieldRefs
        operations: {
          findUnique: {
            args: Prisma.DistrictFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DistrictPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.DistrictFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DistrictPayload>
          }
          findFirst: {
            args: Prisma.DistrictFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DistrictPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.DistrictFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DistrictPayload>
          }
          findMany: {
            args: Prisma.DistrictFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DistrictPayload>[]
          }
          create: {
            args: Prisma.DistrictCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DistrictPayload>
          }
          createMany: {
            args: Prisma.DistrictCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.DistrictCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DistrictPayload>[]
          }
          delete: {
            args: Prisma.DistrictDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DistrictPayload>
          }
          update: {
            args: Prisma.DistrictUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DistrictPayload>
          }
          deleteMany: {
            args: Prisma.DistrictDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.DistrictUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.DistrictUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DistrictPayload>[]
          }
          upsert: {
            args: Prisma.DistrictUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DistrictPayload>
          }
          aggregate: {
            args: Prisma.DistrictAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDistrict>
          }
          groupBy: {
            args: Prisma.DistrictGroupByArgs<ExtArgs>
            result: $Utils.Optional<DistrictGroupByOutputType>[]
          }
          count: {
            args: Prisma.DistrictCountArgs<ExtArgs>
            result: $Utils.Optional<DistrictCountAggregateOutputType> | number
          }
        }
      }
      FacilityType: {
        payload: Prisma.$FacilityTypePayload<ExtArgs>
        fields: Prisma.FacilityTypeFieldRefs
        operations: {
          findUnique: {
            args: Prisma.FacilityTypeFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FacilityTypePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.FacilityTypeFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FacilityTypePayload>
          }
          findFirst: {
            args: Prisma.FacilityTypeFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FacilityTypePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.FacilityTypeFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FacilityTypePayload>
          }
          findMany: {
            args: Prisma.FacilityTypeFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FacilityTypePayload>[]
          }
          create: {
            args: Prisma.FacilityTypeCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FacilityTypePayload>
          }
          createMany: {
            args: Prisma.FacilityTypeCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.FacilityTypeCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FacilityTypePayload>[]
          }
          delete: {
            args: Prisma.FacilityTypeDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FacilityTypePayload>
          }
          update: {
            args: Prisma.FacilityTypeUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FacilityTypePayload>
          }
          deleteMany: {
            args: Prisma.FacilityTypeDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.FacilityTypeUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.FacilityTypeUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FacilityTypePayload>[]
          }
          upsert: {
            args: Prisma.FacilityTypeUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FacilityTypePayload>
          }
          aggregate: {
            args: Prisma.FacilityTypeAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateFacilityType>
          }
          groupBy: {
            args: Prisma.FacilityTypeGroupByArgs<ExtArgs>
            result: $Utils.Optional<FacilityTypeGroupByOutputType>[]
          }
          count: {
            args: Prisma.FacilityTypeCountArgs<ExtArgs>
            result: $Utils.Optional<FacilityTypeCountAggregateOutputType> | number
          }
        }
      }
      Facility: {
        payload: Prisma.$FacilityPayload<ExtArgs>
        fields: Prisma.FacilityFieldRefs
        operations: {
          findUnique: {
            args: Prisma.FacilityFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FacilityPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.FacilityFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FacilityPayload>
          }
          findFirst: {
            args: Prisma.FacilityFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FacilityPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.FacilityFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FacilityPayload>
          }
          findMany: {
            args: Prisma.FacilityFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FacilityPayload>[]
          }
          create: {
            args: Prisma.FacilityCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FacilityPayload>
          }
          createMany: {
            args: Prisma.FacilityCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.FacilityCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FacilityPayload>[]
          }
          delete: {
            args: Prisma.FacilityDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FacilityPayload>
          }
          update: {
            args: Prisma.FacilityUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FacilityPayload>
          }
          deleteMany: {
            args: Prisma.FacilityDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.FacilityUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.FacilityUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FacilityPayload>[]
          }
          upsert: {
            args: Prisma.FacilityUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FacilityPayload>
          }
          aggregate: {
            args: Prisma.FacilityAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateFacility>
          }
          groupBy: {
            args: Prisma.FacilityGroupByArgs<ExtArgs>
            result: $Utils.Optional<FacilityGroupByOutputType>[]
          }
          count: {
            args: Prisma.FacilityCountArgs<ExtArgs>
            result: $Utils.Optional<FacilityCountAggregateOutputType> | number
          }
        }
      }
      MonthlyHealthData: {
        payload: Prisma.$MonthlyHealthDataPayload<ExtArgs>
        fields: Prisma.MonthlyHealthDataFieldRefs
        operations: {
          findUnique: {
            args: Prisma.MonthlyHealthDataFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MonthlyHealthDataPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.MonthlyHealthDataFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MonthlyHealthDataPayload>
          }
          findFirst: {
            args: Prisma.MonthlyHealthDataFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MonthlyHealthDataPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.MonthlyHealthDataFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MonthlyHealthDataPayload>
          }
          findMany: {
            args: Prisma.MonthlyHealthDataFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MonthlyHealthDataPayload>[]
          }
          create: {
            args: Prisma.MonthlyHealthDataCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MonthlyHealthDataPayload>
          }
          createMany: {
            args: Prisma.MonthlyHealthDataCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.MonthlyHealthDataCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MonthlyHealthDataPayload>[]
          }
          delete: {
            args: Prisma.MonthlyHealthDataDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MonthlyHealthDataPayload>
          }
          update: {
            args: Prisma.MonthlyHealthDataUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MonthlyHealthDataPayload>
          }
          deleteMany: {
            args: Prisma.MonthlyHealthDataDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.MonthlyHealthDataUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.MonthlyHealthDataUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MonthlyHealthDataPayload>[]
          }
          upsert: {
            args: Prisma.MonthlyHealthDataUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MonthlyHealthDataPayload>
          }
          aggregate: {
            args: Prisma.MonthlyHealthDataAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMonthlyHealthData>
          }
          groupBy: {
            args: Prisma.MonthlyHealthDataGroupByArgs<ExtArgs>
            result: $Utils.Optional<MonthlyHealthDataGroupByOutputType>[]
          }
          count: {
            args: Prisma.MonthlyHealthDataCountArgs<ExtArgs>
            result: $Utils.Optional<MonthlyHealthDataCountAggregateOutputType> | number
          }
        }
      }
      DataUploadSession: {
        payload: Prisma.$DataUploadSessionPayload<ExtArgs>
        fields: Prisma.DataUploadSessionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.DataUploadSessionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DataUploadSessionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.DataUploadSessionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DataUploadSessionPayload>
          }
          findFirst: {
            args: Prisma.DataUploadSessionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DataUploadSessionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.DataUploadSessionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DataUploadSessionPayload>
          }
          findMany: {
            args: Prisma.DataUploadSessionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DataUploadSessionPayload>[]
          }
          create: {
            args: Prisma.DataUploadSessionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DataUploadSessionPayload>
          }
          createMany: {
            args: Prisma.DataUploadSessionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.DataUploadSessionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DataUploadSessionPayload>[]
          }
          delete: {
            args: Prisma.DataUploadSessionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DataUploadSessionPayload>
          }
          update: {
            args: Prisma.DataUploadSessionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DataUploadSessionPayload>
          }
          deleteMany: {
            args: Prisma.DataUploadSessionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.DataUploadSessionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.DataUploadSessionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DataUploadSessionPayload>[]
          }
          upsert: {
            args: Prisma.DataUploadSessionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DataUploadSessionPayload>
          }
          aggregate: {
            args: Prisma.DataUploadSessionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDataUploadSession>
          }
          groupBy: {
            args: Prisma.DataUploadSessionGroupByArgs<ExtArgs>
            result: $Utils.Optional<DataUploadSessionGroupByOutputType>[]
          }
          count: {
            args: Prisma.DataUploadSessionCountArgs<ExtArgs>
            result: $Utils.Optional<DataUploadSessionCountAggregateOutputType> | number
          }
        }
      }
      Formula: {
        payload: Prisma.$FormulaPayload<ExtArgs>
        fields: Prisma.FormulaFieldRefs
        operations: {
          findUnique: {
            args: Prisma.FormulaFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FormulaPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.FormulaFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FormulaPayload>
          }
          findFirst: {
            args: Prisma.FormulaFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FormulaPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.FormulaFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FormulaPayload>
          }
          findMany: {
            args: Prisma.FormulaFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FormulaPayload>[]
          }
          create: {
            args: Prisma.FormulaCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FormulaPayload>
          }
          createMany: {
            args: Prisma.FormulaCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.FormulaCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FormulaPayload>[]
          }
          delete: {
            args: Prisma.FormulaDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FormulaPayload>
          }
          update: {
            args: Prisma.FormulaUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FormulaPayload>
          }
          deleteMany: {
            args: Prisma.FormulaDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.FormulaUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.FormulaUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FormulaPayload>[]
          }
          upsert: {
            args: Prisma.FormulaUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FormulaPayload>
          }
          aggregate: {
            args: Prisma.FormulaAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateFormula>
          }
          groupBy: {
            args: Prisma.FormulaGroupByArgs<ExtArgs>
            result: $Utils.Optional<FormulaGroupByOutputType>[]
          }
          count: {
            args: Prisma.FormulaCountArgs<ExtArgs>
            result: $Utils.Optional<FormulaCountAggregateOutputType> | number
          }
        }
      }
      Indicator: {
        payload: Prisma.$IndicatorPayload<ExtArgs>
        fields: Prisma.IndicatorFieldRefs
        operations: {
          findUnique: {
            args: Prisma.IndicatorFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IndicatorPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.IndicatorFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IndicatorPayload>
          }
          findFirst: {
            args: Prisma.IndicatorFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IndicatorPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.IndicatorFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IndicatorPayload>
          }
          findMany: {
            args: Prisma.IndicatorFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IndicatorPayload>[]
          }
          create: {
            args: Prisma.IndicatorCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IndicatorPayload>
          }
          createMany: {
            args: Prisma.IndicatorCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.IndicatorCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IndicatorPayload>[]
          }
          delete: {
            args: Prisma.IndicatorDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IndicatorPayload>
          }
          update: {
            args: Prisma.IndicatorUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IndicatorPayload>
          }
          deleteMany: {
            args: Prisma.IndicatorDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.IndicatorUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.IndicatorUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IndicatorPayload>[]
          }
          upsert: {
            args: Prisma.IndicatorUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IndicatorPayload>
          }
          aggregate: {
            args: Prisma.IndicatorAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateIndicator>
          }
          groupBy: {
            args: Prisma.IndicatorGroupByArgs<ExtArgs>
            result: $Utils.Optional<IndicatorGroupByOutputType>[]
          }
          count: {
            args: Prisma.IndicatorCountArgs<ExtArgs>
            result: $Utils.Optional<IndicatorCountAggregateOutputType> | number
          }
        }
      }
      field: {
        payload: Prisma.$fieldPayload<ExtArgs>
        fields: Prisma.fieldFieldRefs
        operations: {
          findUnique: {
            args: Prisma.fieldFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$fieldPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.fieldFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$fieldPayload>
          }
          findFirst: {
            args: Prisma.fieldFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$fieldPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.fieldFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$fieldPayload>
          }
          findMany: {
            args: Prisma.fieldFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$fieldPayload>[]
          }
          create: {
            args: Prisma.fieldCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$fieldPayload>
          }
          createMany: {
            args: Prisma.fieldCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.fieldCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$fieldPayload>[]
          }
          delete: {
            args: Prisma.fieldDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$fieldPayload>
          }
          update: {
            args: Prisma.fieldUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$fieldPayload>
          }
          deleteMany: {
            args: Prisma.fieldDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.fieldUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.fieldUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$fieldPayload>[]
          }
          upsert: {
            args: Prisma.fieldUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$fieldPayload>
          }
          aggregate: {
            args: Prisma.FieldAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateField>
          }
          groupBy: {
            args: Prisma.fieldGroupByArgs<ExtArgs>
            result: $Utils.Optional<FieldGroupByOutputType>[]
          }
          count: {
            args: Prisma.fieldCountArgs<ExtArgs>
            result: $Utils.Optional<FieldCountAggregateOutputType> | number
          }
        }
      }
      sub_centre: {
        payload: Prisma.$sub_centrePayload<ExtArgs>
        fields: Prisma.sub_centreFieldRefs
        operations: {
          findUnique: {
            args: Prisma.sub_centreFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$sub_centrePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.sub_centreFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$sub_centrePayload>
          }
          findFirst: {
            args: Prisma.sub_centreFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$sub_centrePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.sub_centreFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$sub_centrePayload>
          }
          findMany: {
            args: Prisma.sub_centreFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$sub_centrePayload>[]
          }
          create: {
            args: Prisma.sub_centreCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$sub_centrePayload>
          }
          createMany: {
            args: Prisma.sub_centreCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.sub_centreCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$sub_centrePayload>[]
          }
          delete: {
            args: Prisma.sub_centreDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$sub_centrePayload>
          }
          update: {
            args: Prisma.sub_centreUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$sub_centrePayload>
          }
          deleteMany: {
            args: Prisma.sub_centreDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.sub_centreUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.sub_centreUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$sub_centrePayload>[]
          }
          upsert: {
            args: Prisma.sub_centreUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$sub_centrePayload>
          }
          aggregate: {
            args: Prisma.Sub_centreAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSub_centre>
          }
          groupBy: {
            args: Prisma.sub_centreGroupByArgs<ExtArgs>
            result: $Utils.Optional<Sub_centreGroupByOutputType>[]
          }
          count: {
            args: Prisma.sub_centreCountArgs<ExtArgs>
            result: $Utils.Optional<Sub_centreCountAggregateOutputType> | number
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
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
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
    user?: UserOmit
    district?: DistrictOmit
    facilityType?: FacilityTypeOmit
    facility?: FacilityOmit
    monthlyHealthData?: MonthlyHealthDataOmit
    dataUploadSession?: DataUploadSessionOmit
    formula?: FormulaOmit
    indicator?: IndicatorOmit
    field?: fieldOmit
    sub_centre?: sub_centreOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

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

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

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
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    upload_sessions: number
    approved_data: number
    uploaded_data: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    upload_sessions?: boolean | UserCountOutputTypeCountUpload_sessionsArgs
    approved_data?: boolean | UserCountOutputTypeCountApproved_dataArgs
    uploaded_data?: boolean | UserCountOutputTypeCountUploaded_dataArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountUpload_sessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DataUploadSessionWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountApproved_dataArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MonthlyHealthDataWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountUploaded_dataArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MonthlyHealthDataWhereInput
  }


  /**
   * Count Type DistrictCountOutputType
   */

  export type DistrictCountOutputType = {
    facilities: number
    monthly_data: number
  }

  export type DistrictCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    facilities?: boolean | DistrictCountOutputTypeCountFacilitiesArgs
    monthly_data?: boolean | DistrictCountOutputTypeCountMonthly_dataArgs
  }

  // Custom InputTypes
  /**
   * DistrictCountOutputType without action
   */
  export type DistrictCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DistrictCountOutputType
     */
    select?: DistrictCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * DistrictCountOutputType without action
   */
  export type DistrictCountOutputTypeCountFacilitiesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FacilityWhereInput
  }

  /**
   * DistrictCountOutputType without action
   */
  export type DistrictCountOutputTypeCountMonthly_dataArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MonthlyHealthDataWhereInput
  }


  /**
   * Count Type FacilityTypeCountOutputType
   */

  export type FacilityTypeCountOutputType = {
    facilities: number
  }

  export type FacilityTypeCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    facilities?: boolean | FacilityTypeCountOutputTypeCountFacilitiesArgs
  }

  // Custom InputTypes
  /**
   * FacilityTypeCountOutputType without action
   */
  export type FacilityTypeCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FacilityTypeCountOutputType
     */
    select?: FacilityTypeCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * FacilityTypeCountOutputType without action
   */
  export type FacilityTypeCountOutputTypeCountFacilitiesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FacilityWhereInput
  }


  /**
   * Count Type FacilityCountOutputType
   */

  export type FacilityCountOutputType = {
    monthly_data: number
    sub_centre: number
  }

  export type FacilityCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    monthly_data?: boolean | FacilityCountOutputTypeCountMonthly_dataArgs
    sub_centre?: boolean | FacilityCountOutputTypeCountSub_centreArgs
  }

  // Custom InputTypes
  /**
   * FacilityCountOutputType without action
   */
  export type FacilityCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FacilityCountOutputType
     */
    select?: FacilityCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * FacilityCountOutputType without action
   */
  export type FacilityCountOutputTypeCountMonthly_dataArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MonthlyHealthDataWhereInput
  }

  /**
   * FacilityCountOutputType without action
   */
  export type FacilityCountOutputTypeCountSub_centreArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: sub_centreWhereInput
  }


  /**
   * Count Type IndicatorCountOutputType
   */

  export type IndicatorCountOutputType = {
    monthly_data: number
  }

  export type IndicatorCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    monthly_data?: boolean | IndicatorCountOutputTypeCountMonthly_dataArgs
  }

  // Custom InputTypes
  /**
   * IndicatorCountOutputType without action
   */
  export type IndicatorCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IndicatorCountOutputType
     */
    select?: IndicatorCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * IndicatorCountOutputType without action
   */
  export type IndicatorCountOutputTypeCountMonthly_dataArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MonthlyHealthDataWhereInput
  }


  /**
   * Count Type Sub_centreCountOutputType
   */

  export type Sub_centreCountOutputType = {
    monthly_health_data: number
  }

  export type Sub_centreCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    monthly_health_data?: boolean | Sub_centreCountOutputTypeCountMonthly_health_dataArgs
  }

  // Custom InputTypes
  /**
   * Sub_centreCountOutputType without action
   */
  export type Sub_centreCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Sub_centreCountOutputType
     */
    select?: Sub_centreCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * Sub_centreCountOutputType without action
   */
  export type Sub_centreCountOutputTypeCountMonthly_health_dataArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MonthlyHealthDataWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserAvgAggregateOutputType = {
    id: number | null
  }

  export type UserSumAggregateOutputType = {
    id: number | null
  }

  export type UserMinAggregateOutputType = {
    id: number | null
    username: string | null
    password_hash: string | null
    role: $Enums.UserRole | null
    is_active: boolean | null
    last_login: Date | null
    created_at: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: number | null
    username: string | null
    password_hash: string | null
    role: $Enums.UserRole | null
    is_active: boolean | null
    last_login: Date | null
    created_at: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    username: number
    password_hash: number
    role: number
    is_active: number
    last_login: number
    created_at: number
    _all: number
  }


  export type UserAvgAggregateInputType = {
    id?: true
  }

  export type UserSumAggregateInputType = {
    id?: true
  }

  export type UserMinAggregateInputType = {
    id?: true
    username?: true
    password_hash?: true
    role?: true
    is_active?: true
    last_login?: true
    created_at?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    username?: true
    password_hash?: true
    role?: true
    is_active?: true
    last_login?: true
    created_at?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    username?: true
    password_hash?: true
    role?: true
    is_active?: true
    last_login?: true
    created_at?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UserAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UserSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _avg?: UserAvgAggregateInputType
    _sum?: UserSumAggregateInputType
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: number
    username: string
    password_hash: string
    role: $Enums.UserRole
    is_active: boolean | null
    last_login: Date | null
    created_at: Date | null
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    username?: boolean
    password_hash?: boolean
    role?: boolean
    is_active?: boolean
    last_login?: boolean
    created_at?: boolean
    upload_sessions?: boolean | User$upload_sessionsArgs<ExtArgs>
    approved_data?: boolean | User$approved_dataArgs<ExtArgs>
    uploaded_data?: boolean | User$uploaded_dataArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    username?: boolean
    password_hash?: boolean
    role?: boolean
    is_active?: boolean
    last_login?: boolean
    created_at?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    username?: boolean
    password_hash?: boolean
    role?: boolean
    is_active?: boolean
    last_login?: boolean
    created_at?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    username?: boolean
    password_hash?: boolean
    role?: boolean
    is_active?: boolean
    last_login?: boolean
    created_at?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "username" | "password_hash" | "role" | "is_active" | "last_login" | "created_at", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    upload_sessions?: boolean | User$upload_sessionsArgs<ExtArgs>
    approved_data?: boolean | User$approved_dataArgs<ExtArgs>
    uploaded_data?: boolean | User$uploaded_dataArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type UserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      upload_sessions: Prisma.$DataUploadSessionPayload<ExtArgs>[]
      approved_data: Prisma.$MonthlyHealthDataPayload<ExtArgs>[]
      uploaded_data: Prisma.$MonthlyHealthDataPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      username: string
      password_hash: string
      role: $Enums.UserRole
      is_active: boolean | null
      last_login: Date | null
      created_at: Date | null
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
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
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    upload_sessions<T extends User$upload_sessionsArgs<ExtArgs> = {}>(args?: Subset<T, User$upload_sessionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DataUploadSessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    approved_data<T extends User$approved_dataArgs<ExtArgs> = {}>(args?: Subset<T, User$approved_dataArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MonthlyHealthDataPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    uploaded_data<T extends User$uploaded_dataArgs<ExtArgs> = {}>(args?: Subset<T, User$uploaded_dataArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MonthlyHealthDataPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'Int'>
    readonly username: FieldRef<"User", 'String'>
    readonly password_hash: FieldRef<"User", 'String'>
    readonly role: FieldRef<"User", 'UserRole'>
    readonly is_active: FieldRef<"User", 'Boolean'>
    readonly last_login: FieldRef<"User", 'DateTime'>
    readonly created_at: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User.upload_sessions
   */
  export type User$upload_sessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DataUploadSession
     */
    select?: DataUploadSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DataUploadSession
     */
    omit?: DataUploadSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DataUploadSessionInclude<ExtArgs> | null
    where?: DataUploadSessionWhereInput
    orderBy?: DataUploadSessionOrderByWithRelationInput | DataUploadSessionOrderByWithRelationInput[]
    cursor?: DataUploadSessionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: DataUploadSessionScalarFieldEnum | DataUploadSessionScalarFieldEnum[]
  }

  /**
   * User.approved_data
   */
  export type User$approved_dataArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MonthlyHealthData
     */
    select?: MonthlyHealthDataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MonthlyHealthData
     */
    omit?: MonthlyHealthDataOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MonthlyHealthDataInclude<ExtArgs> | null
    where?: MonthlyHealthDataWhereInput
    orderBy?: MonthlyHealthDataOrderByWithRelationInput | MonthlyHealthDataOrderByWithRelationInput[]
    cursor?: MonthlyHealthDataWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MonthlyHealthDataScalarFieldEnum | MonthlyHealthDataScalarFieldEnum[]
  }

  /**
   * User.uploaded_data
   */
  export type User$uploaded_dataArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MonthlyHealthData
     */
    select?: MonthlyHealthDataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MonthlyHealthData
     */
    omit?: MonthlyHealthDataOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MonthlyHealthDataInclude<ExtArgs> | null
    where?: MonthlyHealthDataWhereInput
    orderBy?: MonthlyHealthDataOrderByWithRelationInput | MonthlyHealthDataOrderByWithRelationInput[]
    cursor?: MonthlyHealthDataWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MonthlyHealthDataScalarFieldEnum | MonthlyHealthDataScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model District
   */

  export type AggregateDistrict = {
    _count: DistrictCountAggregateOutputType | null
    _avg: DistrictAvgAggregateOutputType | null
    _sum: DistrictSumAggregateOutputType | null
    _min: DistrictMinAggregateOutputType | null
    _max: DistrictMaxAggregateOutputType | null
  }

  export type DistrictAvgAggregateOutputType = {
    id: number | null
  }

  export type DistrictSumAggregateOutputType = {
    id: number | null
  }

  export type DistrictMinAggregateOutputType = {
    id: number | null
    name: string | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type DistrictMaxAggregateOutputType = {
    id: number | null
    name: string | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type DistrictCountAggregateOutputType = {
    id: number
    name: number
    created_at: number
    updated_at: number
    _all: number
  }


  export type DistrictAvgAggregateInputType = {
    id?: true
  }

  export type DistrictSumAggregateInputType = {
    id?: true
  }

  export type DistrictMinAggregateInputType = {
    id?: true
    name?: true
    created_at?: true
    updated_at?: true
  }

  export type DistrictMaxAggregateInputType = {
    id?: true
    name?: true
    created_at?: true
    updated_at?: true
  }

  export type DistrictCountAggregateInputType = {
    id?: true
    name?: true
    created_at?: true
    updated_at?: true
    _all?: true
  }

  export type DistrictAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which District to aggregate.
     */
    where?: DistrictWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Districts to fetch.
     */
    orderBy?: DistrictOrderByWithRelationInput | DistrictOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: DistrictWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Districts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Districts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Districts
    **/
    _count?: true | DistrictCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: DistrictAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: DistrictSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DistrictMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DistrictMaxAggregateInputType
  }

  export type GetDistrictAggregateType<T extends DistrictAggregateArgs> = {
        [P in keyof T & keyof AggregateDistrict]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDistrict[P]>
      : GetScalarType<T[P], AggregateDistrict[P]>
  }




  export type DistrictGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DistrictWhereInput
    orderBy?: DistrictOrderByWithAggregationInput | DistrictOrderByWithAggregationInput[]
    by: DistrictScalarFieldEnum[] | DistrictScalarFieldEnum
    having?: DistrictScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DistrictCountAggregateInputType | true
    _avg?: DistrictAvgAggregateInputType
    _sum?: DistrictSumAggregateInputType
    _min?: DistrictMinAggregateInputType
    _max?: DistrictMaxAggregateInputType
  }

  export type DistrictGroupByOutputType = {
    id: number
    name: string
    created_at: Date
    updated_at: Date
    _count: DistrictCountAggregateOutputType | null
    _avg: DistrictAvgAggregateOutputType | null
    _sum: DistrictSumAggregateOutputType | null
    _min: DistrictMinAggregateOutputType | null
    _max: DistrictMaxAggregateOutputType | null
  }

  type GetDistrictGroupByPayload<T extends DistrictGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DistrictGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DistrictGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DistrictGroupByOutputType[P]>
            : GetScalarType<T[P], DistrictGroupByOutputType[P]>
        }
      >
    >


  export type DistrictSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    created_at?: boolean
    updated_at?: boolean
    facilities?: boolean | District$facilitiesArgs<ExtArgs>
    monthly_data?: boolean | District$monthly_dataArgs<ExtArgs>
    _count?: boolean | DistrictCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["district"]>

  export type DistrictSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    created_at?: boolean
    updated_at?: boolean
  }, ExtArgs["result"]["district"]>

  export type DistrictSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    created_at?: boolean
    updated_at?: boolean
  }, ExtArgs["result"]["district"]>

  export type DistrictSelectScalar = {
    id?: boolean
    name?: boolean
    created_at?: boolean
    updated_at?: boolean
  }

  export type DistrictOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "created_at" | "updated_at", ExtArgs["result"]["district"]>
  export type DistrictInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    facilities?: boolean | District$facilitiesArgs<ExtArgs>
    monthly_data?: boolean | District$monthly_dataArgs<ExtArgs>
    _count?: boolean | DistrictCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type DistrictIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type DistrictIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $DistrictPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "District"
    objects: {
      facilities: Prisma.$FacilityPayload<ExtArgs>[]
      monthly_data: Prisma.$MonthlyHealthDataPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      name: string
      created_at: Date
      updated_at: Date
    }, ExtArgs["result"]["district"]>
    composites: {}
  }

  type DistrictGetPayload<S extends boolean | null | undefined | DistrictDefaultArgs> = $Result.GetResult<Prisma.$DistrictPayload, S>

  type DistrictCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<DistrictFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: DistrictCountAggregateInputType | true
    }

  export interface DistrictDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['District'], meta: { name: 'District' } }
    /**
     * Find zero or one District that matches the filter.
     * @param {DistrictFindUniqueArgs} args - Arguments to find a District
     * @example
     * // Get one District
     * const district = await prisma.district.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends DistrictFindUniqueArgs>(args: SelectSubset<T, DistrictFindUniqueArgs<ExtArgs>>): Prisma__DistrictClient<$Result.GetResult<Prisma.$DistrictPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one District that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {DistrictFindUniqueOrThrowArgs} args - Arguments to find a District
     * @example
     * // Get one District
     * const district = await prisma.district.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends DistrictFindUniqueOrThrowArgs>(args: SelectSubset<T, DistrictFindUniqueOrThrowArgs<ExtArgs>>): Prisma__DistrictClient<$Result.GetResult<Prisma.$DistrictPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first District that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DistrictFindFirstArgs} args - Arguments to find a District
     * @example
     * // Get one District
     * const district = await prisma.district.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends DistrictFindFirstArgs>(args?: SelectSubset<T, DistrictFindFirstArgs<ExtArgs>>): Prisma__DistrictClient<$Result.GetResult<Prisma.$DistrictPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first District that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DistrictFindFirstOrThrowArgs} args - Arguments to find a District
     * @example
     * // Get one District
     * const district = await prisma.district.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends DistrictFindFirstOrThrowArgs>(args?: SelectSubset<T, DistrictFindFirstOrThrowArgs<ExtArgs>>): Prisma__DistrictClient<$Result.GetResult<Prisma.$DistrictPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Districts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DistrictFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Districts
     * const districts = await prisma.district.findMany()
     * 
     * // Get first 10 Districts
     * const districts = await prisma.district.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const districtWithIdOnly = await prisma.district.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends DistrictFindManyArgs>(args?: SelectSubset<T, DistrictFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DistrictPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a District.
     * @param {DistrictCreateArgs} args - Arguments to create a District.
     * @example
     * // Create one District
     * const District = await prisma.district.create({
     *   data: {
     *     // ... data to create a District
     *   }
     * })
     * 
     */
    create<T extends DistrictCreateArgs>(args: SelectSubset<T, DistrictCreateArgs<ExtArgs>>): Prisma__DistrictClient<$Result.GetResult<Prisma.$DistrictPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Districts.
     * @param {DistrictCreateManyArgs} args - Arguments to create many Districts.
     * @example
     * // Create many Districts
     * const district = await prisma.district.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends DistrictCreateManyArgs>(args?: SelectSubset<T, DistrictCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Districts and returns the data saved in the database.
     * @param {DistrictCreateManyAndReturnArgs} args - Arguments to create many Districts.
     * @example
     * // Create many Districts
     * const district = await prisma.district.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Districts and only return the `id`
     * const districtWithIdOnly = await prisma.district.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends DistrictCreateManyAndReturnArgs>(args?: SelectSubset<T, DistrictCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DistrictPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a District.
     * @param {DistrictDeleteArgs} args - Arguments to delete one District.
     * @example
     * // Delete one District
     * const District = await prisma.district.delete({
     *   where: {
     *     // ... filter to delete one District
     *   }
     * })
     * 
     */
    delete<T extends DistrictDeleteArgs>(args: SelectSubset<T, DistrictDeleteArgs<ExtArgs>>): Prisma__DistrictClient<$Result.GetResult<Prisma.$DistrictPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one District.
     * @param {DistrictUpdateArgs} args - Arguments to update one District.
     * @example
     * // Update one District
     * const district = await prisma.district.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends DistrictUpdateArgs>(args: SelectSubset<T, DistrictUpdateArgs<ExtArgs>>): Prisma__DistrictClient<$Result.GetResult<Prisma.$DistrictPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Districts.
     * @param {DistrictDeleteManyArgs} args - Arguments to filter Districts to delete.
     * @example
     * // Delete a few Districts
     * const { count } = await prisma.district.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends DistrictDeleteManyArgs>(args?: SelectSubset<T, DistrictDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Districts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DistrictUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Districts
     * const district = await prisma.district.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends DistrictUpdateManyArgs>(args: SelectSubset<T, DistrictUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Districts and returns the data updated in the database.
     * @param {DistrictUpdateManyAndReturnArgs} args - Arguments to update many Districts.
     * @example
     * // Update many Districts
     * const district = await prisma.district.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Districts and only return the `id`
     * const districtWithIdOnly = await prisma.district.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends DistrictUpdateManyAndReturnArgs>(args: SelectSubset<T, DistrictUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DistrictPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one District.
     * @param {DistrictUpsertArgs} args - Arguments to update or create a District.
     * @example
     * // Update or create a District
     * const district = await prisma.district.upsert({
     *   create: {
     *     // ... data to create a District
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the District we want to update
     *   }
     * })
     */
    upsert<T extends DistrictUpsertArgs>(args: SelectSubset<T, DistrictUpsertArgs<ExtArgs>>): Prisma__DistrictClient<$Result.GetResult<Prisma.$DistrictPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Districts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DistrictCountArgs} args - Arguments to filter Districts to count.
     * @example
     * // Count the number of Districts
     * const count = await prisma.district.count({
     *   where: {
     *     // ... the filter for the Districts we want to count
     *   }
     * })
    **/
    count<T extends DistrictCountArgs>(
      args?: Subset<T, DistrictCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DistrictCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a District.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DistrictAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends DistrictAggregateArgs>(args: Subset<T, DistrictAggregateArgs>): Prisma.PrismaPromise<GetDistrictAggregateType<T>>

    /**
     * Group by District.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DistrictGroupByArgs} args - Group by arguments.
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
      T extends DistrictGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: DistrictGroupByArgs['orderBy'] }
        : { orderBy?: DistrictGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, DistrictGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDistrictGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the District model
   */
  readonly fields: DistrictFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for District.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__DistrictClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    facilities<T extends District$facilitiesArgs<ExtArgs> = {}>(args?: Subset<T, District$facilitiesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FacilityPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    monthly_data<T extends District$monthly_dataArgs<ExtArgs> = {}>(args?: Subset<T, District$monthly_dataArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MonthlyHealthDataPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the District model
   */
  interface DistrictFieldRefs {
    readonly id: FieldRef<"District", 'Int'>
    readonly name: FieldRef<"District", 'String'>
    readonly created_at: FieldRef<"District", 'DateTime'>
    readonly updated_at: FieldRef<"District", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * District findUnique
   */
  export type DistrictFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the District
     */
    select?: DistrictSelect<ExtArgs> | null
    /**
     * Omit specific fields from the District
     */
    omit?: DistrictOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DistrictInclude<ExtArgs> | null
    /**
     * Filter, which District to fetch.
     */
    where: DistrictWhereUniqueInput
  }

  /**
   * District findUniqueOrThrow
   */
  export type DistrictFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the District
     */
    select?: DistrictSelect<ExtArgs> | null
    /**
     * Omit specific fields from the District
     */
    omit?: DistrictOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DistrictInclude<ExtArgs> | null
    /**
     * Filter, which District to fetch.
     */
    where: DistrictWhereUniqueInput
  }

  /**
   * District findFirst
   */
  export type DistrictFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the District
     */
    select?: DistrictSelect<ExtArgs> | null
    /**
     * Omit specific fields from the District
     */
    omit?: DistrictOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DistrictInclude<ExtArgs> | null
    /**
     * Filter, which District to fetch.
     */
    where?: DistrictWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Districts to fetch.
     */
    orderBy?: DistrictOrderByWithRelationInput | DistrictOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Districts.
     */
    cursor?: DistrictWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Districts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Districts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Districts.
     */
    distinct?: DistrictScalarFieldEnum | DistrictScalarFieldEnum[]
  }

  /**
   * District findFirstOrThrow
   */
  export type DistrictFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the District
     */
    select?: DistrictSelect<ExtArgs> | null
    /**
     * Omit specific fields from the District
     */
    omit?: DistrictOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DistrictInclude<ExtArgs> | null
    /**
     * Filter, which District to fetch.
     */
    where?: DistrictWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Districts to fetch.
     */
    orderBy?: DistrictOrderByWithRelationInput | DistrictOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Districts.
     */
    cursor?: DistrictWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Districts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Districts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Districts.
     */
    distinct?: DistrictScalarFieldEnum | DistrictScalarFieldEnum[]
  }

  /**
   * District findMany
   */
  export type DistrictFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the District
     */
    select?: DistrictSelect<ExtArgs> | null
    /**
     * Omit specific fields from the District
     */
    omit?: DistrictOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DistrictInclude<ExtArgs> | null
    /**
     * Filter, which Districts to fetch.
     */
    where?: DistrictWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Districts to fetch.
     */
    orderBy?: DistrictOrderByWithRelationInput | DistrictOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Districts.
     */
    cursor?: DistrictWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Districts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Districts.
     */
    skip?: number
    distinct?: DistrictScalarFieldEnum | DistrictScalarFieldEnum[]
  }

  /**
   * District create
   */
  export type DistrictCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the District
     */
    select?: DistrictSelect<ExtArgs> | null
    /**
     * Omit specific fields from the District
     */
    omit?: DistrictOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DistrictInclude<ExtArgs> | null
    /**
     * The data needed to create a District.
     */
    data: XOR<DistrictCreateInput, DistrictUncheckedCreateInput>
  }

  /**
   * District createMany
   */
  export type DistrictCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Districts.
     */
    data: DistrictCreateManyInput | DistrictCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * District createManyAndReturn
   */
  export type DistrictCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the District
     */
    select?: DistrictSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the District
     */
    omit?: DistrictOmit<ExtArgs> | null
    /**
     * The data used to create many Districts.
     */
    data: DistrictCreateManyInput | DistrictCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * District update
   */
  export type DistrictUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the District
     */
    select?: DistrictSelect<ExtArgs> | null
    /**
     * Omit specific fields from the District
     */
    omit?: DistrictOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DistrictInclude<ExtArgs> | null
    /**
     * The data needed to update a District.
     */
    data: XOR<DistrictUpdateInput, DistrictUncheckedUpdateInput>
    /**
     * Choose, which District to update.
     */
    where: DistrictWhereUniqueInput
  }

  /**
   * District updateMany
   */
  export type DistrictUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Districts.
     */
    data: XOR<DistrictUpdateManyMutationInput, DistrictUncheckedUpdateManyInput>
    /**
     * Filter which Districts to update
     */
    where?: DistrictWhereInput
    /**
     * Limit how many Districts to update.
     */
    limit?: number
  }

  /**
   * District updateManyAndReturn
   */
  export type DistrictUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the District
     */
    select?: DistrictSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the District
     */
    omit?: DistrictOmit<ExtArgs> | null
    /**
     * The data used to update Districts.
     */
    data: XOR<DistrictUpdateManyMutationInput, DistrictUncheckedUpdateManyInput>
    /**
     * Filter which Districts to update
     */
    where?: DistrictWhereInput
    /**
     * Limit how many Districts to update.
     */
    limit?: number
  }

  /**
   * District upsert
   */
  export type DistrictUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the District
     */
    select?: DistrictSelect<ExtArgs> | null
    /**
     * Omit specific fields from the District
     */
    omit?: DistrictOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DistrictInclude<ExtArgs> | null
    /**
     * The filter to search for the District to update in case it exists.
     */
    where: DistrictWhereUniqueInput
    /**
     * In case the District found by the `where` argument doesn't exist, create a new District with this data.
     */
    create: XOR<DistrictCreateInput, DistrictUncheckedCreateInput>
    /**
     * In case the District was found with the provided `where` argument, update it with this data.
     */
    update: XOR<DistrictUpdateInput, DistrictUncheckedUpdateInput>
  }

  /**
   * District delete
   */
  export type DistrictDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the District
     */
    select?: DistrictSelect<ExtArgs> | null
    /**
     * Omit specific fields from the District
     */
    omit?: DistrictOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DistrictInclude<ExtArgs> | null
    /**
     * Filter which District to delete.
     */
    where: DistrictWhereUniqueInput
  }

  /**
   * District deleteMany
   */
  export type DistrictDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Districts to delete
     */
    where?: DistrictWhereInput
    /**
     * Limit how many Districts to delete.
     */
    limit?: number
  }

  /**
   * District.facilities
   */
  export type District$facilitiesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Facility
     */
    select?: FacilitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Facility
     */
    omit?: FacilityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FacilityInclude<ExtArgs> | null
    where?: FacilityWhereInput
    orderBy?: FacilityOrderByWithRelationInput | FacilityOrderByWithRelationInput[]
    cursor?: FacilityWhereUniqueInput
    take?: number
    skip?: number
    distinct?: FacilityScalarFieldEnum | FacilityScalarFieldEnum[]
  }

  /**
   * District.monthly_data
   */
  export type District$monthly_dataArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MonthlyHealthData
     */
    select?: MonthlyHealthDataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MonthlyHealthData
     */
    omit?: MonthlyHealthDataOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MonthlyHealthDataInclude<ExtArgs> | null
    where?: MonthlyHealthDataWhereInput
    orderBy?: MonthlyHealthDataOrderByWithRelationInput | MonthlyHealthDataOrderByWithRelationInput[]
    cursor?: MonthlyHealthDataWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MonthlyHealthDataScalarFieldEnum | MonthlyHealthDataScalarFieldEnum[]
  }

  /**
   * District without action
   */
  export type DistrictDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the District
     */
    select?: DistrictSelect<ExtArgs> | null
    /**
     * Omit specific fields from the District
     */
    omit?: DistrictOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DistrictInclude<ExtArgs> | null
  }


  /**
   * Model FacilityType
   */

  export type AggregateFacilityType = {
    _count: FacilityTypeCountAggregateOutputType | null
    _avg: FacilityTypeAvgAggregateOutputType | null
    _sum: FacilityTypeSumAggregateOutputType | null
    _min: FacilityTypeMinAggregateOutputType | null
    _max: FacilityTypeMaxAggregateOutputType | null
  }

  export type FacilityTypeAvgAggregateOutputType = {
    id: number | null
  }

  export type FacilityTypeSumAggregateOutputType = {
    id: number | null
  }

  export type FacilityTypeMinAggregateOutputType = {
    id: number | null
    name: string | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type FacilityTypeMaxAggregateOutputType = {
    id: number | null
    name: string | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type FacilityTypeCountAggregateOutputType = {
    id: number
    name: number
    created_at: number
    updated_at: number
    _all: number
  }


  export type FacilityTypeAvgAggregateInputType = {
    id?: true
  }

  export type FacilityTypeSumAggregateInputType = {
    id?: true
  }

  export type FacilityTypeMinAggregateInputType = {
    id?: true
    name?: true
    created_at?: true
    updated_at?: true
  }

  export type FacilityTypeMaxAggregateInputType = {
    id?: true
    name?: true
    created_at?: true
    updated_at?: true
  }

  export type FacilityTypeCountAggregateInputType = {
    id?: true
    name?: true
    created_at?: true
    updated_at?: true
    _all?: true
  }

  export type FacilityTypeAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which FacilityType to aggregate.
     */
    where?: FacilityTypeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FacilityTypes to fetch.
     */
    orderBy?: FacilityTypeOrderByWithRelationInput | FacilityTypeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: FacilityTypeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FacilityTypes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FacilityTypes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned FacilityTypes
    **/
    _count?: true | FacilityTypeCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: FacilityTypeAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: FacilityTypeSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: FacilityTypeMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: FacilityTypeMaxAggregateInputType
  }

  export type GetFacilityTypeAggregateType<T extends FacilityTypeAggregateArgs> = {
        [P in keyof T & keyof AggregateFacilityType]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateFacilityType[P]>
      : GetScalarType<T[P], AggregateFacilityType[P]>
  }




  export type FacilityTypeGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FacilityTypeWhereInput
    orderBy?: FacilityTypeOrderByWithAggregationInput | FacilityTypeOrderByWithAggregationInput[]
    by: FacilityTypeScalarFieldEnum[] | FacilityTypeScalarFieldEnum
    having?: FacilityTypeScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: FacilityTypeCountAggregateInputType | true
    _avg?: FacilityTypeAvgAggregateInputType
    _sum?: FacilityTypeSumAggregateInputType
    _min?: FacilityTypeMinAggregateInputType
    _max?: FacilityTypeMaxAggregateInputType
  }

  export type FacilityTypeGroupByOutputType = {
    id: number
    name: string
    created_at: Date
    updated_at: Date
    _count: FacilityTypeCountAggregateOutputType | null
    _avg: FacilityTypeAvgAggregateOutputType | null
    _sum: FacilityTypeSumAggregateOutputType | null
    _min: FacilityTypeMinAggregateOutputType | null
    _max: FacilityTypeMaxAggregateOutputType | null
  }

  type GetFacilityTypeGroupByPayload<T extends FacilityTypeGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<FacilityTypeGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof FacilityTypeGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], FacilityTypeGroupByOutputType[P]>
            : GetScalarType<T[P], FacilityTypeGroupByOutputType[P]>
        }
      >
    >


  export type FacilityTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    created_at?: boolean
    updated_at?: boolean
    facilities?: boolean | FacilityType$facilitiesArgs<ExtArgs>
    _count?: boolean | FacilityTypeCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["facilityType"]>

  export type FacilityTypeSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    created_at?: boolean
    updated_at?: boolean
  }, ExtArgs["result"]["facilityType"]>

  export type FacilityTypeSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    created_at?: boolean
    updated_at?: boolean
  }, ExtArgs["result"]["facilityType"]>

  export type FacilityTypeSelectScalar = {
    id?: boolean
    name?: boolean
    created_at?: boolean
    updated_at?: boolean
  }

  export type FacilityTypeOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "created_at" | "updated_at", ExtArgs["result"]["facilityType"]>
  export type FacilityTypeInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    facilities?: boolean | FacilityType$facilitiesArgs<ExtArgs>
    _count?: boolean | FacilityTypeCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type FacilityTypeIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type FacilityTypeIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $FacilityTypePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "FacilityType"
    objects: {
      facilities: Prisma.$FacilityPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      name: string
      created_at: Date
      updated_at: Date
    }, ExtArgs["result"]["facilityType"]>
    composites: {}
  }

  type FacilityTypeGetPayload<S extends boolean | null | undefined | FacilityTypeDefaultArgs> = $Result.GetResult<Prisma.$FacilityTypePayload, S>

  type FacilityTypeCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<FacilityTypeFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: FacilityTypeCountAggregateInputType | true
    }

  export interface FacilityTypeDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['FacilityType'], meta: { name: 'FacilityType' } }
    /**
     * Find zero or one FacilityType that matches the filter.
     * @param {FacilityTypeFindUniqueArgs} args - Arguments to find a FacilityType
     * @example
     * // Get one FacilityType
     * const facilityType = await prisma.facilityType.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends FacilityTypeFindUniqueArgs>(args: SelectSubset<T, FacilityTypeFindUniqueArgs<ExtArgs>>): Prisma__FacilityTypeClient<$Result.GetResult<Prisma.$FacilityTypePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one FacilityType that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {FacilityTypeFindUniqueOrThrowArgs} args - Arguments to find a FacilityType
     * @example
     * // Get one FacilityType
     * const facilityType = await prisma.facilityType.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends FacilityTypeFindUniqueOrThrowArgs>(args: SelectSubset<T, FacilityTypeFindUniqueOrThrowArgs<ExtArgs>>): Prisma__FacilityTypeClient<$Result.GetResult<Prisma.$FacilityTypePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first FacilityType that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FacilityTypeFindFirstArgs} args - Arguments to find a FacilityType
     * @example
     * // Get one FacilityType
     * const facilityType = await prisma.facilityType.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends FacilityTypeFindFirstArgs>(args?: SelectSubset<T, FacilityTypeFindFirstArgs<ExtArgs>>): Prisma__FacilityTypeClient<$Result.GetResult<Prisma.$FacilityTypePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first FacilityType that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FacilityTypeFindFirstOrThrowArgs} args - Arguments to find a FacilityType
     * @example
     * // Get one FacilityType
     * const facilityType = await prisma.facilityType.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends FacilityTypeFindFirstOrThrowArgs>(args?: SelectSubset<T, FacilityTypeFindFirstOrThrowArgs<ExtArgs>>): Prisma__FacilityTypeClient<$Result.GetResult<Prisma.$FacilityTypePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more FacilityTypes that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FacilityTypeFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all FacilityTypes
     * const facilityTypes = await prisma.facilityType.findMany()
     * 
     * // Get first 10 FacilityTypes
     * const facilityTypes = await prisma.facilityType.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const facilityTypeWithIdOnly = await prisma.facilityType.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends FacilityTypeFindManyArgs>(args?: SelectSubset<T, FacilityTypeFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FacilityTypePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a FacilityType.
     * @param {FacilityTypeCreateArgs} args - Arguments to create a FacilityType.
     * @example
     * // Create one FacilityType
     * const FacilityType = await prisma.facilityType.create({
     *   data: {
     *     // ... data to create a FacilityType
     *   }
     * })
     * 
     */
    create<T extends FacilityTypeCreateArgs>(args: SelectSubset<T, FacilityTypeCreateArgs<ExtArgs>>): Prisma__FacilityTypeClient<$Result.GetResult<Prisma.$FacilityTypePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many FacilityTypes.
     * @param {FacilityTypeCreateManyArgs} args - Arguments to create many FacilityTypes.
     * @example
     * // Create many FacilityTypes
     * const facilityType = await prisma.facilityType.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends FacilityTypeCreateManyArgs>(args?: SelectSubset<T, FacilityTypeCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many FacilityTypes and returns the data saved in the database.
     * @param {FacilityTypeCreateManyAndReturnArgs} args - Arguments to create many FacilityTypes.
     * @example
     * // Create many FacilityTypes
     * const facilityType = await prisma.facilityType.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many FacilityTypes and only return the `id`
     * const facilityTypeWithIdOnly = await prisma.facilityType.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends FacilityTypeCreateManyAndReturnArgs>(args?: SelectSubset<T, FacilityTypeCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FacilityTypePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a FacilityType.
     * @param {FacilityTypeDeleteArgs} args - Arguments to delete one FacilityType.
     * @example
     * // Delete one FacilityType
     * const FacilityType = await prisma.facilityType.delete({
     *   where: {
     *     // ... filter to delete one FacilityType
     *   }
     * })
     * 
     */
    delete<T extends FacilityTypeDeleteArgs>(args: SelectSubset<T, FacilityTypeDeleteArgs<ExtArgs>>): Prisma__FacilityTypeClient<$Result.GetResult<Prisma.$FacilityTypePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one FacilityType.
     * @param {FacilityTypeUpdateArgs} args - Arguments to update one FacilityType.
     * @example
     * // Update one FacilityType
     * const facilityType = await prisma.facilityType.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends FacilityTypeUpdateArgs>(args: SelectSubset<T, FacilityTypeUpdateArgs<ExtArgs>>): Prisma__FacilityTypeClient<$Result.GetResult<Prisma.$FacilityTypePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more FacilityTypes.
     * @param {FacilityTypeDeleteManyArgs} args - Arguments to filter FacilityTypes to delete.
     * @example
     * // Delete a few FacilityTypes
     * const { count } = await prisma.facilityType.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends FacilityTypeDeleteManyArgs>(args?: SelectSubset<T, FacilityTypeDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more FacilityTypes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FacilityTypeUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many FacilityTypes
     * const facilityType = await prisma.facilityType.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends FacilityTypeUpdateManyArgs>(args: SelectSubset<T, FacilityTypeUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more FacilityTypes and returns the data updated in the database.
     * @param {FacilityTypeUpdateManyAndReturnArgs} args - Arguments to update many FacilityTypes.
     * @example
     * // Update many FacilityTypes
     * const facilityType = await prisma.facilityType.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more FacilityTypes and only return the `id`
     * const facilityTypeWithIdOnly = await prisma.facilityType.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends FacilityTypeUpdateManyAndReturnArgs>(args: SelectSubset<T, FacilityTypeUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FacilityTypePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one FacilityType.
     * @param {FacilityTypeUpsertArgs} args - Arguments to update or create a FacilityType.
     * @example
     * // Update or create a FacilityType
     * const facilityType = await prisma.facilityType.upsert({
     *   create: {
     *     // ... data to create a FacilityType
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the FacilityType we want to update
     *   }
     * })
     */
    upsert<T extends FacilityTypeUpsertArgs>(args: SelectSubset<T, FacilityTypeUpsertArgs<ExtArgs>>): Prisma__FacilityTypeClient<$Result.GetResult<Prisma.$FacilityTypePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of FacilityTypes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FacilityTypeCountArgs} args - Arguments to filter FacilityTypes to count.
     * @example
     * // Count the number of FacilityTypes
     * const count = await prisma.facilityType.count({
     *   where: {
     *     // ... the filter for the FacilityTypes we want to count
     *   }
     * })
    **/
    count<T extends FacilityTypeCountArgs>(
      args?: Subset<T, FacilityTypeCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], FacilityTypeCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a FacilityType.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FacilityTypeAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends FacilityTypeAggregateArgs>(args: Subset<T, FacilityTypeAggregateArgs>): Prisma.PrismaPromise<GetFacilityTypeAggregateType<T>>

    /**
     * Group by FacilityType.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FacilityTypeGroupByArgs} args - Group by arguments.
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
      T extends FacilityTypeGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: FacilityTypeGroupByArgs['orderBy'] }
        : { orderBy?: FacilityTypeGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, FacilityTypeGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetFacilityTypeGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the FacilityType model
   */
  readonly fields: FacilityTypeFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for FacilityType.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__FacilityTypeClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    facilities<T extends FacilityType$facilitiesArgs<ExtArgs> = {}>(args?: Subset<T, FacilityType$facilitiesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FacilityPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the FacilityType model
   */
  interface FacilityTypeFieldRefs {
    readonly id: FieldRef<"FacilityType", 'Int'>
    readonly name: FieldRef<"FacilityType", 'String'>
    readonly created_at: FieldRef<"FacilityType", 'DateTime'>
    readonly updated_at: FieldRef<"FacilityType", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * FacilityType findUnique
   */
  export type FacilityTypeFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FacilityType
     */
    select?: FacilityTypeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FacilityType
     */
    omit?: FacilityTypeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FacilityTypeInclude<ExtArgs> | null
    /**
     * Filter, which FacilityType to fetch.
     */
    where: FacilityTypeWhereUniqueInput
  }

  /**
   * FacilityType findUniqueOrThrow
   */
  export type FacilityTypeFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FacilityType
     */
    select?: FacilityTypeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FacilityType
     */
    omit?: FacilityTypeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FacilityTypeInclude<ExtArgs> | null
    /**
     * Filter, which FacilityType to fetch.
     */
    where: FacilityTypeWhereUniqueInput
  }

  /**
   * FacilityType findFirst
   */
  export type FacilityTypeFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FacilityType
     */
    select?: FacilityTypeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FacilityType
     */
    omit?: FacilityTypeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FacilityTypeInclude<ExtArgs> | null
    /**
     * Filter, which FacilityType to fetch.
     */
    where?: FacilityTypeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FacilityTypes to fetch.
     */
    orderBy?: FacilityTypeOrderByWithRelationInput | FacilityTypeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for FacilityTypes.
     */
    cursor?: FacilityTypeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FacilityTypes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FacilityTypes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of FacilityTypes.
     */
    distinct?: FacilityTypeScalarFieldEnum | FacilityTypeScalarFieldEnum[]
  }

  /**
   * FacilityType findFirstOrThrow
   */
  export type FacilityTypeFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FacilityType
     */
    select?: FacilityTypeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FacilityType
     */
    omit?: FacilityTypeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FacilityTypeInclude<ExtArgs> | null
    /**
     * Filter, which FacilityType to fetch.
     */
    where?: FacilityTypeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FacilityTypes to fetch.
     */
    orderBy?: FacilityTypeOrderByWithRelationInput | FacilityTypeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for FacilityTypes.
     */
    cursor?: FacilityTypeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FacilityTypes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FacilityTypes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of FacilityTypes.
     */
    distinct?: FacilityTypeScalarFieldEnum | FacilityTypeScalarFieldEnum[]
  }

  /**
   * FacilityType findMany
   */
  export type FacilityTypeFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FacilityType
     */
    select?: FacilityTypeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FacilityType
     */
    omit?: FacilityTypeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FacilityTypeInclude<ExtArgs> | null
    /**
     * Filter, which FacilityTypes to fetch.
     */
    where?: FacilityTypeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FacilityTypes to fetch.
     */
    orderBy?: FacilityTypeOrderByWithRelationInput | FacilityTypeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing FacilityTypes.
     */
    cursor?: FacilityTypeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FacilityTypes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FacilityTypes.
     */
    skip?: number
    distinct?: FacilityTypeScalarFieldEnum | FacilityTypeScalarFieldEnum[]
  }

  /**
   * FacilityType create
   */
  export type FacilityTypeCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FacilityType
     */
    select?: FacilityTypeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FacilityType
     */
    omit?: FacilityTypeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FacilityTypeInclude<ExtArgs> | null
    /**
     * The data needed to create a FacilityType.
     */
    data: XOR<FacilityTypeCreateInput, FacilityTypeUncheckedCreateInput>
  }

  /**
   * FacilityType createMany
   */
  export type FacilityTypeCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many FacilityTypes.
     */
    data: FacilityTypeCreateManyInput | FacilityTypeCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * FacilityType createManyAndReturn
   */
  export type FacilityTypeCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FacilityType
     */
    select?: FacilityTypeSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the FacilityType
     */
    omit?: FacilityTypeOmit<ExtArgs> | null
    /**
     * The data used to create many FacilityTypes.
     */
    data: FacilityTypeCreateManyInput | FacilityTypeCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * FacilityType update
   */
  export type FacilityTypeUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FacilityType
     */
    select?: FacilityTypeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FacilityType
     */
    omit?: FacilityTypeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FacilityTypeInclude<ExtArgs> | null
    /**
     * The data needed to update a FacilityType.
     */
    data: XOR<FacilityTypeUpdateInput, FacilityTypeUncheckedUpdateInput>
    /**
     * Choose, which FacilityType to update.
     */
    where: FacilityTypeWhereUniqueInput
  }

  /**
   * FacilityType updateMany
   */
  export type FacilityTypeUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update FacilityTypes.
     */
    data: XOR<FacilityTypeUpdateManyMutationInput, FacilityTypeUncheckedUpdateManyInput>
    /**
     * Filter which FacilityTypes to update
     */
    where?: FacilityTypeWhereInput
    /**
     * Limit how many FacilityTypes to update.
     */
    limit?: number
  }

  /**
   * FacilityType updateManyAndReturn
   */
  export type FacilityTypeUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FacilityType
     */
    select?: FacilityTypeSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the FacilityType
     */
    omit?: FacilityTypeOmit<ExtArgs> | null
    /**
     * The data used to update FacilityTypes.
     */
    data: XOR<FacilityTypeUpdateManyMutationInput, FacilityTypeUncheckedUpdateManyInput>
    /**
     * Filter which FacilityTypes to update
     */
    where?: FacilityTypeWhereInput
    /**
     * Limit how many FacilityTypes to update.
     */
    limit?: number
  }

  /**
   * FacilityType upsert
   */
  export type FacilityTypeUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FacilityType
     */
    select?: FacilityTypeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FacilityType
     */
    omit?: FacilityTypeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FacilityTypeInclude<ExtArgs> | null
    /**
     * The filter to search for the FacilityType to update in case it exists.
     */
    where: FacilityTypeWhereUniqueInput
    /**
     * In case the FacilityType found by the `where` argument doesn't exist, create a new FacilityType with this data.
     */
    create: XOR<FacilityTypeCreateInput, FacilityTypeUncheckedCreateInput>
    /**
     * In case the FacilityType was found with the provided `where` argument, update it with this data.
     */
    update: XOR<FacilityTypeUpdateInput, FacilityTypeUncheckedUpdateInput>
  }

  /**
   * FacilityType delete
   */
  export type FacilityTypeDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FacilityType
     */
    select?: FacilityTypeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FacilityType
     */
    omit?: FacilityTypeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FacilityTypeInclude<ExtArgs> | null
    /**
     * Filter which FacilityType to delete.
     */
    where: FacilityTypeWhereUniqueInput
  }

  /**
   * FacilityType deleteMany
   */
  export type FacilityTypeDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which FacilityTypes to delete
     */
    where?: FacilityTypeWhereInput
    /**
     * Limit how many FacilityTypes to delete.
     */
    limit?: number
  }

  /**
   * FacilityType.facilities
   */
  export type FacilityType$facilitiesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Facility
     */
    select?: FacilitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Facility
     */
    omit?: FacilityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FacilityInclude<ExtArgs> | null
    where?: FacilityWhereInput
    orderBy?: FacilityOrderByWithRelationInput | FacilityOrderByWithRelationInput[]
    cursor?: FacilityWhereUniqueInput
    take?: number
    skip?: number
    distinct?: FacilityScalarFieldEnum | FacilityScalarFieldEnum[]
  }

  /**
   * FacilityType without action
   */
  export type FacilityTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FacilityType
     */
    select?: FacilityTypeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FacilityType
     */
    omit?: FacilityTypeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FacilityTypeInclude<ExtArgs> | null
  }


  /**
   * Model Facility
   */

  export type AggregateFacility = {
    _count: FacilityCountAggregateOutputType | null
    _avg: FacilityAvgAggregateOutputType | null
    _sum: FacilitySumAggregateOutputType | null
    _min: FacilityMinAggregateOutputType | null
    _max: FacilityMaxAggregateOutputType | null
  }

  export type FacilityAvgAggregateOutputType = {
    id: number | null
    district_id: number | null
    facility_type_id: number | null
  }

  export type FacilitySumAggregateOutputType = {
    id: number | null
    district_id: number | null
    facility_type_id: number | null
  }

  export type FacilityMinAggregateOutputType = {
    id: number | null
    name: string | null
    district_id: number | null
    facility_type_id: number | null
    created_at: Date | null
    updated_at: Date | null
    facility_code: string | null
    nin: string | null
  }

  export type FacilityMaxAggregateOutputType = {
    id: number | null
    name: string | null
    district_id: number | null
    facility_type_id: number | null
    created_at: Date | null
    updated_at: Date | null
    facility_code: string | null
    nin: string | null
  }

  export type FacilityCountAggregateOutputType = {
    id: number
    name: number
    district_id: number
    facility_type_id: number
    created_at: number
    updated_at: number
    facility_code: number
    nin: number
    _all: number
  }


  export type FacilityAvgAggregateInputType = {
    id?: true
    district_id?: true
    facility_type_id?: true
  }

  export type FacilitySumAggregateInputType = {
    id?: true
    district_id?: true
    facility_type_id?: true
  }

  export type FacilityMinAggregateInputType = {
    id?: true
    name?: true
    district_id?: true
    facility_type_id?: true
    created_at?: true
    updated_at?: true
    facility_code?: true
    nin?: true
  }

  export type FacilityMaxAggregateInputType = {
    id?: true
    name?: true
    district_id?: true
    facility_type_id?: true
    created_at?: true
    updated_at?: true
    facility_code?: true
    nin?: true
  }

  export type FacilityCountAggregateInputType = {
    id?: true
    name?: true
    district_id?: true
    facility_type_id?: true
    created_at?: true
    updated_at?: true
    facility_code?: true
    nin?: true
    _all?: true
  }

  export type FacilityAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Facility to aggregate.
     */
    where?: FacilityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Facilities to fetch.
     */
    orderBy?: FacilityOrderByWithRelationInput | FacilityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: FacilityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Facilities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Facilities.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Facilities
    **/
    _count?: true | FacilityCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: FacilityAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: FacilitySumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: FacilityMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: FacilityMaxAggregateInputType
  }

  export type GetFacilityAggregateType<T extends FacilityAggregateArgs> = {
        [P in keyof T & keyof AggregateFacility]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateFacility[P]>
      : GetScalarType<T[P], AggregateFacility[P]>
  }




  export type FacilityGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FacilityWhereInput
    orderBy?: FacilityOrderByWithAggregationInput | FacilityOrderByWithAggregationInput[]
    by: FacilityScalarFieldEnum[] | FacilityScalarFieldEnum
    having?: FacilityScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: FacilityCountAggregateInputType | true
    _avg?: FacilityAvgAggregateInputType
    _sum?: FacilitySumAggregateInputType
    _min?: FacilityMinAggregateInputType
    _max?: FacilityMaxAggregateInputType
  }

  export type FacilityGroupByOutputType = {
    id: number
    name: string
    district_id: number
    facility_type_id: number
    created_at: Date
    updated_at: Date
    facility_code: string | null
    nin: string | null
    _count: FacilityCountAggregateOutputType | null
    _avg: FacilityAvgAggregateOutputType | null
    _sum: FacilitySumAggregateOutputType | null
    _min: FacilityMinAggregateOutputType | null
    _max: FacilityMaxAggregateOutputType | null
  }

  type GetFacilityGroupByPayload<T extends FacilityGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<FacilityGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof FacilityGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], FacilityGroupByOutputType[P]>
            : GetScalarType<T[P], FacilityGroupByOutputType[P]>
        }
      >
    >


  export type FacilitySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    district_id?: boolean
    facility_type_id?: boolean
    created_at?: boolean
    updated_at?: boolean
    facility_code?: boolean
    nin?: boolean
    district?: boolean | DistrictDefaultArgs<ExtArgs>
    facility_type?: boolean | FacilityTypeDefaultArgs<ExtArgs>
    monthly_data?: boolean | Facility$monthly_dataArgs<ExtArgs>
    sub_centre?: boolean | Facility$sub_centreArgs<ExtArgs>
    _count?: boolean | FacilityCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["facility"]>

  export type FacilitySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    district_id?: boolean
    facility_type_id?: boolean
    created_at?: boolean
    updated_at?: boolean
    facility_code?: boolean
    nin?: boolean
    district?: boolean | DistrictDefaultArgs<ExtArgs>
    facility_type?: boolean | FacilityTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["facility"]>

  export type FacilitySelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    district_id?: boolean
    facility_type_id?: boolean
    created_at?: boolean
    updated_at?: boolean
    facility_code?: boolean
    nin?: boolean
    district?: boolean | DistrictDefaultArgs<ExtArgs>
    facility_type?: boolean | FacilityTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["facility"]>

  export type FacilitySelectScalar = {
    id?: boolean
    name?: boolean
    district_id?: boolean
    facility_type_id?: boolean
    created_at?: boolean
    updated_at?: boolean
    facility_code?: boolean
    nin?: boolean
  }

  export type FacilityOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "district_id" | "facility_type_id" | "created_at" | "updated_at" | "facility_code" | "nin", ExtArgs["result"]["facility"]>
  export type FacilityInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    district?: boolean | DistrictDefaultArgs<ExtArgs>
    facility_type?: boolean | FacilityTypeDefaultArgs<ExtArgs>
    monthly_data?: boolean | Facility$monthly_dataArgs<ExtArgs>
    sub_centre?: boolean | Facility$sub_centreArgs<ExtArgs>
    _count?: boolean | FacilityCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type FacilityIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    district?: boolean | DistrictDefaultArgs<ExtArgs>
    facility_type?: boolean | FacilityTypeDefaultArgs<ExtArgs>
  }
  export type FacilityIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    district?: boolean | DistrictDefaultArgs<ExtArgs>
    facility_type?: boolean | FacilityTypeDefaultArgs<ExtArgs>
  }

  export type $FacilityPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Facility"
    objects: {
      district: Prisma.$DistrictPayload<ExtArgs>
      facility_type: Prisma.$FacilityTypePayload<ExtArgs>
      monthly_data: Prisma.$MonthlyHealthDataPayload<ExtArgs>[]
      sub_centre: Prisma.$sub_centrePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      name: string
      district_id: number
      facility_type_id: number
      created_at: Date
      updated_at: Date
      facility_code: string | null
      nin: string | null
    }, ExtArgs["result"]["facility"]>
    composites: {}
  }

  type FacilityGetPayload<S extends boolean | null | undefined | FacilityDefaultArgs> = $Result.GetResult<Prisma.$FacilityPayload, S>

  type FacilityCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<FacilityFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: FacilityCountAggregateInputType | true
    }

  export interface FacilityDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Facility'], meta: { name: 'Facility' } }
    /**
     * Find zero or one Facility that matches the filter.
     * @param {FacilityFindUniqueArgs} args - Arguments to find a Facility
     * @example
     * // Get one Facility
     * const facility = await prisma.facility.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends FacilityFindUniqueArgs>(args: SelectSubset<T, FacilityFindUniqueArgs<ExtArgs>>): Prisma__FacilityClient<$Result.GetResult<Prisma.$FacilityPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Facility that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {FacilityFindUniqueOrThrowArgs} args - Arguments to find a Facility
     * @example
     * // Get one Facility
     * const facility = await prisma.facility.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends FacilityFindUniqueOrThrowArgs>(args: SelectSubset<T, FacilityFindUniqueOrThrowArgs<ExtArgs>>): Prisma__FacilityClient<$Result.GetResult<Prisma.$FacilityPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Facility that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FacilityFindFirstArgs} args - Arguments to find a Facility
     * @example
     * // Get one Facility
     * const facility = await prisma.facility.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends FacilityFindFirstArgs>(args?: SelectSubset<T, FacilityFindFirstArgs<ExtArgs>>): Prisma__FacilityClient<$Result.GetResult<Prisma.$FacilityPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Facility that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FacilityFindFirstOrThrowArgs} args - Arguments to find a Facility
     * @example
     * // Get one Facility
     * const facility = await prisma.facility.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends FacilityFindFirstOrThrowArgs>(args?: SelectSubset<T, FacilityFindFirstOrThrowArgs<ExtArgs>>): Prisma__FacilityClient<$Result.GetResult<Prisma.$FacilityPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Facilities that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FacilityFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Facilities
     * const facilities = await prisma.facility.findMany()
     * 
     * // Get first 10 Facilities
     * const facilities = await prisma.facility.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const facilityWithIdOnly = await prisma.facility.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends FacilityFindManyArgs>(args?: SelectSubset<T, FacilityFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FacilityPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Facility.
     * @param {FacilityCreateArgs} args - Arguments to create a Facility.
     * @example
     * // Create one Facility
     * const Facility = await prisma.facility.create({
     *   data: {
     *     // ... data to create a Facility
     *   }
     * })
     * 
     */
    create<T extends FacilityCreateArgs>(args: SelectSubset<T, FacilityCreateArgs<ExtArgs>>): Prisma__FacilityClient<$Result.GetResult<Prisma.$FacilityPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Facilities.
     * @param {FacilityCreateManyArgs} args - Arguments to create many Facilities.
     * @example
     * // Create many Facilities
     * const facility = await prisma.facility.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends FacilityCreateManyArgs>(args?: SelectSubset<T, FacilityCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Facilities and returns the data saved in the database.
     * @param {FacilityCreateManyAndReturnArgs} args - Arguments to create many Facilities.
     * @example
     * // Create many Facilities
     * const facility = await prisma.facility.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Facilities and only return the `id`
     * const facilityWithIdOnly = await prisma.facility.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends FacilityCreateManyAndReturnArgs>(args?: SelectSubset<T, FacilityCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FacilityPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Facility.
     * @param {FacilityDeleteArgs} args - Arguments to delete one Facility.
     * @example
     * // Delete one Facility
     * const Facility = await prisma.facility.delete({
     *   where: {
     *     // ... filter to delete one Facility
     *   }
     * })
     * 
     */
    delete<T extends FacilityDeleteArgs>(args: SelectSubset<T, FacilityDeleteArgs<ExtArgs>>): Prisma__FacilityClient<$Result.GetResult<Prisma.$FacilityPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Facility.
     * @param {FacilityUpdateArgs} args - Arguments to update one Facility.
     * @example
     * // Update one Facility
     * const facility = await prisma.facility.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends FacilityUpdateArgs>(args: SelectSubset<T, FacilityUpdateArgs<ExtArgs>>): Prisma__FacilityClient<$Result.GetResult<Prisma.$FacilityPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Facilities.
     * @param {FacilityDeleteManyArgs} args - Arguments to filter Facilities to delete.
     * @example
     * // Delete a few Facilities
     * const { count } = await prisma.facility.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends FacilityDeleteManyArgs>(args?: SelectSubset<T, FacilityDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Facilities.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FacilityUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Facilities
     * const facility = await prisma.facility.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends FacilityUpdateManyArgs>(args: SelectSubset<T, FacilityUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Facilities and returns the data updated in the database.
     * @param {FacilityUpdateManyAndReturnArgs} args - Arguments to update many Facilities.
     * @example
     * // Update many Facilities
     * const facility = await prisma.facility.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Facilities and only return the `id`
     * const facilityWithIdOnly = await prisma.facility.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends FacilityUpdateManyAndReturnArgs>(args: SelectSubset<T, FacilityUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FacilityPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Facility.
     * @param {FacilityUpsertArgs} args - Arguments to update or create a Facility.
     * @example
     * // Update or create a Facility
     * const facility = await prisma.facility.upsert({
     *   create: {
     *     // ... data to create a Facility
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Facility we want to update
     *   }
     * })
     */
    upsert<T extends FacilityUpsertArgs>(args: SelectSubset<T, FacilityUpsertArgs<ExtArgs>>): Prisma__FacilityClient<$Result.GetResult<Prisma.$FacilityPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Facilities.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FacilityCountArgs} args - Arguments to filter Facilities to count.
     * @example
     * // Count the number of Facilities
     * const count = await prisma.facility.count({
     *   where: {
     *     // ... the filter for the Facilities we want to count
     *   }
     * })
    **/
    count<T extends FacilityCountArgs>(
      args?: Subset<T, FacilityCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], FacilityCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Facility.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FacilityAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends FacilityAggregateArgs>(args: Subset<T, FacilityAggregateArgs>): Prisma.PrismaPromise<GetFacilityAggregateType<T>>

    /**
     * Group by Facility.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FacilityGroupByArgs} args - Group by arguments.
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
      T extends FacilityGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: FacilityGroupByArgs['orderBy'] }
        : { orderBy?: FacilityGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, FacilityGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetFacilityGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Facility model
   */
  readonly fields: FacilityFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Facility.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__FacilityClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    district<T extends DistrictDefaultArgs<ExtArgs> = {}>(args?: Subset<T, DistrictDefaultArgs<ExtArgs>>): Prisma__DistrictClient<$Result.GetResult<Prisma.$DistrictPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    facility_type<T extends FacilityTypeDefaultArgs<ExtArgs> = {}>(args?: Subset<T, FacilityTypeDefaultArgs<ExtArgs>>): Prisma__FacilityTypeClient<$Result.GetResult<Prisma.$FacilityTypePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    monthly_data<T extends Facility$monthly_dataArgs<ExtArgs> = {}>(args?: Subset<T, Facility$monthly_dataArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MonthlyHealthDataPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    sub_centre<T extends Facility$sub_centreArgs<ExtArgs> = {}>(args?: Subset<T, Facility$sub_centreArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$sub_centrePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the Facility model
   */
  interface FacilityFieldRefs {
    readonly id: FieldRef<"Facility", 'Int'>
    readonly name: FieldRef<"Facility", 'String'>
    readonly district_id: FieldRef<"Facility", 'Int'>
    readonly facility_type_id: FieldRef<"Facility", 'Int'>
    readonly created_at: FieldRef<"Facility", 'DateTime'>
    readonly updated_at: FieldRef<"Facility", 'DateTime'>
    readonly facility_code: FieldRef<"Facility", 'String'>
    readonly nin: FieldRef<"Facility", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Facility findUnique
   */
  export type FacilityFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Facility
     */
    select?: FacilitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Facility
     */
    omit?: FacilityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FacilityInclude<ExtArgs> | null
    /**
     * Filter, which Facility to fetch.
     */
    where: FacilityWhereUniqueInput
  }

  /**
   * Facility findUniqueOrThrow
   */
  export type FacilityFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Facility
     */
    select?: FacilitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Facility
     */
    omit?: FacilityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FacilityInclude<ExtArgs> | null
    /**
     * Filter, which Facility to fetch.
     */
    where: FacilityWhereUniqueInput
  }

  /**
   * Facility findFirst
   */
  export type FacilityFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Facility
     */
    select?: FacilitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Facility
     */
    omit?: FacilityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FacilityInclude<ExtArgs> | null
    /**
     * Filter, which Facility to fetch.
     */
    where?: FacilityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Facilities to fetch.
     */
    orderBy?: FacilityOrderByWithRelationInput | FacilityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Facilities.
     */
    cursor?: FacilityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Facilities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Facilities.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Facilities.
     */
    distinct?: FacilityScalarFieldEnum | FacilityScalarFieldEnum[]
  }

  /**
   * Facility findFirstOrThrow
   */
  export type FacilityFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Facility
     */
    select?: FacilitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Facility
     */
    omit?: FacilityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FacilityInclude<ExtArgs> | null
    /**
     * Filter, which Facility to fetch.
     */
    where?: FacilityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Facilities to fetch.
     */
    orderBy?: FacilityOrderByWithRelationInput | FacilityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Facilities.
     */
    cursor?: FacilityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Facilities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Facilities.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Facilities.
     */
    distinct?: FacilityScalarFieldEnum | FacilityScalarFieldEnum[]
  }

  /**
   * Facility findMany
   */
  export type FacilityFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Facility
     */
    select?: FacilitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Facility
     */
    omit?: FacilityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FacilityInclude<ExtArgs> | null
    /**
     * Filter, which Facilities to fetch.
     */
    where?: FacilityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Facilities to fetch.
     */
    orderBy?: FacilityOrderByWithRelationInput | FacilityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Facilities.
     */
    cursor?: FacilityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Facilities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Facilities.
     */
    skip?: number
    distinct?: FacilityScalarFieldEnum | FacilityScalarFieldEnum[]
  }

  /**
   * Facility create
   */
  export type FacilityCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Facility
     */
    select?: FacilitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Facility
     */
    omit?: FacilityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FacilityInclude<ExtArgs> | null
    /**
     * The data needed to create a Facility.
     */
    data: XOR<FacilityCreateInput, FacilityUncheckedCreateInput>
  }

  /**
   * Facility createMany
   */
  export type FacilityCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Facilities.
     */
    data: FacilityCreateManyInput | FacilityCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Facility createManyAndReturn
   */
  export type FacilityCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Facility
     */
    select?: FacilitySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Facility
     */
    omit?: FacilityOmit<ExtArgs> | null
    /**
     * The data used to create many Facilities.
     */
    data: FacilityCreateManyInput | FacilityCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FacilityIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Facility update
   */
  export type FacilityUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Facility
     */
    select?: FacilitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Facility
     */
    omit?: FacilityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FacilityInclude<ExtArgs> | null
    /**
     * The data needed to update a Facility.
     */
    data: XOR<FacilityUpdateInput, FacilityUncheckedUpdateInput>
    /**
     * Choose, which Facility to update.
     */
    where: FacilityWhereUniqueInput
  }

  /**
   * Facility updateMany
   */
  export type FacilityUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Facilities.
     */
    data: XOR<FacilityUpdateManyMutationInput, FacilityUncheckedUpdateManyInput>
    /**
     * Filter which Facilities to update
     */
    where?: FacilityWhereInput
    /**
     * Limit how many Facilities to update.
     */
    limit?: number
  }

  /**
   * Facility updateManyAndReturn
   */
  export type FacilityUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Facility
     */
    select?: FacilitySelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Facility
     */
    omit?: FacilityOmit<ExtArgs> | null
    /**
     * The data used to update Facilities.
     */
    data: XOR<FacilityUpdateManyMutationInput, FacilityUncheckedUpdateManyInput>
    /**
     * Filter which Facilities to update
     */
    where?: FacilityWhereInput
    /**
     * Limit how many Facilities to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FacilityIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Facility upsert
   */
  export type FacilityUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Facility
     */
    select?: FacilitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Facility
     */
    omit?: FacilityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FacilityInclude<ExtArgs> | null
    /**
     * The filter to search for the Facility to update in case it exists.
     */
    where: FacilityWhereUniqueInput
    /**
     * In case the Facility found by the `where` argument doesn't exist, create a new Facility with this data.
     */
    create: XOR<FacilityCreateInput, FacilityUncheckedCreateInput>
    /**
     * In case the Facility was found with the provided `where` argument, update it with this data.
     */
    update: XOR<FacilityUpdateInput, FacilityUncheckedUpdateInput>
  }

  /**
   * Facility delete
   */
  export type FacilityDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Facility
     */
    select?: FacilitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Facility
     */
    omit?: FacilityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FacilityInclude<ExtArgs> | null
    /**
     * Filter which Facility to delete.
     */
    where: FacilityWhereUniqueInput
  }

  /**
   * Facility deleteMany
   */
  export type FacilityDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Facilities to delete
     */
    where?: FacilityWhereInput
    /**
     * Limit how many Facilities to delete.
     */
    limit?: number
  }

  /**
   * Facility.monthly_data
   */
  export type Facility$monthly_dataArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MonthlyHealthData
     */
    select?: MonthlyHealthDataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MonthlyHealthData
     */
    omit?: MonthlyHealthDataOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MonthlyHealthDataInclude<ExtArgs> | null
    where?: MonthlyHealthDataWhereInput
    orderBy?: MonthlyHealthDataOrderByWithRelationInput | MonthlyHealthDataOrderByWithRelationInput[]
    cursor?: MonthlyHealthDataWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MonthlyHealthDataScalarFieldEnum | MonthlyHealthDataScalarFieldEnum[]
  }

  /**
   * Facility.sub_centre
   */
  export type Facility$sub_centreArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the sub_centre
     */
    select?: sub_centreSelect<ExtArgs> | null
    /**
     * Omit specific fields from the sub_centre
     */
    omit?: sub_centreOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: sub_centreInclude<ExtArgs> | null
    where?: sub_centreWhereInput
    orderBy?: sub_centreOrderByWithRelationInput | sub_centreOrderByWithRelationInput[]
    cursor?: sub_centreWhereUniqueInput
    take?: number
    skip?: number
    distinct?: Sub_centreScalarFieldEnum | Sub_centreScalarFieldEnum[]
  }

  /**
   * Facility without action
   */
  export type FacilityDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Facility
     */
    select?: FacilitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Facility
     */
    omit?: FacilityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FacilityInclude<ExtArgs> | null
  }


  /**
   * Model MonthlyHealthData
   */

  export type AggregateMonthlyHealthData = {
    _count: MonthlyHealthDataCountAggregateOutputType | null
    _avg: MonthlyHealthDataAvgAggregateOutputType | null
    _sum: MonthlyHealthDataSumAggregateOutputType | null
    _min: MonthlyHealthDataMinAggregateOutputType | null
    _max: MonthlyHealthDataMaxAggregateOutputType | null
  }

  export type MonthlyHealthDataAvgAggregateOutputType = {
    id: number | null
    facility_id: number | null
    sub_centre_id: number | null
    district_id: number | null
    indicator_id: number | null
    value: Decimal | null
    uploaded_by: number | null
    approved_by: number | null
    achievement: Decimal | null
    denominator: Decimal | null
    numerator: Decimal | null
    target_value: Decimal | null
  }

  export type MonthlyHealthDataSumAggregateOutputType = {
    id: number | null
    facility_id: number | null
    sub_centre_id: number | null
    district_id: number | null
    indicator_id: number | null
    value: Decimal | null
    uploaded_by: number | null
    approved_by: number | null
    achievement: Decimal | null
    denominator: Decimal | null
    numerator: Decimal | null
    target_value: Decimal | null
  }

  export type MonthlyHealthDataMinAggregateOutputType = {
    id: number | null
    facility_id: number | null
    sub_centre_id: number | null
    district_id: number | null
    indicator_id: number | null
    report_month: string | null
    value: Decimal | null
    data_quality: $Enums.DataQuality | null
    remarks: string | null
    uploaded_by: number | null
    approved_by: number | null
    approved_at: Date | null
    created_at: Date | null
    updated_at: Date | null
    achievement: Decimal | null
    denominator: Decimal | null
    numerator: Decimal | null
    target_value: Decimal | null
  }

  export type MonthlyHealthDataMaxAggregateOutputType = {
    id: number | null
    facility_id: number | null
    sub_centre_id: number | null
    district_id: number | null
    indicator_id: number | null
    report_month: string | null
    value: Decimal | null
    data_quality: $Enums.DataQuality | null
    remarks: string | null
    uploaded_by: number | null
    approved_by: number | null
    approved_at: Date | null
    created_at: Date | null
    updated_at: Date | null
    achievement: Decimal | null
    denominator: Decimal | null
    numerator: Decimal | null
    target_value: Decimal | null
  }

  export type MonthlyHealthDataCountAggregateOutputType = {
    id: number
    facility_id: number
    sub_centre_id: number
    district_id: number
    indicator_id: number
    report_month: number
    value: number
    data_quality: number
    remarks: number
    uploaded_by: number
    approved_by: number
    approved_at: number
    created_at: number
    updated_at: number
    achievement: number
    denominator: number
    numerator: number
    target_value: number
    _all: number
  }


  export type MonthlyHealthDataAvgAggregateInputType = {
    id?: true
    facility_id?: true
    sub_centre_id?: true
    district_id?: true
    indicator_id?: true
    value?: true
    uploaded_by?: true
    approved_by?: true
    achievement?: true
    denominator?: true
    numerator?: true
    target_value?: true
  }

  export type MonthlyHealthDataSumAggregateInputType = {
    id?: true
    facility_id?: true
    sub_centre_id?: true
    district_id?: true
    indicator_id?: true
    value?: true
    uploaded_by?: true
    approved_by?: true
    achievement?: true
    denominator?: true
    numerator?: true
    target_value?: true
  }

  export type MonthlyHealthDataMinAggregateInputType = {
    id?: true
    facility_id?: true
    sub_centre_id?: true
    district_id?: true
    indicator_id?: true
    report_month?: true
    value?: true
    data_quality?: true
    remarks?: true
    uploaded_by?: true
    approved_by?: true
    approved_at?: true
    created_at?: true
    updated_at?: true
    achievement?: true
    denominator?: true
    numerator?: true
    target_value?: true
  }

  export type MonthlyHealthDataMaxAggregateInputType = {
    id?: true
    facility_id?: true
    sub_centre_id?: true
    district_id?: true
    indicator_id?: true
    report_month?: true
    value?: true
    data_quality?: true
    remarks?: true
    uploaded_by?: true
    approved_by?: true
    approved_at?: true
    created_at?: true
    updated_at?: true
    achievement?: true
    denominator?: true
    numerator?: true
    target_value?: true
  }

  export type MonthlyHealthDataCountAggregateInputType = {
    id?: true
    facility_id?: true
    sub_centre_id?: true
    district_id?: true
    indicator_id?: true
    report_month?: true
    value?: true
    data_quality?: true
    remarks?: true
    uploaded_by?: true
    approved_by?: true
    approved_at?: true
    created_at?: true
    updated_at?: true
    achievement?: true
    denominator?: true
    numerator?: true
    target_value?: true
    _all?: true
  }

  export type MonthlyHealthDataAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MonthlyHealthData to aggregate.
     */
    where?: MonthlyHealthDataWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MonthlyHealthData to fetch.
     */
    orderBy?: MonthlyHealthDataOrderByWithRelationInput | MonthlyHealthDataOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: MonthlyHealthDataWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MonthlyHealthData from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MonthlyHealthData.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned MonthlyHealthData
    **/
    _count?: true | MonthlyHealthDataCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: MonthlyHealthDataAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: MonthlyHealthDataSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: MonthlyHealthDataMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: MonthlyHealthDataMaxAggregateInputType
  }

  export type GetMonthlyHealthDataAggregateType<T extends MonthlyHealthDataAggregateArgs> = {
        [P in keyof T & keyof AggregateMonthlyHealthData]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMonthlyHealthData[P]>
      : GetScalarType<T[P], AggregateMonthlyHealthData[P]>
  }




  export type MonthlyHealthDataGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MonthlyHealthDataWhereInput
    orderBy?: MonthlyHealthDataOrderByWithAggregationInput | MonthlyHealthDataOrderByWithAggregationInput[]
    by: MonthlyHealthDataScalarFieldEnum[] | MonthlyHealthDataScalarFieldEnum
    having?: MonthlyHealthDataScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MonthlyHealthDataCountAggregateInputType | true
    _avg?: MonthlyHealthDataAvgAggregateInputType
    _sum?: MonthlyHealthDataSumAggregateInputType
    _min?: MonthlyHealthDataMinAggregateInputType
    _max?: MonthlyHealthDataMaxAggregateInputType
  }

  export type MonthlyHealthDataGroupByOutputType = {
    id: number
    facility_id: number | null
    sub_centre_id: number | null
    district_id: number
    indicator_id: number | null
    report_month: string
    value: Decimal | null
    data_quality: $Enums.DataQuality
    remarks: string | null
    uploaded_by: number
    approved_by: number | null
    approved_at: Date | null
    created_at: Date
    updated_at: Date
    achievement: Decimal | null
    denominator: Decimal | null
    numerator: Decimal | null
    target_value: Decimal | null
    _count: MonthlyHealthDataCountAggregateOutputType | null
    _avg: MonthlyHealthDataAvgAggregateOutputType | null
    _sum: MonthlyHealthDataSumAggregateOutputType | null
    _min: MonthlyHealthDataMinAggregateOutputType | null
    _max: MonthlyHealthDataMaxAggregateOutputType | null
  }

  type GetMonthlyHealthDataGroupByPayload<T extends MonthlyHealthDataGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<MonthlyHealthDataGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof MonthlyHealthDataGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MonthlyHealthDataGroupByOutputType[P]>
            : GetScalarType<T[P], MonthlyHealthDataGroupByOutputType[P]>
        }
      >
    >


  export type MonthlyHealthDataSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    facility_id?: boolean
    sub_centre_id?: boolean
    district_id?: boolean
    indicator_id?: boolean
    report_month?: boolean
    value?: boolean
    data_quality?: boolean
    remarks?: boolean
    uploaded_by?: boolean
    approved_by?: boolean
    approved_at?: boolean
    created_at?: boolean
    updated_at?: boolean
    achievement?: boolean
    denominator?: boolean
    numerator?: boolean
    target_value?: boolean
    approver?: boolean | MonthlyHealthData$approverArgs<ExtArgs>
    district?: boolean | DistrictDefaultArgs<ExtArgs>
    facility?: boolean | MonthlyHealthData$facilityArgs<ExtArgs>
    sub_centre?: boolean | MonthlyHealthData$sub_centreArgs<ExtArgs>
    indicator?: boolean | MonthlyHealthData$indicatorArgs<ExtArgs>
    uploader?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["monthlyHealthData"]>

  export type MonthlyHealthDataSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    facility_id?: boolean
    sub_centre_id?: boolean
    district_id?: boolean
    indicator_id?: boolean
    report_month?: boolean
    value?: boolean
    data_quality?: boolean
    remarks?: boolean
    uploaded_by?: boolean
    approved_by?: boolean
    approved_at?: boolean
    created_at?: boolean
    updated_at?: boolean
    achievement?: boolean
    denominator?: boolean
    numerator?: boolean
    target_value?: boolean
    approver?: boolean | MonthlyHealthData$approverArgs<ExtArgs>
    district?: boolean | DistrictDefaultArgs<ExtArgs>
    facility?: boolean | MonthlyHealthData$facilityArgs<ExtArgs>
    sub_centre?: boolean | MonthlyHealthData$sub_centreArgs<ExtArgs>
    indicator?: boolean | MonthlyHealthData$indicatorArgs<ExtArgs>
    uploader?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["monthlyHealthData"]>

  export type MonthlyHealthDataSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    facility_id?: boolean
    sub_centre_id?: boolean
    district_id?: boolean
    indicator_id?: boolean
    report_month?: boolean
    value?: boolean
    data_quality?: boolean
    remarks?: boolean
    uploaded_by?: boolean
    approved_by?: boolean
    approved_at?: boolean
    created_at?: boolean
    updated_at?: boolean
    achievement?: boolean
    denominator?: boolean
    numerator?: boolean
    target_value?: boolean
    approver?: boolean | MonthlyHealthData$approverArgs<ExtArgs>
    district?: boolean | DistrictDefaultArgs<ExtArgs>
    facility?: boolean | MonthlyHealthData$facilityArgs<ExtArgs>
    sub_centre?: boolean | MonthlyHealthData$sub_centreArgs<ExtArgs>
    indicator?: boolean | MonthlyHealthData$indicatorArgs<ExtArgs>
    uploader?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["monthlyHealthData"]>

  export type MonthlyHealthDataSelectScalar = {
    id?: boolean
    facility_id?: boolean
    sub_centre_id?: boolean
    district_id?: boolean
    indicator_id?: boolean
    report_month?: boolean
    value?: boolean
    data_quality?: boolean
    remarks?: boolean
    uploaded_by?: boolean
    approved_by?: boolean
    approved_at?: boolean
    created_at?: boolean
    updated_at?: boolean
    achievement?: boolean
    denominator?: boolean
    numerator?: boolean
    target_value?: boolean
  }

  export type MonthlyHealthDataOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "facility_id" | "sub_centre_id" | "district_id" | "indicator_id" | "report_month" | "value" | "data_quality" | "remarks" | "uploaded_by" | "approved_by" | "approved_at" | "created_at" | "updated_at" | "achievement" | "denominator" | "numerator" | "target_value", ExtArgs["result"]["monthlyHealthData"]>
  export type MonthlyHealthDataInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    approver?: boolean | MonthlyHealthData$approverArgs<ExtArgs>
    district?: boolean | DistrictDefaultArgs<ExtArgs>
    facility?: boolean | MonthlyHealthData$facilityArgs<ExtArgs>
    sub_centre?: boolean | MonthlyHealthData$sub_centreArgs<ExtArgs>
    indicator?: boolean | MonthlyHealthData$indicatorArgs<ExtArgs>
    uploader?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type MonthlyHealthDataIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    approver?: boolean | MonthlyHealthData$approverArgs<ExtArgs>
    district?: boolean | DistrictDefaultArgs<ExtArgs>
    facility?: boolean | MonthlyHealthData$facilityArgs<ExtArgs>
    sub_centre?: boolean | MonthlyHealthData$sub_centreArgs<ExtArgs>
    indicator?: boolean | MonthlyHealthData$indicatorArgs<ExtArgs>
    uploader?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type MonthlyHealthDataIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    approver?: boolean | MonthlyHealthData$approverArgs<ExtArgs>
    district?: boolean | DistrictDefaultArgs<ExtArgs>
    facility?: boolean | MonthlyHealthData$facilityArgs<ExtArgs>
    sub_centre?: boolean | MonthlyHealthData$sub_centreArgs<ExtArgs>
    indicator?: boolean | MonthlyHealthData$indicatorArgs<ExtArgs>
    uploader?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $MonthlyHealthDataPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "MonthlyHealthData"
    objects: {
      approver: Prisma.$UserPayload<ExtArgs> | null
      district: Prisma.$DistrictPayload<ExtArgs>
      facility: Prisma.$FacilityPayload<ExtArgs> | null
      sub_centre: Prisma.$sub_centrePayload<ExtArgs> | null
      indicator: Prisma.$IndicatorPayload<ExtArgs> | null
      uploader: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      facility_id: number | null
      sub_centre_id: number | null
      district_id: number
      indicator_id: number | null
      report_month: string
      value: Prisma.Decimal | null
      data_quality: $Enums.DataQuality
      remarks: string | null
      uploaded_by: number
      approved_by: number | null
      approved_at: Date | null
      created_at: Date
      updated_at: Date
      achievement: Prisma.Decimal | null
      denominator: Prisma.Decimal | null
      numerator: Prisma.Decimal | null
      target_value: Prisma.Decimal | null
    }, ExtArgs["result"]["monthlyHealthData"]>
    composites: {}
  }

  type MonthlyHealthDataGetPayload<S extends boolean | null | undefined | MonthlyHealthDataDefaultArgs> = $Result.GetResult<Prisma.$MonthlyHealthDataPayload, S>

  type MonthlyHealthDataCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<MonthlyHealthDataFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: MonthlyHealthDataCountAggregateInputType | true
    }

  export interface MonthlyHealthDataDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['MonthlyHealthData'], meta: { name: 'MonthlyHealthData' } }
    /**
     * Find zero or one MonthlyHealthData that matches the filter.
     * @param {MonthlyHealthDataFindUniqueArgs} args - Arguments to find a MonthlyHealthData
     * @example
     * // Get one MonthlyHealthData
     * const monthlyHealthData = await prisma.monthlyHealthData.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MonthlyHealthDataFindUniqueArgs>(args: SelectSubset<T, MonthlyHealthDataFindUniqueArgs<ExtArgs>>): Prisma__MonthlyHealthDataClient<$Result.GetResult<Prisma.$MonthlyHealthDataPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one MonthlyHealthData that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {MonthlyHealthDataFindUniqueOrThrowArgs} args - Arguments to find a MonthlyHealthData
     * @example
     * // Get one MonthlyHealthData
     * const monthlyHealthData = await prisma.monthlyHealthData.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MonthlyHealthDataFindUniqueOrThrowArgs>(args: SelectSubset<T, MonthlyHealthDataFindUniqueOrThrowArgs<ExtArgs>>): Prisma__MonthlyHealthDataClient<$Result.GetResult<Prisma.$MonthlyHealthDataPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first MonthlyHealthData that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MonthlyHealthDataFindFirstArgs} args - Arguments to find a MonthlyHealthData
     * @example
     * // Get one MonthlyHealthData
     * const monthlyHealthData = await prisma.monthlyHealthData.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MonthlyHealthDataFindFirstArgs>(args?: SelectSubset<T, MonthlyHealthDataFindFirstArgs<ExtArgs>>): Prisma__MonthlyHealthDataClient<$Result.GetResult<Prisma.$MonthlyHealthDataPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first MonthlyHealthData that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MonthlyHealthDataFindFirstOrThrowArgs} args - Arguments to find a MonthlyHealthData
     * @example
     * // Get one MonthlyHealthData
     * const monthlyHealthData = await prisma.monthlyHealthData.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MonthlyHealthDataFindFirstOrThrowArgs>(args?: SelectSubset<T, MonthlyHealthDataFindFirstOrThrowArgs<ExtArgs>>): Prisma__MonthlyHealthDataClient<$Result.GetResult<Prisma.$MonthlyHealthDataPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more MonthlyHealthData that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MonthlyHealthDataFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all MonthlyHealthData
     * const monthlyHealthData = await prisma.monthlyHealthData.findMany()
     * 
     * // Get first 10 MonthlyHealthData
     * const monthlyHealthData = await prisma.monthlyHealthData.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const monthlyHealthDataWithIdOnly = await prisma.monthlyHealthData.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends MonthlyHealthDataFindManyArgs>(args?: SelectSubset<T, MonthlyHealthDataFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MonthlyHealthDataPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a MonthlyHealthData.
     * @param {MonthlyHealthDataCreateArgs} args - Arguments to create a MonthlyHealthData.
     * @example
     * // Create one MonthlyHealthData
     * const MonthlyHealthData = await prisma.monthlyHealthData.create({
     *   data: {
     *     // ... data to create a MonthlyHealthData
     *   }
     * })
     * 
     */
    create<T extends MonthlyHealthDataCreateArgs>(args: SelectSubset<T, MonthlyHealthDataCreateArgs<ExtArgs>>): Prisma__MonthlyHealthDataClient<$Result.GetResult<Prisma.$MonthlyHealthDataPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many MonthlyHealthData.
     * @param {MonthlyHealthDataCreateManyArgs} args - Arguments to create many MonthlyHealthData.
     * @example
     * // Create many MonthlyHealthData
     * const monthlyHealthData = await prisma.monthlyHealthData.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends MonthlyHealthDataCreateManyArgs>(args?: SelectSubset<T, MonthlyHealthDataCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many MonthlyHealthData and returns the data saved in the database.
     * @param {MonthlyHealthDataCreateManyAndReturnArgs} args - Arguments to create many MonthlyHealthData.
     * @example
     * // Create many MonthlyHealthData
     * const monthlyHealthData = await prisma.monthlyHealthData.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many MonthlyHealthData and only return the `id`
     * const monthlyHealthDataWithIdOnly = await prisma.monthlyHealthData.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends MonthlyHealthDataCreateManyAndReturnArgs>(args?: SelectSubset<T, MonthlyHealthDataCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MonthlyHealthDataPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a MonthlyHealthData.
     * @param {MonthlyHealthDataDeleteArgs} args - Arguments to delete one MonthlyHealthData.
     * @example
     * // Delete one MonthlyHealthData
     * const MonthlyHealthData = await prisma.monthlyHealthData.delete({
     *   where: {
     *     // ... filter to delete one MonthlyHealthData
     *   }
     * })
     * 
     */
    delete<T extends MonthlyHealthDataDeleteArgs>(args: SelectSubset<T, MonthlyHealthDataDeleteArgs<ExtArgs>>): Prisma__MonthlyHealthDataClient<$Result.GetResult<Prisma.$MonthlyHealthDataPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one MonthlyHealthData.
     * @param {MonthlyHealthDataUpdateArgs} args - Arguments to update one MonthlyHealthData.
     * @example
     * // Update one MonthlyHealthData
     * const monthlyHealthData = await prisma.monthlyHealthData.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends MonthlyHealthDataUpdateArgs>(args: SelectSubset<T, MonthlyHealthDataUpdateArgs<ExtArgs>>): Prisma__MonthlyHealthDataClient<$Result.GetResult<Prisma.$MonthlyHealthDataPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more MonthlyHealthData.
     * @param {MonthlyHealthDataDeleteManyArgs} args - Arguments to filter MonthlyHealthData to delete.
     * @example
     * // Delete a few MonthlyHealthData
     * const { count } = await prisma.monthlyHealthData.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends MonthlyHealthDataDeleteManyArgs>(args?: SelectSubset<T, MonthlyHealthDataDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more MonthlyHealthData.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MonthlyHealthDataUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many MonthlyHealthData
     * const monthlyHealthData = await prisma.monthlyHealthData.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends MonthlyHealthDataUpdateManyArgs>(args: SelectSubset<T, MonthlyHealthDataUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more MonthlyHealthData and returns the data updated in the database.
     * @param {MonthlyHealthDataUpdateManyAndReturnArgs} args - Arguments to update many MonthlyHealthData.
     * @example
     * // Update many MonthlyHealthData
     * const monthlyHealthData = await prisma.monthlyHealthData.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more MonthlyHealthData and only return the `id`
     * const monthlyHealthDataWithIdOnly = await prisma.monthlyHealthData.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends MonthlyHealthDataUpdateManyAndReturnArgs>(args: SelectSubset<T, MonthlyHealthDataUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MonthlyHealthDataPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one MonthlyHealthData.
     * @param {MonthlyHealthDataUpsertArgs} args - Arguments to update or create a MonthlyHealthData.
     * @example
     * // Update or create a MonthlyHealthData
     * const monthlyHealthData = await prisma.monthlyHealthData.upsert({
     *   create: {
     *     // ... data to create a MonthlyHealthData
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the MonthlyHealthData we want to update
     *   }
     * })
     */
    upsert<T extends MonthlyHealthDataUpsertArgs>(args: SelectSubset<T, MonthlyHealthDataUpsertArgs<ExtArgs>>): Prisma__MonthlyHealthDataClient<$Result.GetResult<Prisma.$MonthlyHealthDataPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of MonthlyHealthData.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MonthlyHealthDataCountArgs} args - Arguments to filter MonthlyHealthData to count.
     * @example
     * // Count the number of MonthlyHealthData
     * const count = await prisma.monthlyHealthData.count({
     *   where: {
     *     // ... the filter for the MonthlyHealthData we want to count
     *   }
     * })
    **/
    count<T extends MonthlyHealthDataCountArgs>(
      args?: Subset<T, MonthlyHealthDataCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MonthlyHealthDataCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a MonthlyHealthData.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MonthlyHealthDataAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends MonthlyHealthDataAggregateArgs>(args: Subset<T, MonthlyHealthDataAggregateArgs>): Prisma.PrismaPromise<GetMonthlyHealthDataAggregateType<T>>

    /**
     * Group by MonthlyHealthData.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MonthlyHealthDataGroupByArgs} args - Group by arguments.
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
      T extends MonthlyHealthDataGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MonthlyHealthDataGroupByArgs['orderBy'] }
        : { orderBy?: MonthlyHealthDataGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, MonthlyHealthDataGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMonthlyHealthDataGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the MonthlyHealthData model
   */
  readonly fields: MonthlyHealthDataFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for MonthlyHealthData.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__MonthlyHealthDataClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    approver<T extends MonthlyHealthData$approverArgs<ExtArgs> = {}>(args?: Subset<T, MonthlyHealthData$approverArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    district<T extends DistrictDefaultArgs<ExtArgs> = {}>(args?: Subset<T, DistrictDefaultArgs<ExtArgs>>): Prisma__DistrictClient<$Result.GetResult<Prisma.$DistrictPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    facility<T extends MonthlyHealthData$facilityArgs<ExtArgs> = {}>(args?: Subset<T, MonthlyHealthData$facilityArgs<ExtArgs>>): Prisma__FacilityClient<$Result.GetResult<Prisma.$FacilityPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    sub_centre<T extends MonthlyHealthData$sub_centreArgs<ExtArgs> = {}>(args?: Subset<T, MonthlyHealthData$sub_centreArgs<ExtArgs>>): Prisma__sub_centreClient<$Result.GetResult<Prisma.$sub_centrePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    indicator<T extends MonthlyHealthData$indicatorArgs<ExtArgs> = {}>(args?: Subset<T, MonthlyHealthData$indicatorArgs<ExtArgs>>): Prisma__IndicatorClient<$Result.GetResult<Prisma.$IndicatorPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    uploader<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the MonthlyHealthData model
   */
  interface MonthlyHealthDataFieldRefs {
    readonly id: FieldRef<"MonthlyHealthData", 'Int'>
    readonly facility_id: FieldRef<"MonthlyHealthData", 'Int'>
    readonly sub_centre_id: FieldRef<"MonthlyHealthData", 'Int'>
    readonly district_id: FieldRef<"MonthlyHealthData", 'Int'>
    readonly indicator_id: FieldRef<"MonthlyHealthData", 'Int'>
    readonly report_month: FieldRef<"MonthlyHealthData", 'String'>
    readonly value: FieldRef<"MonthlyHealthData", 'Decimal'>
    readonly data_quality: FieldRef<"MonthlyHealthData", 'DataQuality'>
    readonly remarks: FieldRef<"MonthlyHealthData", 'String'>
    readonly uploaded_by: FieldRef<"MonthlyHealthData", 'Int'>
    readonly approved_by: FieldRef<"MonthlyHealthData", 'Int'>
    readonly approved_at: FieldRef<"MonthlyHealthData", 'DateTime'>
    readonly created_at: FieldRef<"MonthlyHealthData", 'DateTime'>
    readonly updated_at: FieldRef<"MonthlyHealthData", 'DateTime'>
    readonly achievement: FieldRef<"MonthlyHealthData", 'Decimal'>
    readonly denominator: FieldRef<"MonthlyHealthData", 'Decimal'>
    readonly numerator: FieldRef<"MonthlyHealthData", 'Decimal'>
    readonly target_value: FieldRef<"MonthlyHealthData", 'Decimal'>
  }
    

  // Custom InputTypes
  /**
   * MonthlyHealthData findUnique
   */
  export type MonthlyHealthDataFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MonthlyHealthData
     */
    select?: MonthlyHealthDataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MonthlyHealthData
     */
    omit?: MonthlyHealthDataOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MonthlyHealthDataInclude<ExtArgs> | null
    /**
     * Filter, which MonthlyHealthData to fetch.
     */
    where: MonthlyHealthDataWhereUniqueInput
  }

  /**
   * MonthlyHealthData findUniqueOrThrow
   */
  export type MonthlyHealthDataFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MonthlyHealthData
     */
    select?: MonthlyHealthDataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MonthlyHealthData
     */
    omit?: MonthlyHealthDataOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MonthlyHealthDataInclude<ExtArgs> | null
    /**
     * Filter, which MonthlyHealthData to fetch.
     */
    where: MonthlyHealthDataWhereUniqueInput
  }

  /**
   * MonthlyHealthData findFirst
   */
  export type MonthlyHealthDataFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MonthlyHealthData
     */
    select?: MonthlyHealthDataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MonthlyHealthData
     */
    omit?: MonthlyHealthDataOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MonthlyHealthDataInclude<ExtArgs> | null
    /**
     * Filter, which MonthlyHealthData to fetch.
     */
    where?: MonthlyHealthDataWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MonthlyHealthData to fetch.
     */
    orderBy?: MonthlyHealthDataOrderByWithRelationInput | MonthlyHealthDataOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MonthlyHealthData.
     */
    cursor?: MonthlyHealthDataWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MonthlyHealthData from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MonthlyHealthData.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MonthlyHealthData.
     */
    distinct?: MonthlyHealthDataScalarFieldEnum | MonthlyHealthDataScalarFieldEnum[]
  }

  /**
   * MonthlyHealthData findFirstOrThrow
   */
  export type MonthlyHealthDataFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MonthlyHealthData
     */
    select?: MonthlyHealthDataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MonthlyHealthData
     */
    omit?: MonthlyHealthDataOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MonthlyHealthDataInclude<ExtArgs> | null
    /**
     * Filter, which MonthlyHealthData to fetch.
     */
    where?: MonthlyHealthDataWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MonthlyHealthData to fetch.
     */
    orderBy?: MonthlyHealthDataOrderByWithRelationInput | MonthlyHealthDataOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MonthlyHealthData.
     */
    cursor?: MonthlyHealthDataWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MonthlyHealthData from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MonthlyHealthData.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MonthlyHealthData.
     */
    distinct?: MonthlyHealthDataScalarFieldEnum | MonthlyHealthDataScalarFieldEnum[]
  }

  /**
   * MonthlyHealthData findMany
   */
  export type MonthlyHealthDataFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MonthlyHealthData
     */
    select?: MonthlyHealthDataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MonthlyHealthData
     */
    omit?: MonthlyHealthDataOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MonthlyHealthDataInclude<ExtArgs> | null
    /**
     * Filter, which MonthlyHealthData to fetch.
     */
    where?: MonthlyHealthDataWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MonthlyHealthData to fetch.
     */
    orderBy?: MonthlyHealthDataOrderByWithRelationInput | MonthlyHealthDataOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing MonthlyHealthData.
     */
    cursor?: MonthlyHealthDataWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MonthlyHealthData from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MonthlyHealthData.
     */
    skip?: number
    distinct?: MonthlyHealthDataScalarFieldEnum | MonthlyHealthDataScalarFieldEnum[]
  }

  /**
   * MonthlyHealthData create
   */
  export type MonthlyHealthDataCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MonthlyHealthData
     */
    select?: MonthlyHealthDataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MonthlyHealthData
     */
    omit?: MonthlyHealthDataOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MonthlyHealthDataInclude<ExtArgs> | null
    /**
     * The data needed to create a MonthlyHealthData.
     */
    data: XOR<MonthlyHealthDataCreateInput, MonthlyHealthDataUncheckedCreateInput>
  }

  /**
   * MonthlyHealthData createMany
   */
  export type MonthlyHealthDataCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many MonthlyHealthData.
     */
    data: MonthlyHealthDataCreateManyInput | MonthlyHealthDataCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * MonthlyHealthData createManyAndReturn
   */
  export type MonthlyHealthDataCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MonthlyHealthData
     */
    select?: MonthlyHealthDataSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the MonthlyHealthData
     */
    omit?: MonthlyHealthDataOmit<ExtArgs> | null
    /**
     * The data used to create many MonthlyHealthData.
     */
    data: MonthlyHealthDataCreateManyInput | MonthlyHealthDataCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MonthlyHealthDataIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * MonthlyHealthData update
   */
  export type MonthlyHealthDataUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MonthlyHealthData
     */
    select?: MonthlyHealthDataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MonthlyHealthData
     */
    omit?: MonthlyHealthDataOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MonthlyHealthDataInclude<ExtArgs> | null
    /**
     * The data needed to update a MonthlyHealthData.
     */
    data: XOR<MonthlyHealthDataUpdateInput, MonthlyHealthDataUncheckedUpdateInput>
    /**
     * Choose, which MonthlyHealthData to update.
     */
    where: MonthlyHealthDataWhereUniqueInput
  }

  /**
   * MonthlyHealthData updateMany
   */
  export type MonthlyHealthDataUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update MonthlyHealthData.
     */
    data: XOR<MonthlyHealthDataUpdateManyMutationInput, MonthlyHealthDataUncheckedUpdateManyInput>
    /**
     * Filter which MonthlyHealthData to update
     */
    where?: MonthlyHealthDataWhereInput
    /**
     * Limit how many MonthlyHealthData to update.
     */
    limit?: number
  }

  /**
   * MonthlyHealthData updateManyAndReturn
   */
  export type MonthlyHealthDataUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MonthlyHealthData
     */
    select?: MonthlyHealthDataSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the MonthlyHealthData
     */
    omit?: MonthlyHealthDataOmit<ExtArgs> | null
    /**
     * The data used to update MonthlyHealthData.
     */
    data: XOR<MonthlyHealthDataUpdateManyMutationInput, MonthlyHealthDataUncheckedUpdateManyInput>
    /**
     * Filter which MonthlyHealthData to update
     */
    where?: MonthlyHealthDataWhereInput
    /**
     * Limit how many MonthlyHealthData to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MonthlyHealthDataIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * MonthlyHealthData upsert
   */
  export type MonthlyHealthDataUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MonthlyHealthData
     */
    select?: MonthlyHealthDataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MonthlyHealthData
     */
    omit?: MonthlyHealthDataOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MonthlyHealthDataInclude<ExtArgs> | null
    /**
     * The filter to search for the MonthlyHealthData to update in case it exists.
     */
    where: MonthlyHealthDataWhereUniqueInput
    /**
     * In case the MonthlyHealthData found by the `where` argument doesn't exist, create a new MonthlyHealthData with this data.
     */
    create: XOR<MonthlyHealthDataCreateInput, MonthlyHealthDataUncheckedCreateInput>
    /**
     * In case the MonthlyHealthData was found with the provided `where` argument, update it with this data.
     */
    update: XOR<MonthlyHealthDataUpdateInput, MonthlyHealthDataUncheckedUpdateInput>
  }

  /**
   * MonthlyHealthData delete
   */
  export type MonthlyHealthDataDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MonthlyHealthData
     */
    select?: MonthlyHealthDataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MonthlyHealthData
     */
    omit?: MonthlyHealthDataOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MonthlyHealthDataInclude<ExtArgs> | null
    /**
     * Filter which MonthlyHealthData to delete.
     */
    where: MonthlyHealthDataWhereUniqueInput
  }

  /**
   * MonthlyHealthData deleteMany
   */
  export type MonthlyHealthDataDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MonthlyHealthData to delete
     */
    where?: MonthlyHealthDataWhereInput
    /**
     * Limit how many MonthlyHealthData to delete.
     */
    limit?: number
  }

  /**
   * MonthlyHealthData.approver
   */
  export type MonthlyHealthData$approverArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * MonthlyHealthData.facility
   */
  export type MonthlyHealthData$facilityArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Facility
     */
    select?: FacilitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Facility
     */
    omit?: FacilityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FacilityInclude<ExtArgs> | null
    where?: FacilityWhereInput
  }

  /**
   * MonthlyHealthData.sub_centre
   */
  export type MonthlyHealthData$sub_centreArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the sub_centre
     */
    select?: sub_centreSelect<ExtArgs> | null
    /**
     * Omit specific fields from the sub_centre
     */
    omit?: sub_centreOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: sub_centreInclude<ExtArgs> | null
    where?: sub_centreWhereInput
  }

  /**
   * MonthlyHealthData.indicator
   */
  export type MonthlyHealthData$indicatorArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Indicator
     */
    select?: IndicatorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Indicator
     */
    omit?: IndicatorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IndicatorInclude<ExtArgs> | null
    where?: IndicatorWhereInput
  }

  /**
   * MonthlyHealthData without action
   */
  export type MonthlyHealthDataDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MonthlyHealthData
     */
    select?: MonthlyHealthDataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MonthlyHealthData
     */
    omit?: MonthlyHealthDataOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MonthlyHealthDataInclude<ExtArgs> | null
  }


  /**
   * Model DataUploadSession
   */

  export type AggregateDataUploadSession = {
    _count: DataUploadSessionCountAggregateOutputType | null
    _avg: DataUploadSessionAvgAggregateOutputType | null
    _sum: DataUploadSessionSumAggregateOutputType | null
    _min: DataUploadSessionMinAggregateOutputType | null
    _max: DataUploadSessionMaxAggregateOutputType | null
  }

  export type DataUploadSessionAvgAggregateOutputType = {
    id: number | null
    total_records: number | null
    success_count: number | null
    error_count: number | null
    uploaded_by: number | null
  }

  export type DataUploadSessionSumAggregateOutputType = {
    id: number | null
    total_records: number | null
    success_count: number | null
    error_count: number | null
    uploaded_by: number | null
  }

  export type DataUploadSessionMinAggregateOutputType = {
    id: number | null
    file_name: string | null
    file_path: string | null
    report_month: string | null
    total_records: number | null
    success_count: number | null
    error_count: number | null
    status: $Enums.UploadStatus | null
    uploaded_by: number | null
    created_at: Date | null
    completed_at: Date | null
  }

  export type DataUploadSessionMaxAggregateOutputType = {
    id: number | null
    file_name: string | null
    file_path: string | null
    report_month: string | null
    total_records: number | null
    success_count: number | null
    error_count: number | null
    status: $Enums.UploadStatus | null
    uploaded_by: number | null
    created_at: Date | null
    completed_at: Date | null
  }

  export type DataUploadSessionCountAggregateOutputType = {
    id: number
    file_name: number
    file_path: number
    report_month: number
    total_records: number
    success_count: number
    error_count: number
    status: number
    upload_summary: number
    uploaded_by: number
    created_at: number
    completed_at: number
    _all: number
  }


  export type DataUploadSessionAvgAggregateInputType = {
    id?: true
    total_records?: true
    success_count?: true
    error_count?: true
    uploaded_by?: true
  }

  export type DataUploadSessionSumAggregateInputType = {
    id?: true
    total_records?: true
    success_count?: true
    error_count?: true
    uploaded_by?: true
  }

  export type DataUploadSessionMinAggregateInputType = {
    id?: true
    file_name?: true
    file_path?: true
    report_month?: true
    total_records?: true
    success_count?: true
    error_count?: true
    status?: true
    uploaded_by?: true
    created_at?: true
    completed_at?: true
  }

  export type DataUploadSessionMaxAggregateInputType = {
    id?: true
    file_name?: true
    file_path?: true
    report_month?: true
    total_records?: true
    success_count?: true
    error_count?: true
    status?: true
    uploaded_by?: true
    created_at?: true
    completed_at?: true
  }

  export type DataUploadSessionCountAggregateInputType = {
    id?: true
    file_name?: true
    file_path?: true
    report_month?: true
    total_records?: true
    success_count?: true
    error_count?: true
    status?: true
    upload_summary?: true
    uploaded_by?: true
    created_at?: true
    completed_at?: true
    _all?: true
  }

  export type DataUploadSessionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DataUploadSession to aggregate.
     */
    where?: DataUploadSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DataUploadSessions to fetch.
     */
    orderBy?: DataUploadSessionOrderByWithRelationInput | DataUploadSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: DataUploadSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DataUploadSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DataUploadSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned DataUploadSessions
    **/
    _count?: true | DataUploadSessionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: DataUploadSessionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: DataUploadSessionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DataUploadSessionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DataUploadSessionMaxAggregateInputType
  }

  export type GetDataUploadSessionAggregateType<T extends DataUploadSessionAggregateArgs> = {
        [P in keyof T & keyof AggregateDataUploadSession]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDataUploadSession[P]>
      : GetScalarType<T[P], AggregateDataUploadSession[P]>
  }




  export type DataUploadSessionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DataUploadSessionWhereInput
    orderBy?: DataUploadSessionOrderByWithAggregationInput | DataUploadSessionOrderByWithAggregationInput[]
    by: DataUploadSessionScalarFieldEnum[] | DataUploadSessionScalarFieldEnum
    having?: DataUploadSessionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DataUploadSessionCountAggregateInputType | true
    _avg?: DataUploadSessionAvgAggregateInputType
    _sum?: DataUploadSessionSumAggregateInputType
    _min?: DataUploadSessionMinAggregateInputType
    _max?: DataUploadSessionMaxAggregateInputType
  }

  export type DataUploadSessionGroupByOutputType = {
    id: number
    file_name: string
    file_path: string | null
    report_month: string
    total_records: number
    success_count: number
    error_count: number
    status: $Enums.UploadStatus
    upload_summary: JsonValue | null
    uploaded_by: number
    created_at: Date
    completed_at: Date | null
    _count: DataUploadSessionCountAggregateOutputType | null
    _avg: DataUploadSessionAvgAggregateOutputType | null
    _sum: DataUploadSessionSumAggregateOutputType | null
    _min: DataUploadSessionMinAggregateOutputType | null
    _max: DataUploadSessionMaxAggregateOutputType | null
  }

  type GetDataUploadSessionGroupByPayload<T extends DataUploadSessionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DataUploadSessionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DataUploadSessionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DataUploadSessionGroupByOutputType[P]>
            : GetScalarType<T[P], DataUploadSessionGroupByOutputType[P]>
        }
      >
    >


  export type DataUploadSessionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    file_name?: boolean
    file_path?: boolean
    report_month?: boolean
    total_records?: boolean
    success_count?: boolean
    error_count?: boolean
    status?: boolean
    upload_summary?: boolean
    uploaded_by?: boolean
    created_at?: boolean
    completed_at?: boolean
    uploader?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["dataUploadSession"]>

  export type DataUploadSessionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    file_name?: boolean
    file_path?: boolean
    report_month?: boolean
    total_records?: boolean
    success_count?: boolean
    error_count?: boolean
    status?: boolean
    upload_summary?: boolean
    uploaded_by?: boolean
    created_at?: boolean
    completed_at?: boolean
    uploader?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["dataUploadSession"]>

  export type DataUploadSessionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    file_name?: boolean
    file_path?: boolean
    report_month?: boolean
    total_records?: boolean
    success_count?: boolean
    error_count?: boolean
    status?: boolean
    upload_summary?: boolean
    uploaded_by?: boolean
    created_at?: boolean
    completed_at?: boolean
    uploader?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["dataUploadSession"]>

  export type DataUploadSessionSelectScalar = {
    id?: boolean
    file_name?: boolean
    file_path?: boolean
    report_month?: boolean
    total_records?: boolean
    success_count?: boolean
    error_count?: boolean
    status?: boolean
    upload_summary?: boolean
    uploaded_by?: boolean
    created_at?: boolean
    completed_at?: boolean
  }

  export type DataUploadSessionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "file_name" | "file_path" | "report_month" | "total_records" | "success_count" | "error_count" | "status" | "upload_summary" | "uploaded_by" | "created_at" | "completed_at", ExtArgs["result"]["dataUploadSession"]>
  export type DataUploadSessionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    uploader?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type DataUploadSessionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    uploader?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type DataUploadSessionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    uploader?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $DataUploadSessionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "DataUploadSession"
    objects: {
      uploader: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      file_name: string
      file_path: string | null
      report_month: string
      total_records: number
      success_count: number
      error_count: number
      status: $Enums.UploadStatus
      upload_summary: Prisma.JsonValue | null
      uploaded_by: number
      created_at: Date
      completed_at: Date | null
    }, ExtArgs["result"]["dataUploadSession"]>
    composites: {}
  }

  type DataUploadSessionGetPayload<S extends boolean | null | undefined | DataUploadSessionDefaultArgs> = $Result.GetResult<Prisma.$DataUploadSessionPayload, S>

  type DataUploadSessionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<DataUploadSessionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: DataUploadSessionCountAggregateInputType | true
    }

  export interface DataUploadSessionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['DataUploadSession'], meta: { name: 'DataUploadSession' } }
    /**
     * Find zero or one DataUploadSession that matches the filter.
     * @param {DataUploadSessionFindUniqueArgs} args - Arguments to find a DataUploadSession
     * @example
     * // Get one DataUploadSession
     * const dataUploadSession = await prisma.dataUploadSession.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends DataUploadSessionFindUniqueArgs>(args: SelectSubset<T, DataUploadSessionFindUniqueArgs<ExtArgs>>): Prisma__DataUploadSessionClient<$Result.GetResult<Prisma.$DataUploadSessionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one DataUploadSession that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {DataUploadSessionFindUniqueOrThrowArgs} args - Arguments to find a DataUploadSession
     * @example
     * // Get one DataUploadSession
     * const dataUploadSession = await prisma.dataUploadSession.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends DataUploadSessionFindUniqueOrThrowArgs>(args: SelectSubset<T, DataUploadSessionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__DataUploadSessionClient<$Result.GetResult<Prisma.$DataUploadSessionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first DataUploadSession that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DataUploadSessionFindFirstArgs} args - Arguments to find a DataUploadSession
     * @example
     * // Get one DataUploadSession
     * const dataUploadSession = await prisma.dataUploadSession.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends DataUploadSessionFindFirstArgs>(args?: SelectSubset<T, DataUploadSessionFindFirstArgs<ExtArgs>>): Prisma__DataUploadSessionClient<$Result.GetResult<Prisma.$DataUploadSessionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first DataUploadSession that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DataUploadSessionFindFirstOrThrowArgs} args - Arguments to find a DataUploadSession
     * @example
     * // Get one DataUploadSession
     * const dataUploadSession = await prisma.dataUploadSession.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends DataUploadSessionFindFirstOrThrowArgs>(args?: SelectSubset<T, DataUploadSessionFindFirstOrThrowArgs<ExtArgs>>): Prisma__DataUploadSessionClient<$Result.GetResult<Prisma.$DataUploadSessionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more DataUploadSessions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DataUploadSessionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all DataUploadSessions
     * const dataUploadSessions = await prisma.dataUploadSession.findMany()
     * 
     * // Get first 10 DataUploadSessions
     * const dataUploadSessions = await prisma.dataUploadSession.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const dataUploadSessionWithIdOnly = await prisma.dataUploadSession.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends DataUploadSessionFindManyArgs>(args?: SelectSubset<T, DataUploadSessionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DataUploadSessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a DataUploadSession.
     * @param {DataUploadSessionCreateArgs} args - Arguments to create a DataUploadSession.
     * @example
     * // Create one DataUploadSession
     * const DataUploadSession = await prisma.dataUploadSession.create({
     *   data: {
     *     // ... data to create a DataUploadSession
     *   }
     * })
     * 
     */
    create<T extends DataUploadSessionCreateArgs>(args: SelectSubset<T, DataUploadSessionCreateArgs<ExtArgs>>): Prisma__DataUploadSessionClient<$Result.GetResult<Prisma.$DataUploadSessionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many DataUploadSessions.
     * @param {DataUploadSessionCreateManyArgs} args - Arguments to create many DataUploadSessions.
     * @example
     * // Create many DataUploadSessions
     * const dataUploadSession = await prisma.dataUploadSession.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends DataUploadSessionCreateManyArgs>(args?: SelectSubset<T, DataUploadSessionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many DataUploadSessions and returns the data saved in the database.
     * @param {DataUploadSessionCreateManyAndReturnArgs} args - Arguments to create many DataUploadSessions.
     * @example
     * // Create many DataUploadSessions
     * const dataUploadSession = await prisma.dataUploadSession.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many DataUploadSessions and only return the `id`
     * const dataUploadSessionWithIdOnly = await prisma.dataUploadSession.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends DataUploadSessionCreateManyAndReturnArgs>(args?: SelectSubset<T, DataUploadSessionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DataUploadSessionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a DataUploadSession.
     * @param {DataUploadSessionDeleteArgs} args - Arguments to delete one DataUploadSession.
     * @example
     * // Delete one DataUploadSession
     * const DataUploadSession = await prisma.dataUploadSession.delete({
     *   where: {
     *     // ... filter to delete one DataUploadSession
     *   }
     * })
     * 
     */
    delete<T extends DataUploadSessionDeleteArgs>(args: SelectSubset<T, DataUploadSessionDeleteArgs<ExtArgs>>): Prisma__DataUploadSessionClient<$Result.GetResult<Prisma.$DataUploadSessionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one DataUploadSession.
     * @param {DataUploadSessionUpdateArgs} args - Arguments to update one DataUploadSession.
     * @example
     * // Update one DataUploadSession
     * const dataUploadSession = await prisma.dataUploadSession.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends DataUploadSessionUpdateArgs>(args: SelectSubset<T, DataUploadSessionUpdateArgs<ExtArgs>>): Prisma__DataUploadSessionClient<$Result.GetResult<Prisma.$DataUploadSessionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more DataUploadSessions.
     * @param {DataUploadSessionDeleteManyArgs} args - Arguments to filter DataUploadSessions to delete.
     * @example
     * // Delete a few DataUploadSessions
     * const { count } = await prisma.dataUploadSession.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends DataUploadSessionDeleteManyArgs>(args?: SelectSubset<T, DataUploadSessionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more DataUploadSessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DataUploadSessionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many DataUploadSessions
     * const dataUploadSession = await prisma.dataUploadSession.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends DataUploadSessionUpdateManyArgs>(args: SelectSubset<T, DataUploadSessionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more DataUploadSessions and returns the data updated in the database.
     * @param {DataUploadSessionUpdateManyAndReturnArgs} args - Arguments to update many DataUploadSessions.
     * @example
     * // Update many DataUploadSessions
     * const dataUploadSession = await prisma.dataUploadSession.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more DataUploadSessions and only return the `id`
     * const dataUploadSessionWithIdOnly = await prisma.dataUploadSession.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends DataUploadSessionUpdateManyAndReturnArgs>(args: SelectSubset<T, DataUploadSessionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DataUploadSessionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one DataUploadSession.
     * @param {DataUploadSessionUpsertArgs} args - Arguments to update or create a DataUploadSession.
     * @example
     * // Update or create a DataUploadSession
     * const dataUploadSession = await prisma.dataUploadSession.upsert({
     *   create: {
     *     // ... data to create a DataUploadSession
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the DataUploadSession we want to update
     *   }
     * })
     */
    upsert<T extends DataUploadSessionUpsertArgs>(args: SelectSubset<T, DataUploadSessionUpsertArgs<ExtArgs>>): Prisma__DataUploadSessionClient<$Result.GetResult<Prisma.$DataUploadSessionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of DataUploadSessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DataUploadSessionCountArgs} args - Arguments to filter DataUploadSessions to count.
     * @example
     * // Count the number of DataUploadSessions
     * const count = await prisma.dataUploadSession.count({
     *   where: {
     *     // ... the filter for the DataUploadSessions we want to count
     *   }
     * })
    **/
    count<T extends DataUploadSessionCountArgs>(
      args?: Subset<T, DataUploadSessionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DataUploadSessionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a DataUploadSession.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DataUploadSessionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends DataUploadSessionAggregateArgs>(args: Subset<T, DataUploadSessionAggregateArgs>): Prisma.PrismaPromise<GetDataUploadSessionAggregateType<T>>

    /**
     * Group by DataUploadSession.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DataUploadSessionGroupByArgs} args - Group by arguments.
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
      T extends DataUploadSessionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: DataUploadSessionGroupByArgs['orderBy'] }
        : { orderBy?: DataUploadSessionGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, DataUploadSessionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDataUploadSessionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the DataUploadSession model
   */
  readonly fields: DataUploadSessionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for DataUploadSession.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__DataUploadSessionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    uploader<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the DataUploadSession model
   */
  interface DataUploadSessionFieldRefs {
    readonly id: FieldRef<"DataUploadSession", 'Int'>
    readonly file_name: FieldRef<"DataUploadSession", 'String'>
    readonly file_path: FieldRef<"DataUploadSession", 'String'>
    readonly report_month: FieldRef<"DataUploadSession", 'String'>
    readonly total_records: FieldRef<"DataUploadSession", 'Int'>
    readonly success_count: FieldRef<"DataUploadSession", 'Int'>
    readonly error_count: FieldRef<"DataUploadSession", 'Int'>
    readonly status: FieldRef<"DataUploadSession", 'UploadStatus'>
    readonly upload_summary: FieldRef<"DataUploadSession", 'Json'>
    readonly uploaded_by: FieldRef<"DataUploadSession", 'Int'>
    readonly created_at: FieldRef<"DataUploadSession", 'DateTime'>
    readonly completed_at: FieldRef<"DataUploadSession", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * DataUploadSession findUnique
   */
  export type DataUploadSessionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DataUploadSession
     */
    select?: DataUploadSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DataUploadSession
     */
    omit?: DataUploadSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DataUploadSessionInclude<ExtArgs> | null
    /**
     * Filter, which DataUploadSession to fetch.
     */
    where: DataUploadSessionWhereUniqueInput
  }

  /**
   * DataUploadSession findUniqueOrThrow
   */
  export type DataUploadSessionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DataUploadSession
     */
    select?: DataUploadSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DataUploadSession
     */
    omit?: DataUploadSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DataUploadSessionInclude<ExtArgs> | null
    /**
     * Filter, which DataUploadSession to fetch.
     */
    where: DataUploadSessionWhereUniqueInput
  }

  /**
   * DataUploadSession findFirst
   */
  export type DataUploadSessionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DataUploadSession
     */
    select?: DataUploadSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DataUploadSession
     */
    omit?: DataUploadSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DataUploadSessionInclude<ExtArgs> | null
    /**
     * Filter, which DataUploadSession to fetch.
     */
    where?: DataUploadSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DataUploadSessions to fetch.
     */
    orderBy?: DataUploadSessionOrderByWithRelationInput | DataUploadSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DataUploadSessions.
     */
    cursor?: DataUploadSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DataUploadSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DataUploadSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DataUploadSessions.
     */
    distinct?: DataUploadSessionScalarFieldEnum | DataUploadSessionScalarFieldEnum[]
  }

  /**
   * DataUploadSession findFirstOrThrow
   */
  export type DataUploadSessionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DataUploadSession
     */
    select?: DataUploadSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DataUploadSession
     */
    omit?: DataUploadSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DataUploadSessionInclude<ExtArgs> | null
    /**
     * Filter, which DataUploadSession to fetch.
     */
    where?: DataUploadSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DataUploadSessions to fetch.
     */
    orderBy?: DataUploadSessionOrderByWithRelationInput | DataUploadSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DataUploadSessions.
     */
    cursor?: DataUploadSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DataUploadSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DataUploadSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DataUploadSessions.
     */
    distinct?: DataUploadSessionScalarFieldEnum | DataUploadSessionScalarFieldEnum[]
  }

  /**
   * DataUploadSession findMany
   */
  export type DataUploadSessionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DataUploadSession
     */
    select?: DataUploadSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DataUploadSession
     */
    omit?: DataUploadSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DataUploadSessionInclude<ExtArgs> | null
    /**
     * Filter, which DataUploadSessions to fetch.
     */
    where?: DataUploadSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DataUploadSessions to fetch.
     */
    orderBy?: DataUploadSessionOrderByWithRelationInput | DataUploadSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing DataUploadSessions.
     */
    cursor?: DataUploadSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DataUploadSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DataUploadSessions.
     */
    skip?: number
    distinct?: DataUploadSessionScalarFieldEnum | DataUploadSessionScalarFieldEnum[]
  }

  /**
   * DataUploadSession create
   */
  export type DataUploadSessionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DataUploadSession
     */
    select?: DataUploadSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DataUploadSession
     */
    omit?: DataUploadSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DataUploadSessionInclude<ExtArgs> | null
    /**
     * The data needed to create a DataUploadSession.
     */
    data: XOR<DataUploadSessionCreateInput, DataUploadSessionUncheckedCreateInput>
  }

  /**
   * DataUploadSession createMany
   */
  export type DataUploadSessionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many DataUploadSessions.
     */
    data: DataUploadSessionCreateManyInput | DataUploadSessionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * DataUploadSession createManyAndReturn
   */
  export type DataUploadSessionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DataUploadSession
     */
    select?: DataUploadSessionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the DataUploadSession
     */
    omit?: DataUploadSessionOmit<ExtArgs> | null
    /**
     * The data used to create many DataUploadSessions.
     */
    data: DataUploadSessionCreateManyInput | DataUploadSessionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DataUploadSessionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * DataUploadSession update
   */
  export type DataUploadSessionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DataUploadSession
     */
    select?: DataUploadSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DataUploadSession
     */
    omit?: DataUploadSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DataUploadSessionInclude<ExtArgs> | null
    /**
     * The data needed to update a DataUploadSession.
     */
    data: XOR<DataUploadSessionUpdateInput, DataUploadSessionUncheckedUpdateInput>
    /**
     * Choose, which DataUploadSession to update.
     */
    where: DataUploadSessionWhereUniqueInput
  }

  /**
   * DataUploadSession updateMany
   */
  export type DataUploadSessionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update DataUploadSessions.
     */
    data: XOR<DataUploadSessionUpdateManyMutationInput, DataUploadSessionUncheckedUpdateManyInput>
    /**
     * Filter which DataUploadSessions to update
     */
    where?: DataUploadSessionWhereInput
    /**
     * Limit how many DataUploadSessions to update.
     */
    limit?: number
  }

  /**
   * DataUploadSession updateManyAndReturn
   */
  export type DataUploadSessionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DataUploadSession
     */
    select?: DataUploadSessionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the DataUploadSession
     */
    omit?: DataUploadSessionOmit<ExtArgs> | null
    /**
     * The data used to update DataUploadSessions.
     */
    data: XOR<DataUploadSessionUpdateManyMutationInput, DataUploadSessionUncheckedUpdateManyInput>
    /**
     * Filter which DataUploadSessions to update
     */
    where?: DataUploadSessionWhereInput
    /**
     * Limit how many DataUploadSessions to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DataUploadSessionIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * DataUploadSession upsert
   */
  export type DataUploadSessionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DataUploadSession
     */
    select?: DataUploadSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DataUploadSession
     */
    omit?: DataUploadSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DataUploadSessionInclude<ExtArgs> | null
    /**
     * The filter to search for the DataUploadSession to update in case it exists.
     */
    where: DataUploadSessionWhereUniqueInput
    /**
     * In case the DataUploadSession found by the `where` argument doesn't exist, create a new DataUploadSession with this data.
     */
    create: XOR<DataUploadSessionCreateInput, DataUploadSessionUncheckedCreateInput>
    /**
     * In case the DataUploadSession was found with the provided `where` argument, update it with this data.
     */
    update: XOR<DataUploadSessionUpdateInput, DataUploadSessionUncheckedUpdateInput>
  }

  /**
   * DataUploadSession delete
   */
  export type DataUploadSessionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DataUploadSession
     */
    select?: DataUploadSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DataUploadSession
     */
    omit?: DataUploadSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DataUploadSessionInclude<ExtArgs> | null
    /**
     * Filter which DataUploadSession to delete.
     */
    where: DataUploadSessionWhereUniqueInput
  }

  /**
   * DataUploadSession deleteMany
   */
  export type DataUploadSessionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DataUploadSessions to delete
     */
    where?: DataUploadSessionWhereInput
    /**
     * Limit how many DataUploadSessions to delete.
     */
    limit?: number
  }

  /**
   * DataUploadSession without action
   */
  export type DataUploadSessionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DataUploadSession
     */
    select?: DataUploadSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DataUploadSession
     */
    omit?: DataUploadSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DataUploadSessionInclude<ExtArgs> | null
  }


  /**
   * Model Formula
   */

  export type AggregateFormula = {
    _count: FormulaCountAggregateOutputType | null
    _avg: FormulaAvgAggregateOutputType | null
    _sum: FormulaSumAggregateOutputType | null
    _min: FormulaMinAggregateOutputType | null
    _max: FormulaMaxAggregateOutputType | null
  }

  export type FormulaAvgAggregateOutputType = {
    id: number | null
  }

  export type FormulaSumAggregateOutputType = {
    id: number | null
  }

  export type FormulaMinAggregateOutputType = {
    id: number | null
    name: string | null
    description: string | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type FormulaMaxAggregateOutputType = {
    id: number | null
    name: string | null
    description: string | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type FormulaCountAggregateOutputType = {
    id: number
    name: number
    description: number
    structure: number
    created_at: number
    updated_at: number
    _all: number
  }


  export type FormulaAvgAggregateInputType = {
    id?: true
  }

  export type FormulaSumAggregateInputType = {
    id?: true
  }

  export type FormulaMinAggregateInputType = {
    id?: true
    name?: true
    description?: true
    created_at?: true
    updated_at?: true
  }

  export type FormulaMaxAggregateInputType = {
    id?: true
    name?: true
    description?: true
    created_at?: true
    updated_at?: true
  }

  export type FormulaCountAggregateInputType = {
    id?: true
    name?: true
    description?: true
    structure?: true
    created_at?: true
    updated_at?: true
    _all?: true
  }

  export type FormulaAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Formula to aggregate.
     */
    where?: FormulaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Formulas to fetch.
     */
    orderBy?: FormulaOrderByWithRelationInput | FormulaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: FormulaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Formulas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Formulas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Formulas
    **/
    _count?: true | FormulaCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: FormulaAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: FormulaSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: FormulaMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: FormulaMaxAggregateInputType
  }

  export type GetFormulaAggregateType<T extends FormulaAggregateArgs> = {
        [P in keyof T & keyof AggregateFormula]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateFormula[P]>
      : GetScalarType<T[P], AggregateFormula[P]>
  }




  export type FormulaGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FormulaWhereInput
    orderBy?: FormulaOrderByWithAggregationInput | FormulaOrderByWithAggregationInput[]
    by: FormulaScalarFieldEnum[] | FormulaScalarFieldEnum
    having?: FormulaScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: FormulaCountAggregateInputType | true
    _avg?: FormulaAvgAggregateInputType
    _sum?: FormulaSumAggregateInputType
    _min?: FormulaMinAggregateInputType
    _max?: FormulaMaxAggregateInputType
  }

  export type FormulaGroupByOutputType = {
    id: number
    name: string
    description: string | null
    structure: JsonValue
    created_at: Date
    updated_at: Date
    _count: FormulaCountAggregateOutputType | null
    _avg: FormulaAvgAggregateOutputType | null
    _sum: FormulaSumAggregateOutputType | null
    _min: FormulaMinAggregateOutputType | null
    _max: FormulaMaxAggregateOutputType | null
  }

  type GetFormulaGroupByPayload<T extends FormulaGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<FormulaGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof FormulaGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], FormulaGroupByOutputType[P]>
            : GetScalarType<T[P], FormulaGroupByOutputType[P]>
        }
      >
    >


  export type FormulaSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    structure?: boolean
    created_at?: boolean
    updated_at?: boolean
  }, ExtArgs["result"]["formula"]>

  export type FormulaSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    structure?: boolean
    created_at?: boolean
    updated_at?: boolean
  }, ExtArgs["result"]["formula"]>

  export type FormulaSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    structure?: boolean
    created_at?: boolean
    updated_at?: boolean
  }, ExtArgs["result"]["formula"]>

  export type FormulaSelectScalar = {
    id?: boolean
    name?: boolean
    description?: boolean
    structure?: boolean
    created_at?: boolean
    updated_at?: boolean
  }

  export type FormulaOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "description" | "structure" | "created_at" | "updated_at", ExtArgs["result"]["formula"]>

  export type $FormulaPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Formula"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      name: string
      description: string | null
      structure: Prisma.JsonValue
      created_at: Date
      updated_at: Date
    }, ExtArgs["result"]["formula"]>
    composites: {}
  }

  type FormulaGetPayload<S extends boolean | null | undefined | FormulaDefaultArgs> = $Result.GetResult<Prisma.$FormulaPayload, S>

  type FormulaCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<FormulaFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: FormulaCountAggregateInputType | true
    }

  export interface FormulaDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Formula'], meta: { name: 'Formula' } }
    /**
     * Find zero or one Formula that matches the filter.
     * @param {FormulaFindUniqueArgs} args - Arguments to find a Formula
     * @example
     * // Get one Formula
     * const formula = await prisma.formula.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends FormulaFindUniqueArgs>(args: SelectSubset<T, FormulaFindUniqueArgs<ExtArgs>>): Prisma__FormulaClient<$Result.GetResult<Prisma.$FormulaPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Formula that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {FormulaFindUniqueOrThrowArgs} args - Arguments to find a Formula
     * @example
     * // Get one Formula
     * const formula = await prisma.formula.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends FormulaFindUniqueOrThrowArgs>(args: SelectSubset<T, FormulaFindUniqueOrThrowArgs<ExtArgs>>): Prisma__FormulaClient<$Result.GetResult<Prisma.$FormulaPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Formula that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FormulaFindFirstArgs} args - Arguments to find a Formula
     * @example
     * // Get one Formula
     * const formula = await prisma.formula.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends FormulaFindFirstArgs>(args?: SelectSubset<T, FormulaFindFirstArgs<ExtArgs>>): Prisma__FormulaClient<$Result.GetResult<Prisma.$FormulaPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Formula that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FormulaFindFirstOrThrowArgs} args - Arguments to find a Formula
     * @example
     * // Get one Formula
     * const formula = await prisma.formula.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends FormulaFindFirstOrThrowArgs>(args?: SelectSubset<T, FormulaFindFirstOrThrowArgs<ExtArgs>>): Prisma__FormulaClient<$Result.GetResult<Prisma.$FormulaPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Formulas that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FormulaFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Formulas
     * const formulas = await prisma.formula.findMany()
     * 
     * // Get first 10 Formulas
     * const formulas = await prisma.formula.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const formulaWithIdOnly = await prisma.formula.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends FormulaFindManyArgs>(args?: SelectSubset<T, FormulaFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FormulaPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Formula.
     * @param {FormulaCreateArgs} args - Arguments to create a Formula.
     * @example
     * // Create one Formula
     * const Formula = await prisma.formula.create({
     *   data: {
     *     // ... data to create a Formula
     *   }
     * })
     * 
     */
    create<T extends FormulaCreateArgs>(args: SelectSubset<T, FormulaCreateArgs<ExtArgs>>): Prisma__FormulaClient<$Result.GetResult<Prisma.$FormulaPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Formulas.
     * @param {FormulaCreateManyArgs} args - Arguments to create many Formulas.
     * @example
     * // Create many Formulas
     * const formula = await prisma.formula.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends FormulaCreateManyArgs>(args?: SelectSubset<T, FormulaCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Formulas and returns the data saved in the database.
     * @param {FormulaCreateManyAndReturnArgs} args - Arguments to create many Formulas.
     * @example
     * // Create many Formulas
     * const formula = await prisma.formula.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Formulas and only return the `id`
     * const formulaWithIdOnly = await prisma.formula.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends FormulaCreateManyAndReturnArgs>(args?: SelectSubset<T, FormulaCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FormulaPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Formula.
     * @param {FormulaDeleteArgs} args - Arguments to delete one Formula.
     * @example
     * // Delete one Formula
     * const Formula = await prisma.formula.delete({
     *   where: {
     *     // ... filter to delete one Formula
     *   }
     * })
     * 
     */
    delete<T extends FormulaDeleteArgs>(args: SelectSubset<T, FormulaDeleteArgs<ExtArgs>>): Prisma__FormulaClient<$Result.GetResult<Prisma.$FormulaPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Formula.
     * @param {FormulaUpdateArgs} args - Arguments to update one Formula.
     * @example
     * // Update one Formula
     * const formula = await prisma.formula.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends FormulaUpdateArgs>(args: SelectSubset<T, FormulaUpdateArgs<ExtArgs>>): Prisma__FormulaClient<$Result.GetResult<Prisma.$FormulaPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Formulas.
     * @param {FormulaDeleteManyArgs} args - Arguments to filter Formulas to delete.
     * @example
     * // Delete a few Formulas
     * const { count } = await prisma.formula.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends FormulaDeleteManyArgs>(args?: SelectSubset<T, FormulaDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Formulas.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FormulaUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Formulas
     * const formula = await prisma.formula.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends FormulaUpdateManyArgs>(args: SelectSubset<T, FormulaUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Formulas and returns the data updated in the database.
     * @param {FormulaUpdateManyAndReturnArgs} args - Arguments to update many Formulas.
     * @example
     * // Update many Formulas
     * const formula = await prisma.formula.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Formulas and only return the `id`
     * const formulaWithIdOnly = await prisma.formula.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends FormulaUpdateManyAndReturnArgs>(args: SelectSubset<T, FormulaUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FormulaPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Formula.
     * @param {FormulaUpsertArgs} args - Arguments to update or create a Formula.
     * @example
     * // Update or create a Formula
     * const formula = await prisma.formula.upsert({
     *   create: {
     *     // ... data to create a Formula
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Formula we want to update
     *   }
     * })
     */
    upsert<T extends FormulaUpsertArgs>(args: SelectSubset<T, FormulaUpsertArgs<ExtArgs>>): Prisma__FormulaClient<$Result.GetResult<Prisma.$FormulaPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Formulas.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FormulaCountArgs} args - Arguments to filter Formulas to count.
     * @example
     * // Count the number of Formulas
     * const count = await prisma.formula.count({
     *   where: {
     *     // ... the filter for the Formulas we want to count
     *   }
     * })
    **/
    count<T extends FormulaCountArgs>(
      args?: Subset<T, FormulaCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], FormulaCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Formula.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FormulaAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends FormulaAggregateArgs>(args: Subset<T, FormulaAggregateArgs>): Prisma.PrismaPromise<GetFormulaAggregateType<T>>

    /**
     * Group by Formula.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FormulaGroupByArgs} args - Group by arguments.
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
      T extends FormulaGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: FormulaGroupByArgs['orderBy'] }
        : { orderBy?: FormulaGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, FormulaGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetFormulaGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Formula model
   */
  readonly fields: FormulaFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Formula.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__FormulaClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
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
   * Fields of the Formula model
   */
  interface FormulaFieldRefs {
    readonly id: FieldRef<"Formula", 'Int'>
    readonly name: FieldRef<"Formula", 'String'>
    readonly description: FieldRef<"Formula", 'String'>
    readonly structure: FieldRef<"Formula", 'Json'>
    readonly created_at: FieldRef<"Formula", 'DateTime'>
    readonly updated_at: FieldRef<"Formula", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Formula findUnique
   */
  export type FormulaFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Formula
     */
    select?: FormulaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Formula
     */
    omit?: FormulaOmit<ExtArgs> | null
    /**
     * Filter, which Formula to fetch.
     */
    where: FormulaWhereUniqueInput
  }

  /**
   * Formula findUniqueOrThrow
   */
  export type FormulaFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Formula
     */
    select?: FormulaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Formula
     */
    omit?: FormulaOmit<ExtArgs> | null
    /**
     * Filter, which Formula to fetch.
     */
    where: FormulaWhereUniqueInput
  }

  /**
   * Formula findFirst
   */
  export type FormulaFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Formula
     */
    select?: FormulaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Formula
     */
    omit?: FormulaOmit<ExtArgs> | null
    /**
     * Filter, which Formula to fetch.
     */
    where?: FormulaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Formulas to fetch.
     */
    orderBy?: FormulaOrderByWithRelationInput | FormulaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Formulas.
     */
    cursor?: FormulaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Formulas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Formulas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Formulas.
     */
    distinct?: FormulaScalarFieldEnum | FormulaScalarFieldEnum[]
  }

  /**
   * Formula findFirstOrThrow
   */
  export type FormulaFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Formula
     */
    select?: FormulaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Formula
     */
    omit?: FormulaOmit<ExtArgs> | null
    /**
     * Filter, which Formula to fetch.
     */
    where?: FormulaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Formulas to fetch.
     */
    orderBy?: FormulaOrderByWithRelationInput | FormulaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Formulas.
     */
    cursor?: FormulaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Formulas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Formulas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Formulas.
     */
    distinct?: FormulaScalarFieldEnum | FormulaScalarFieldEnum[]
  }

  /**
   * Formula findMany
   */
  export type FormulaFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Formula
     */
    select?: FormulaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Formula
     */
    omit?: FormulaOmit<ExtArgs> | null
    /**
     * Filter, which Formulas to fetch.
     */
    where?: FormulaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Formulas to fetch.
     */
    orderBy?: FormulaOrderByWithRelationInput | FormulaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Formulas.
     */
    cursor?: FormulaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Formulas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Formulas.
     */
    skip?: number
    distinct?: FormulaScalarFieldEnum | FormulaScalarFieldEnum[]
  }

  /**
   * Formula create
   */
  export type FormulaCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Formula
     */
    select?: FormulaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Formula
     */
    omit?: FormulaOmit<ExtArgs> | null
    /**
     * The data needed to create a Formula.
     */
    data: XOR<FormulaCreateInput, FormulaUncheckedCreateInput>
  }

  /**
   * Formula createMany
   */
  export type FormulaCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Formulas.
     */
    data: FormulaCreateManyInput | FormulaCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Formula createManyAndReturn
   */
  export type FormulaCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Formula
     */
    select?: FormulaSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Formula
     */
    omit?: FormulaOmit<ExtArgs> | null
    /**
     * The data used to create many Formulas.
     */
    data: FormulaCreateManyInput | FormulaCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Formula update
   */
  export type FormulaUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Formula
     */
    select?: FormulaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Formula
     */
    omit?: FormulaOmit<ExtArgs> | null
    /**
     * The data needed to update a Formula.
     */
    data: XOR<FormulaUpdateInput, FormulaUncheckedUpdateInput>
    /**
     * Choose, which Formula to update.
     */
    where: FormulaWhereUniqueInput
  }

  /**
   * Formula updateMany
   */
  export type FormulaUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Formulas.
     */
    data: XOR<FormulaUpdateManyMutationInput, FormulaUncheckedUpdateManyInput>
    /**
     * Filter which Formulas to update
     */
    where?: FormulaWhereInput
    /**
     * Limit how many Formulas to update.
     */
    limit?: number
  }

  /**
   * Formula updateManyAndReturn
   */
  export type FormulaUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Formula
     */
    select?: FormulaSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Formula
     */
    omit?: FormulaOmit<ExtArgs> | null
    /**
     * The data used to update Formulas.
     */
    data: XOR<FormulaUpdateManyMutationInput, FormulaUncheckedUpdateManyInput>
    /**
     * Filter which Formulas to update
     */
    where?: FormulaWhereInput
    /**
     * Limit how many Formulas to update.
     */
    limit?: number
  }

  /**
   * Formula upsert
   */
  export type FormulaUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Formula
     */
    select?: FormulaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Formula
     */
    omit?: FormulaOmit<ExtArgs> | null
    /**
     * The filter to search for the Formula to update in case it exists.
     */
    where: FormulaWhereUniqueInput
    /**
     * In case the Formula found by the `where` argument doesn't exist, create a new Formula with this data.
     */
    create: XOR<FormulaCreateInput, FormulaUncheckedCreateInput>
    /**
     * In case the Formula was found with the provided `where` argument, update it with this data.
     */
    update: XOR<FormulaUpdateInput, FormulaUncheckedUpdateInput>
  }

  /**
   * Formula delete
   */
  export type FormulaDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Formula
     */
    select?: FormulaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Formula
     */
    omit?: FormulaOmit<ExtArgs> | null
    /**
     * Filter which Formula to delete.
     */
    where: FormulaWhereUniqueInput
  }

  /**
   * Formula deleteMany
   */
  export type FormulaDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Formulas to delete
     */
    where?: FormulaWhereInput
    /**
     * Limit how many Formulas to delete.
     */
    limit?: number
  }

  /**
   * Formula without action
   */
  export type FormulaDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Formula
     */
    select?: FormulaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Formula
     */
    omit?: FormulaOmit<ExtArgs> | null
  }


  /**
   * Model Indicator
   */

  export type AggregateIndicator = {
    _count: IndicatorCountAggregateOutputType | null
    _avg: IndicatorAvgAggregateOutputType | null
    _sum: IndicatorSumAggregateOutputType | null
    _min: IndicatorMinAggregateOutputType | null
    _max: IndicatorMaxAggregateOutputType | null
  }

  export type IndicatorAvgAggregateOutputType = {
    id: number | null
  }

  export type IndicatorSumAggregateOutputType = {
    id: number | null
  }

  export type IndicatorMinAggregateOutputType = {
    id: number | null
    code: string | null
    name: string | null
    description: string | null
    type: string | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type IndicatorMaxAggregateOutputType = {
    id: number | null
    code: string | null
    name: string | null
    description: string | null
    type: string | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type IndicatorCountAggregateOutputType = {
    id: number
    code: number
    name: number
    description: number
    type: number
    structure: number
    created_at: number
    updated_at: number
    _all: number
  }


  export type IndicatorAvgAggregateInputType = {
    id?: true
  }

  export type IndicatorSumAggregateInputType = {
    id?: true
  }

  export type IndicatorMinAggregateInputType = {
    id?: true
    code?: true
    name?: true
    description?: true
    type?: true
    created_at?: true
    updated_at?: true
  }

  export type IndicatorMaxAggregateInputType = {
    id?: true
    code?: true
    name?: true
    description?: true
    type?: true
    created_at?: true
    updated_at?: true
  }

  export type IndicatorCountAggregateInputType = {
    id?: true
    code?: true
    name?: true
    description?: true
    type?: true
    structure?: true
    created_at?: true
    updated_at?: true
    _all?: true
  }

  export type IndicatorAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Indicator to aggregate.
     */
    where?: IndicatorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Indicators to fetch.
     */
    orderBy?: IndicatorOrderByWithRelationInput | IndicatorOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: IndicatorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Indicators from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Indicators.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Indicators
    **/
    _count?: true | IndicatorCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: IndicatorAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: IndicatorSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: IndicatorMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: IndicatorMaxAggregateInputType
  }

  export type GetIndicatorAggregateType<T extends IndicatorAggregateArgs> = {
        [P in keyof T & keyof AggregateIndicator]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateIndicator[P]>
      : GetScalarType<T[P], AggregateIndicator[P]>
  }




  export type IndicatorGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: IndicatorWhereInput
    orderBy?: IndicatorOrderByWithAggregationInput | IndicatorOrderByWithAggregationInput[]
    by: IndicatorScalarFieldEnum[] | IndicatorScalarFieldEnum
    having?: IndicatorScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: IndicatorCountAggregateInputType | true
    _avg?: IndicatorAvgAggregateInputType
    _sum?: IndicatorSumAggregateInputType
    _min?: IndicatorMinAggregateInputType
    _max?: IndicatorMaxAggregateInputType
  }

  export type IndicatorGroupByOutputType = {
    id: number
    code: string
    name: string
    description: string | null
    type: string
    structure: JsonValue | null
    created_at: Date
    updated_at: Date
    _count: IndicatorCountAggregateOutputType | null
    _avg: IndicatorAvgAggregateOutputType | null
    _sum: IndicatorSumAggregateOutputType | null
    _min: IndicatorMinAggregateOutputType | null
    _max: IndicatorMaxAggregateOutputType | null
  }

  type GetIndicatorGroupByPayload<T extends IndicatorGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<IndicatorGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof IndicatorGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], IndicatorGroupByOutputType[P]>
            : GetScalarType<T[P], IndicatorGroupByOutputType[P]>
        }
      >
    >


  export type IndicatorSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    code?: boolean
    name?: boolean
    description?: boolean
    type?: boolean
    structure?: boolean
    created_at?: boolean
    updated_at?: boolean
    monthly_data?: boolean | Indicator$monthly_dataArgs<ExtArgs>
    _count?: boolean | IndicatorCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["indicator"]>

  export type IndicatorSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    code?: boolean
    name?: boolean
    description?: boolean
    type?: boolean
    structure?: boolean
    created_at?: boolean
    updated_at?: boolean
  }, ExtArgs["result"]["indicator"]>

  export type IndicatorSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    code?: boolean
    name?: boolean
    description?: boolean
    type?: boolean
    structure?: boolean
    created_at?: boolean
    updated_at?: boolean
  }, ExtArgs["result"]["indicator"]>

  export type IndicatorSelectScalar = {
    id?: boolean
    code?: boolean
    name?: boolean
    description?: boolean
    type?: boolean
    structure?: boolean
    created_at?: boolean
    updated_at?: boolean
  }

  export type IndicatorOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "code" | "name" | "description" | "type" | "structure" | "created_at" | "updated_at", ExtArgs["result"]["indicator"]>
  export type IndicatorInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    monthly_data?: boolean | Indicator$monthly_dataArgs<ExtArgs>
    _count?: boolean | IndicatorCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type IndicatorIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type IndicatorIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $IndicatorPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Indicator"
    objects: {
      monthly_data: Prisma.$MonthlyHealthDataPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      code: string
      name: string
      description: string | null
      type: string
      structure: Prisma.JsonValue | null
      created_at: Date
      updated_at: Date
    }, ExtArgs["result"]["indicator"]>
    composites: {}
  }

  type IndicatorGetPayload<S extends boolean | null | undefined | IndicatorDefaultArgs> = $Result.GetResult<Prisma.$IndicatorPayload, S>

  type IndicatorCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<IndicatorFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: IndicatorCountAggregateInputType | true
    }

  export interface IndicatorDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Indicator'], meta: { name: 'Indicator' } }
    /**
     * Find zero or one Indicator that matches the filter.
     * @param {IndicatorFindUniqueArgs} args - Arguments to find a Indicator
     * @example
     * // Get one Indicator
     * const indicator = await prisma.indicator.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends IndicatorFindUniqueArgs>(args: SelectSubset<T, IndicatorFindUniqueArgs<ExtArgs>>): Prisma__IndicatorClient<$Result.GetResult<Prisma.$IndicatorPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Indicator that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {IndicatorFindUniqueOrThrowArgs} args - Arguments to find a Indicator
     * @example
     * // Get one Indicator
     * const indicator = await prisma.indicator.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends IndicatorFindUniqueOrThrowArgs>(args: SelectSubset<T, IndicatorFindUniqueOrThrowArgs<ExtArgs>>): Prisma__IndicatorClient<$Result.GetResult<Prisma.$IndicatorPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Indicator that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IndicatorFindFirstArgs} args - Arguments to find a Indicator
     * @example
     * // Get one Indicator
     * const indicator = await prisma.indicator.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends IndicatorFindFirstArgs>(args?: SelectSubset<T, IndicatorFindFirstArgs<ExtArgs>>): Prisma__IndicatorClient<$Result.GetResult<Prisma.$IndicatorPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Indicator that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IndicatorFindFirstOrThrowArgs} args - Arguments to find a Indicator
     * @example
     * // Get one Indicator
     * const indicator = await prisma.indicator.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends IndicatorFindFirstOrThrowArgs>(args?: SelectSubset<T, IndicatorFindFirstOrThrowArgs<ExtArgs>>): Prisma__IndicatorClient<$Result.GetResult<Prisma.$IndicatorPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Indicators that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IndicatorFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Indicators
     * const indicators = await prisma.indicator.findMany()
     * 
     * // Get first 10 Indicators
     * const indicators = await prisma.indicator.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const indicatorWithIdOnly = await prisma.indicator.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends IndicatorFindManyArgs>(args?: SelectSubset<T, IndicatorFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$IndicatorPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Indicator.
     * @param {IndicatorCreateArgs} args - Arguments to create a Indicator.
     * @example
     * // Create one Indicator
     * const Indicator = await prisma.indicator.create({
     *   data: {
     *     // ... data to create a Indicator
     *   }
     * })
     * 
     */
    create<T extends IndicatorCreateArgs>(args: SelectSubset<T, IndicatorCreateArgs<ExtArgs>>): Prisma__IndicatorClient<$Result.GetResult<Prisma.$IndicatorPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Indicators.
     * @param {IndicatorCreateManyArgs} args - Arguments to create many Indicators.
     * @example
     * // Create many Indicators
     * const indicator = await prisma.indicator.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends IndicatorCreateManyArgs>(args?: SelectSubset<T, IndicatorCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Indicators and returns the data saved in the database.
     * @param {IndicatorCreateManyAndReturnArgs} args - Arguments to create many Indicators.
     * @example
     * // Create many Indicators
     * const indicator = await prisma.indicator.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Indicators and only return the `id`
     * const indicatorWithIdOnly = await prisma.indicator.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends IndicatorCreateManyAndReturnArgs>(args?: SelectSubset<T, IndicatorCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$IndicatorPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Indicator.
     * @param {IndicatorDeleteArgs} args - Arguments to delete one Indicator.
     * @example
     * // Delete one Indicator
     * const Indicator = await prisma.indicator.delete({
     *   where: {
     *     // ... filter to delete one Indicator
     *   }
     * })
     * 
     */
    delete<T extends IndicatorDeleteArgs>(args: SelectSubset<T, IndicatorDeleteArgs<ExtArgs>>): Prisma__IndicatorClient<$Result.GetResult<Prisma.$IndicatorPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Indicator.
     * @param {IndicatorUpdateArgs} args - Arguments to update one Indicator.
     * @example
     * // Update one Indicator
     * const indicator = await prisma.indicator.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends IndicatorUpdateArgs>(args: SelectSubset<T, IndicatorUpdateArgs<ExtArgs>>): Prisma__IndicatorClient<$Result.GetResult<Prisma.$IndicatorPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Indicators.
     * @param {IndicatorDeleteManyArgs} args - Arguments to filter Indicators to delete.
     * @example
     * // Delete a few Indicators
     * const { count } = await prisma.indicator.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends IndicatorDeleteManyArgs>(args?: SelectSubset<T, IndicatorDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Indicators.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IndicatorUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Indicators
     * const indicator = await prisma.indicator.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends IndicatorUpdateManyArgs>(args: SelectSubset<T, IndicatorUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Indicators and returns the data updated in the database.
     * @param {IndicatorUpdateManyAndReturnArgs} args - Arguments to update many Indicators.
     * @example
     * // Update many Indicators
     * const indicator = await prisma.indicator.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Indicators and only return the `id`
     * const indicatorWithIdOnly = await prisma.indicator.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends IndicatorUpdateManyAndReturnArgs>(args: SelectSubset<T, IndicatorUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$IndicatorPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Indicator.
     * @param {IndicatorUpsertArgs} args - Arguments to update or create a Indicator.
     * @example
     * // Update or create a Indicator
     * const indicator = await prisma.indicator.upsert({
     *   create: {
     *     // ... data to create a Indicator
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Indicator we want to update
     *   }
     * })
     */
    upsert<T extends IndicatorUpsertArgs>(args: SelectSubset<T, IndicatorUpsertArgs<ExtArgs>>): Prisma__IndicatorClient<$Result.GetResult<Prisma.$IndicatorPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Indicators.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IndicatorCountArgs} args - Arguments to filter Indicators to count.
     * @example
     * // Count the number of Indicators
     * const count = await prisma.indicator.count({
     *   where: {
     *     // ... the filter for the Indicators we want to count
     *   }
     * })
    **/
    count<T extends IndicatorCountArgs>(
      args?: Subset<T, IndicatorCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], IndicatorCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Indicator.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IndicatorAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends IndicatorAggregateArgs>(args: Subset<T, IndicatorAggregateArgs>): Prisma.PrismaPromise<GetIndicatorAggregateType<T>>

    /**
     * Group by Indicator.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IndicatorGroupByArgs} args - Group by arguments.
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
      T extends IndicatorGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: IndicatorGroupByArgs['orderBy'] }
        : { orderBy?: IndicatorGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, IndicatorGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetIndicatorGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Indicator model
   */
  readonly fields: IndicatorFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Indicator.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__IndicatorClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    monthly_data<T extends Indicator$monthly_dataArgs<ExtArgs> = {}>(args?: Subset<T, Indicator$monthly_dataArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MonthlyHealthDataPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the Indicator model
   */
  interface IndicatorFieldRefs {
    readonly id: FieldRef<"Indicator", 'Int'>
    readonly code: FieldRef<"Indicator", 'String'>
    readonly name: FieldRef<"Indicator", 'String'>
    readonly description: FieldRef<"Indicator", 'String'>
    readonly type: FieldRef<"Indicator", 'String'>
    readonly structure: FieldRef<"Indicator", 'Json'>
    readonly created_at: FieldRef<"Indicator", 'DateTime'>
    readonly updated_at: FieldRef<"Indicator", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Indicator findUnique
   */
  export type IndicatorFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Indicator
     */
    select?: IndicatorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Indicator
     */
    omit?: IndicatorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IndicatorInclude<ExtArgs> | null
    /**
     * Filter, which Indicator to fetch.
     */
    where: IndicatorWhereUniqueInput
  }

  /**
   * Indicator findUniqueOrThrow
   */
  export type IndicatorFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Indicator
     */
    select?: IndicatorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Indicator
     */
    omit?: IndicatorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IndicatorInclude<ExtArgs> | null
    /**
     * Filter, which Indicator to fetch.
     */
    where: IndicatorWhereUniqueInput
  }

  /**
   * Indicator findFirst
   */
  export type IndicatorFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Indicator
     */
    select?: IndicatorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Indicator
     */
    omit?: IndicatorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IndicatorInclude<ExtArgs> | null
    /**
     * Filter, which Indicator to fetch.
     */
    where?: IndicatorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Indicators to fetch.
     */
    orderBy?: IndicatorOrderByWithRelationInput | IndicatorOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Indicators.
     */
    cursor?: IndicatorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Indicators from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Indicators.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Indicators.
     */
    distinct?: IndicatorScalarFieldEnum | IndicatorScalarFieldEnum[]
  }

  /**
   * Indicator findFirstOrThrow
   */
  export type IndicatorFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Indicator
     */
    select?: IndicatorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Indicator
     */
    omit?: IndicatorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IndicatorInclude<ExtArgs> | null
    /**
     * Filter, which Indicator to fetch.
     */
    where?: IndicatorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Indicators to fetch.
     */
    orderBy?: IndicatorOrderByWithRelationInput | IndicatorOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Indicators.
     */
    cursor?: IndicatorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Indicators from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Indicators.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Indicators.
     */
    distinct?: IndicatorScalarFieldEnum | IndicatorScalarFieldEnum[]
  }

  /**
   * Indicator findMany
   */
  export type IndicatorFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Indicator
     */
    select?: IndicatorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Indicator
     */
    omit?: IndicatorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IndicatorInclude<ExtArgs> | null
    /**
     * Filter, which Indicators to fetch.
     */
    where?: IndicatorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Indicators to fetch.
     */
    orderBy?: IndicatorOrderByWithRelationInput | IndicatorOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Indicators.
     */
    cursor?: IndicatorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Indicators from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Indicators.
     */
    skip?: number
    distinct?: IndicatorScalarFieldEnum | IndicatorScalarFieldEnum[]
  }

  /**
   * Indicator create
   */
  export type IndicatorCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Indicator
     */
    select?: IndicatorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Indicator
     */
    omit?: IndicatorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IndicatorInclude<ExtArgs> | null
    /**
     * The data needed to create a Indicator.
     */
    data: XOR<IndicatorCreateInput, IndicatorUncheckedCreateInput>
  }

  /**
   * Indicator createMany
   */
  export type IndicatorCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Indicators.
     */
    data: IndicatorCreateManyInput | IndicatorCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Indicator createManyAndReturn
   */
  export type IndicatorCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Indicator
     */
    select?: IndicatorSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Indicator
     */
    omit?: IndicatorOmit<ExtArgs> | null
    /**
     * The data used to create many Indicators.
     */
    data: IndicatorCreateManyInput | IndicatorCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Indicator update
   */
  export type IndicatorUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Indicator
     */
    select?: IndicatorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Indicator
     */
    omit?: IndicatorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IndicatorInclude<ExtArgs> | null
    /**
     * The data needed to update a Indicator.
     */
    data: XOR<IndicatorUpdateInput, IndicatorUncheckedUpdateInput>
    /**
     * Choose, which Indicator to update.
     */
    where: IndicatorWhereUniqueInput
  }

  /**
   * Indicator updateMany
   */
  export type IndicatorUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Indicators.
     */
    data: XOR<IndicatorUpdateManyMutationInput, IndicatorUncheckedUpdateManyInput>
    /**
     * Filter which Indicators to update
     */
    where?: IndicatorWhereInput
    /**
     * Limit how many Indicators to update.
     */
    limit?: number
  }

  /**
   * Indicator updateManyAndReturn
   */
  export type IndicatorUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Indicator
     */
    select?: IndicatorSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Indicator
     */
    omit?: IndicatorOmit<ExtArgs> | null
    /**
     * The data used to update Indicators.
     */
    data: XOR<IndicatorUpdateManyMutationInput, IndicatorUncheckedUpdateManyInput>
    /**
     * Filter which Indicators to update
     */
    where?: IndicatorWhereInput
    /**
     * Limit how many Indicators to update.
     */
    limit?: number
  }

  /**
   * Indicator upsert
   */
  export type IndicatorUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Indicator
     */
    select?: IndicatorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Indicator
     */
    omit?: IndicatorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IndicatorInclude<ExtArgs> | null
    /**
     * The filter to search for the Indicator to update in case it exists.
     */
    where: IndicatorWhereUniqueInput
    /**
     * In case the Indicator found by the `where` argument doesn't exist, create a new Indicator with this data.
     */
    create: XOR<IndicatorCreateInput, IndicatorUncheckedCreateInput>
    /**
     * In case the Indicator was found with the provided `where` argument, update it with this data.
     */
    update: XOR<IndicatorUpdateInput, IndicatorUncheckedUpdateInput>
  }

  /**
   * Indicator delete
   */
  export type IndicatorDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Indicator
     */
    select?: IndicatorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Indicator
     */
    omit?: IndicatorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IndicatorInclude<ExtArgs> | null
    /**
     * Filter which Indicator to delete.
     */
    where: IndicatorWhereUniqueInput
  }

  /**
   * Indicator deleteMany
   */
  export type IndicatorDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Indicators to delete
     */
    where?: IndicatorWhereInput
    /**
     * Limit how many Indicators to delete.
     */
    limit?: number
  }

  /**
   * Indicator.monthly_data
   */
  export type Indicator$monthly_dataArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MonthlyHealthData
     */
    select?: MonthlyHealthDataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MonthlyHealthData
     */
    omit?: MonthlyHealthDataOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MonthlyHealthDataInclude<ExtArgs> | null
    where?: MonthlyHealthDataWhereInput
    orderBy?: MonthlyHealthDataOrderByWithRelationInput | MonthlyHealthDataOrderByWithRelationInput[]
    cursor?: MonthlyHealthDataWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MonthlyHealthDataScalarFieldEnum | MonthlyHealthDataScalarFieldEnum[]
  }

  /**
   * Indicator without action
   */
  export type IndicatorDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Indicator
     */
    select?: IndicatorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Indicator
     */
    omit?: IndicatorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IndicatorInclude<ExtArgs> | null
  }


  /**
   * Model field
   */

  export type AggregateField = {
    _count: FieldCountAggregateOutputType | null
    _avg: FieldAvgAggregateOutputType | null
    _sum: FieldSumAggregateOutputType | null
    _min: FieldMinAggregateOutputType | null
    _max: FieldMaxAggregateOutputType | null
  }

  export type FieldAvgAggregateOutputType = {
    id: number | null
  }

  export type FieldSumAggregateOutputType = {
    id: number | null
  }

  export type FieldMinAggregateOutputType = {
    id: number | null
    code: string | null
    name: string | null
    description: string | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type FieldMaxAggregateOutputType = {
    id: number | null
    code: string | null
    name: string | null
    description: string | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type FieldCountAggregateOutputType = {
    id: number
    code: number
    name: number
    description: number
    created_at: number
    updated_at: number
    _all: number
  }


  export type FieldAvgAggregateInputType = {
    id?: true
  }

  export type FieldSumAggregateInputType = {
    id?: true
  }

  export type FieldMinAggregateInputType = {
    id?: true
    code?: true
    name?: true
    description?: true
    created_at?: true
    updated_at?: true
  }

  export type FieldMaxAggregateInputType = {
    id?: true
    code?: true
    name?: true
    description?: true
    created_at?: true
    updated_at?: true
  }

  export type FieldCountAggregateInputType = {
    id?: true
    code?: true
    name?: true
    description?: true
    created_at?: true
    updated_at?: true
    _all?: true
  }

  export type FieldAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which field to aggregate.
     */
    where?: fieldWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of fields to fetch.
     */
    orderBy?: fieldOrderByWithRelationInput | fieldOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: fieldWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` fields from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` fields.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned fields
    **/
    _count?: true | FieldCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: FieldAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: FieldSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: FieldMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: FieldMaxAggregateInputType
  }

  export type GetFieldAggregateType<T extends FieldAggregateArgs> = {
        [P in keyof T & keyof AggregateField]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateField[P]>
      : GetScalarType<T[P], AggregateField[P]>
  }




  export type fieldGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: fieldWhereInput
    orderBy?: fieldOrderByWithAggregationInput | fieldOrderByWithAggregationInput[]
    by: FieldScalarFieldEnum[] | FieldScalarFieldEnum
    having?: fieldScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: FieldCountAggregateInputType | true
    _avg?: FieldAvgAggregateInputType
    _sum?: FieldSumAggregateInputType
    _min?: FieldMinAggregateInputType
    _max?: FieldMaxAggregateInputType
  }

  export type FieldGroupByOutputType = {
    id: number
    code: string
    name: string
    description: string | null
    created_at: Date
    updated_at: Date
    _count: FieldCountAggregateOutputType | null
    _avg: FieldAvgAggregateOutputType | null
    _sum: FieldSumAggregateOutputType | null
    _min: FieldMinAggregateOutputType | null
    _max: FieldMaxAggregateOutputType | null
  }

  type GetFieldGroupByPayload<T extends fieldGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<FieldGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof FieldGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], FieldGroupByOutputType[P]>
            : GetScalarType<T[P], FieldGroupByOutputType[P]>
        }
      >
    >


  export type fieldSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    code?: boolean
    name?: boolean
    description?: boolean
    created_at?: boolean
    updated_at?: boolean
  }, ExtArgs["result"]["field"]>

  export type fieldSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    code?: boolean
    name?: boolean
    description?: boolean
    created_at?: boolean
    updated_at?: boolean
  }, ExtArgs["result"]["field"]>

  export type fieldSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    code?: boolean
    name?: boolean
    description?: boolean
    created_at?: boolean
    updated_at?: boolean
  }, ExtArgs["result"]["field"]>

  export type fieldSelectScalar = {
    id?: boolean
    code?: boolean
    name?: boolean
    description?: boolean
    created_at?: boolean
    updated_at?: boolean
  }

  export type fieldOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "code" | "name" | "description" | "created_at" | "updated_at", ExtArgs["result"]["field"]>

  export type $fieldPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "field"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      code: string
      name: string
      description: string | null
      created_at: Date
      updated_at: Date
    }, ExtArgs["result"]["field"]>
    composites: {}
  }

  type fieldGetPayload<S extends boolean | null | undefined | fieldDefaultArgs> = $Result.GetResult<Prisma.$fieldPayload, S>

  type fieldCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<fieldFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: FieldCountAggregateInputType | true
    }

  export interface fieldDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['field'], meta: { name: 'field' } }
    /**
     * Find zero or one Field that matches the filter.
     * @param {fieldFindUniqueArgs} args - Arguments to find a Field
     * @example
     * // Get one Field
     * const field = await prisma.field.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends fieldFindUniqueArgs>(args: SelectSubset<T, fieldFindUniqueArgs<ExtArgs>>): Prisma__fieldClient<$Result.GetResult<Prisma.$fieldPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Field that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {fieldFindUniqueOrThrowArgs} args - Arguments to find a Field
     * @example
     * // Get one Field
     * const field = await prisma.field.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends fieldFindUniqueOrThrowArgs>(args: SelectSubset<T, fieldFindUniqueOrThrowArgs<ExtArgs>>): Prisma__fieldClient<$Result.GetResult<Prisma.$fieldPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Field that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {fieldFindFirstArgs} args - Arguments to find a Field
     * @example
     * // Get one Field
     * const field = await prisma.field.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends fieldFindFirstArgs>(args?: SelectSubset<T, fieldFindFirstArgs<ExtArgs>>): Prisma__fieldClient<$Result.GetResult<Prisma.$fieldPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Field that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {fieldFindFirstOrThrowArgs} args - Arguments to find a Field
     * @example
     * // Get one Field
     * const field = await prisma.field.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends fieldFindFirstOrThrowArgs>(args?: SelectSubset<T, fieldFindFirstOrThrowArgs<ExtArgs>>): Prisma__fieldClient<$Result.GetResult<Prisma.$fieldPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Fields that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {fieldFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Fields
     * const fields = await prisma.field.findMany()
     * 
     * // Get first 10 Fields
     * const fields = await prisma.field.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const fieldWithIdOnly = await prisma.field.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends fieldFindManyArgs>(args?: SelectSubset<T, fieldFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$fieldPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Field.
     * @param {fieldCreateArgs} args - Arguments to create a Field.
     * @example
     * // Create one Field
     * const Field = await prisma.field.create({
     *   data: {
     *     // ... data to create a Field
     *   }
     * })
     * 
     */
    create<T extends fieldCreateArgs>(args: SelectSubset<T, fieldCreateArgs<ExtArgs>>): Prisma__fieldClient<$Result.GetResult<Prisma.$fieldPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Fields.
     * @param {fieldCreateManyArgs} args - Arguments to create many Fields.
     * @example
     * // Create many Fields
     * const field = await prisma.field.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends fieldCreateManyArgs>(args?: SelectSubset<T, fieldCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Fields and returns the data saved in the database.
     * @param {fieldCreateManyAndReturnArgs} args - Arguments to create many Fields.
     * @example
     * // Create many Fields
     * const field = await prisma.field.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Fields and only return the `id`
     * const fieldWithIdOnly = await prisma.field.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends fieldCreateManyAndReturnArgs>(args?: SelectSubset<T, fieldCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$fieldPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Field.
     * @param {fieldDeleteArgs} args - Arguments to delete one Field.
     * @example
     * // Delete one Field
     * const Field = await prisma.field.delete({
     *   where: {
     *     // ... filter to delete one Field
     *   }
     * })
     * 
     */
    delete<T extends fieldDeleteArgs>(args: SelectSubset<T, fieldDeleteArgs<ExtArgs>>): Prisma__fieldClient<$Result.GetResult<Prisma.$fieldPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Field.
     * @param {fieldUpdateArgs} args - Arguments to update one Field.
     * @example
     * // Update one Field
     * const field = await prisma.field.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends fieldUpdateArgs>(args: SelectSubset<T, fieldUpdateArgs<ExtArgs>>): Prisma__fieldClient<$Result.GetResult<Prisma.$fieldPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Fields.
     * @param {fieldDeleteManyArgs} args - Arguments to filter Fields to delete.
     * @example
     * // Delete a few Fields
     * const { count } = await prisma.field.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends fieldDeleteManyArgs>(args?: SelectSubset<T, fieldDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Fields.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {fieldUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Fields
     * const field = await prisma.field.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends fieldUpdateManyArgs>(args: SelectSubset<T, fieldUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Fields and returns the data updated in the database.
     * @param {fieldUpdateManyAndReturnArgs} args - Arguments to update many Fields.
     * @example
     * // Update many Fields
     * const field = await prisma.field.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Fields and only return the `id`
     * const fieldWithIdOnly = await prisma.field.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends fieldUpdateManyAndReturnArgs>(args: SelectSubset<T, fieldUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$fieldPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Field.
     * @param {fieldUpsertArgs} args - Arguments to update or create a Field.
     * @example
     * // Update or create a Field
     * const field = await prisma.field.upsert({
     *   create: {
     *     // ... data to create a Field
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Field we want to update
     *   }
     * })
     */
    upsert<T extends fieldUpsertArgs>(args: SelectSubset<T, fieldUpsertArgs<ExtArgs>>): Prisma__fieldClient<$Result.GetResult<Prisma.$fieldPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Fields.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {fieldCountArgs} args - Arguments to filter Fields to count.
     * @example
     * // Count the number of Fields
     * const count = await prisma.field.count({
     *   where: {
     *     // ... the filter for the Fields we want to count
     *   }
     * })
    **/
    count<T extends fieldCountArgs>(
      args?: Subset<T, fieldCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], FieldCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Field.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FieldAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends FieldAggregateArgs>(args: Subset<T, FieldAggregateArgs>): Prisma.PrismaPromise<GetFieldAggregateType<T>>

    /**
     * Group by Field.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {fieldGroupByArgs} args - Group by arguments.
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
      T extends fieldGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: fieldGroupByArgs['orderBy'] }
        : { orderBy?: fieldGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, fieldGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetFieldGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the field model
   */
  readonly fields: fieldFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for field.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__fieldClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
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
   * Fields of the field model
   */
  interface fieldFieldRefs {
    readonly id: FieldRef<"field", 'Int'>
    readonly code: FieldRef<"field", 'String'>
    readonly name: FieldRef<"field", 'String'>
    readonly description: FieldRef<"field", 'String'>
    readonly created_at: FieldRef<"field", 'DateTime'>
    readonly updated_at: FieldRef<"field", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * field findUnique
   */
  export type fieldFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the field
     */
    select?: fieldSelect<ExtArgs> | null
    /**
     * Omit specific fields from the field
     */
    omit?: fieldOmit<ExtArgs> | null
    /**
     * Filter, which field to fetch.
     */
    where: fieldWhereUniqueInput
  }

  /**
   * field findUniqueOrThrow
   */
  export type fieldFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the field
     */
    select?: fieldSelect<ExtArgs> | null
    /**
     * Omit specific fields from the field
     */
    omit?: fieldOmit<ExtArgs> | null
    /**
     * Filter, which field to fetch.
     */
    where: fieldWhereUniqueInput
  }

  /**
   * field findFirst
   */
  export type fieldFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the field
     */
    select?: fieldSelect<ExtArgs> | null
    /**
     * Omit specific fields from the field
     */
    omit?: fieldOmit<ExtArgs> | null
    /**
     * Filter, which field to fetch.
     */
    where?: fieldWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of fields to fetch.
     */
    orderBy?: fieldOrderByWithRelationInput | fieldOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for fields.
     */
    cursor?: fieldWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` fields from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` fields.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of fields.
     */
    distinct?: FieldScalarFieldEnum | FieldScalarFieldEnum[]
  }

  /**
   * field findFirstOrThrow
   */
  export type fieldFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the field
     */
    select?: fieldSelect<ExtArgs> | null
    /**
     * Omit specific fields from the field
     */
    omit?: fieldOmit<ExtArgs> | null
    /**
     * Filter, which field to fetch.
     */
    where?: fieldWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of fields to fetch.
     */
    orderBy?: fieldOrderByWithRelationInput | fieldOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for fields.
     */
    cursor?: fieldWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` fields from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` fields.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of fields.
     */
    distinct?: FieldScalarFieldEnum | FieldScalarFieldEnum[]
  }

  /**
   * field findMany
   */
  export type fieldFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the field
     */
    select?: fieldSelect<ExtArgs> | null
    /**
     * Omit specific fields from the field
     */
    omit?: fieldOmit<ExtArgs> | null
    /**
     * Filter, which fields to fetch.
     */
    where?: fieldWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of fields to fetch.
     */
    orderBy?: fieldOrderByWithRelationInput | fieldOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing fields.
     */
    cursor?: fieldWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` fields from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` fields.
     */
    skip?: number
    distinct?: FieldScalarFieldEnum | FieldScalarFieldEnum[]
  }

  /**
   * field create
   */
  export type fieldCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the field
     */
    select?: fieldSelect<ExtArgs> | null
    /**
     * Omit specific fields from the field
     */
    omit?: fieldOmit<ExtArgs> | null
    /**
     * The data needed to create a field.
     */
    data: XOR<fieldCreateInput, fieldUncheckedCreateInput>
  }

  /**
   * field createMany
   */
  export type fieldCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many fields.
     */
    data: fieldCreateManyInput | fieldCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * field createManyAndReturn
   */
  export type fieldCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the field
     */
    select?: fieldSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the field
     */
    omit?: fieldOmit<ExtArgs> | null
    /**
     * The data used to create many fields.
     */
    data: fieldCreateManyInput | fieldCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * field update
   */
  export type fieldUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the field
     */
    select?: fieldSelect<ExtArgs> | null
    /**
     * Omit specific fields from the field
     */
    omit?: fieldOmit<ExtArgs> | null
    /**
     * The data needed to update a field.
     */
    data: XOR<fieldUpdateInput, fieldUncheckedUpdateInput>
    /**
     * Choose, which field to update.
     */
    where: fieldWhereUniqueInput
  }

  /**
   * field updateMany
   */
  export type fieldUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update fields.
     */
    data: XOR<fieldUpdateManyMutationInput, fieldUncheckedUpdateManyInput>
    /**
     * Filter which fields to update
     */
    where?: fieldWhereInput
    /**
     * Limit how many fields to update.
     */
    limit?: number
  }

  /**
   * field updateManyAndReturn
   */
  export type fieldUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the field
     */
    select?: fieldSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the field
     */
    omit?: fieldOmit<ExtArgs> | null
    /**
     * The data used to update fields.
     */
    data: XOR<fieldUpdateManyMutationInput, fieldUncheckedUpdateManyInput>
    /**
     * Filter which fields to update
     */
    where?: fieldWhereInput
    /**
     * Limit how many fields to update.
     */
    limit?: number
  }

  /**
   * field upsert
   */
  export type fieldUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the field
     */
    select?: fieldSelect<ExtArgs> | null
    /**
     * Omit specific fields from the field
     */
    omit?: fieldOmit<ExtArgs> | null
    /**
     * The filter to search for the field to update in case it exists.
     */
    where: fieldWhereUniqueInput
    /**
     * In case the field found by the `where` argument doesn't exist, create a new field with this data.
     */
    create: XOR<fieldCreateInput, fieldUncheckedCreateInput>
    /**
     * In case the field was found with the provided `where` argument, update it with this data.
     */
    update: XOR<fieldUpdateInput, fieldUncheckedUpdateInput>
  }

  /**
   * field delete
   */
  export type fieldDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the field
     */
    select?: fieldSelect<ExtArgs> | null
    /**
     * Omit specific fields from the field
     */
    omit?: fieldOmit<ExtArgs> | null
    /**
     * Filter which field to delete.
     */
    where: fieldWhereUniqueInput
  }

  /**
   * field deleteMany
   */
  export type fieldDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which fields to delete
     */
    where?: fieldWhereInput
    /**
     * Limit how many fields to delete.
     */
    limit?: number
  }

  /**
   * field without action
   */
  export type fieldDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the field
     */
    select?: fieldSelect<ExtArgs> | null
    /**
     * Omit specific fields from the field
     */
    omit?: fieldOmit<ExtArgs> | null
  }


  /**
   * Model sub_centre
   */

  export type AggregateSub_centre = {
    _count: Sub_centreCountAggregateOutputType | null
    _avg: Sub_centreAvgAggregateOutputType | null
    _sum: Sub_centreSumAggregateOutputType | null
    _min: Sub_centreMinAggregateOutputType | null
    _max: Sub_centreMaxAggregateOutputType | null
  }

  export type Sub_centreAvgAggregateOutputType = {
    id: number | null
    facility_id: number | null
  }

  export type Sub_centreSumAggregateOutputType = {
    id: number | null
    facility_id: number | null
  }

  export type Sub_centreMinAggregateOutputType = {
    id: number | null
    name: string | null
    facility_id: number | null
    created_at: Date | null
    updated_at: Date | null
    facility_code: string | null
    nin: string | null
  }

  export type Sub_centreMaxAggregateOutputType = {
    id: number | null
    name: string | null
    facility_id: number | null
    created_at: Date | null
    updated_at: Date | null
    facility_code: string | null
    nin: string | null
  }

  export type Sub_centreCountAggregateOutputType = {
    id: number
    name: number
    facility_id: number
    created_at: number
    updated_at: number
    facility_code: number
    nin: number
    _all: number
  }


  export type Sub_centreAvgAggregateInputType = {
    id?: true
    facility_id?: true
  }

  export type Sub_centreSumAggregateInputType = {
    id?: true
    facility_id?: true
  }

  export type Sub_centreMinAggregateInputType = {
    id?: true
    name?: true
    facility_id?: true
    created_at?: true
    updated_at?: true
    facility_code?: true
    nin?: true
  }

  export type Sub_centreMaxAggregateInputType = {
    id?: true
    name?: true
    facility_id?: true
    created_at?: true
    updated_at?: true
    facility_code?: true
    nin?: true
  }

  export type Sub_centreCountAggregateInputType = {
    id?: true
    name?: true
    facility_id?: true
    created_at?: true
    updated_at?: true
    facility_code?: true
    nin?: true
    _all?: true
  }

  export type Sub_centreAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which sub_centre to aggregate.
     */
    where?: sub_centreWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of sub_centres to fetch.
     */
    orderBy?: sub_centreOrderByWithRelationInput | sub_centreOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: sub_centreWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` sub_centres from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` sub_centres.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned sub_centres
    **/
    _count?: true | Sub_centreCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: Sub_centreAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: Sub_centreSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: Sub_centreMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: Sub_centreMaxAggregateInputType
  }

  export type GetSub_centreAggregateType<T extends Sub_centreAggregateArgs> = {
        [P in keyof T & keyof AggregateSub_centre]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSub_centre[P]>
      : GetScalarType<T[P], AggregateSub_centre[P]>
  }




  export type sub_centreGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: sub_centreWhereInput
    orderBy?: sub_centreOrderByWithAggregationInput | sub_centreOrderByWithAggregationInput[]
    by: Sub_centreScalarFieldEnum[] | Sub_centreScalarFieldEnum
    having?: sub_centreScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: Sub_centreCountAggregateInputType | true
    _avg?: Sub_centreAvgAggregateInputType
    _sum?: Sub_centreSumAggregateInputType
    _min?: Sub_centreMinAggregateInputType
    _max?: Sub_centreMaxAggregateInputType
  }

  export type Sub_centreGroupByOutputType = {
    id: number
    name: string
    facility_id: number
    created_at: Date
    updated_at: Date
    facility_code: string | null
    nin: string | null
    _count: Sub_centreCountAggregateOutputType | null
    _avg: Sub_centreAvgAggregateOutputType | null
    _sum: Sub_centreSumAggregateOutputType | null
    _min: Sub_centreMinAggregateOutputType | null
    _max: Sub_centreMaxAggregateOutputType | null
  }

  type GetSub_centreGroupByPayload<T extends sub_centreGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<Sub_centreGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof Sub_centreGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], Sub_centreGroupByOutputType[P]>
            : GetScalarType<T[P], Sub_centreGroupByOutputType[P]>
        }
      >
    >


  export type sub_centreSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    facility_id?: boolean
    created_at?: boolean
    updated_at?: boolean
    facility_code?: boolean
    nin?: boolean
    monthly_health_data?: boolean | sub_centre$monthly_health_dataArgs<ExtArgs>
    facility?: boolean | FacilityDefaultArgs<ExtArgs>
    _count?: boolean | Sub_centreCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["sub_centre"]>

  export type sub_centreSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    facility_id?: boolean
    created_at?: boolean
    updated_at?: boolean
    facility_code?: boolean
    nin?: boolean
    facility?: boolean | FacilityDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["sub_centre"]>

  export type sub_centreSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    facility_id?: boolean
    created_at?: boolean
    updated_at?: boolean
    facility_code?: boolean
    nin?: boolean
    facility?: boolean | FacilityDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["sub_centre"]>

  export type sub_centreSelectScalar = {
    id?: boolean
    name?: boolean
    facility_id?: boolean
    created_at?: boolean
    updated_at?: boolean
    facility_code?: boolean
    nin?: boolean
  }

  export type sub_centreOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "facility_id" | "created_at" | "updated_at" | "facility_code" | "nin", ExtArgs["result"]["sub_centre"]>
  export type sub_centreInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    monthly_health_data?: boolean | sub_centre$monthly_health_dataArgs<ExtArgs>
    facility?: boolean | FacilityDefaultArgs<ExtArgs>
    _count?: boolean | Sub_centreCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type sub_centreIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    facility?: boolean | FacilityDefaultArgs<ExtArgs>
  }
  export type sub_centreIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    facility?: boolean | FacilityDefaultArgs<ExtArgs>
  }

  export type $sub_centrePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "sub_centre"
    objects: {
      monthly_health_data: Prisma.$MonthlyHealthDataPayload<ExtArgs>[]
      facility: Prisma.$FacilityPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      name: string
      facility_id: number
      created_at: Date
      updated_at: Date
      facility_code: string | null
      nin: string | null
    }, ExtArgs["result"]["sub_centre"]>
    composites: {}
  }

  type sub_centreGetPayload<S extends boolean | null | undefined | sub_centreDefaultArgs> = $Result.GetResult<Prisma.$sub_centrePayload, S>

  type sub_centreCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<sub_centreFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: Sub_centreCountAggregateInputType | true
    }

  export interface sub_centreDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['sub_centre'], meta: { name: 'sub_centre' } }
    /**
     * Find zero or one Sub_centre that matches the filter.
     * @param {sub_centreFindUniqueArgs} args - Arguments to find a Sub_centre
     * @example
     * // Get one Sub_centre
     * const sub_centre = await prisma.sub_centre.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends sub_centreFindUniqueArgs>(args: SelectSubset<T, sub_centreFindUniqueArgs<ExtArgs>>): Prisma__sub_centreClient<$Result.GetResult<Prisma.$sub_centrePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Sub_centre that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {sub_centreFindUniqueOrThrowArgs} args - Arguments to find a Sub_centre
     * @example
     * // Get one Sub_centre
     * const sub_centre = await prisma.sub_centre.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends sub_centreFindUniqueOrThrowArgs>(args: SelectSubset<T, sub_centreFindUniqueOrThrowArgs<ExtArgs>>): Prisma__sub_centreClient<$Result.GetResult<Prisma.$sub_centrePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Sub_centre that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {sub_centreFindFirstArgs} args - Arguments to find a Sub_centre
     * @example
     * // Get one Sub_centre
     * const sub_centre = await prisma.sub_centre.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends sub_centreFindFirstArgs>(args?: SelectSubset<T, sub_centreFindFirstArgs<ExtArgs>>): Prisma__sub_centreClient<$Result.GetResult<Prisma.$sub_centrePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Sub_centre that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {sub_centreFindFirstOrThrowArgs} args - Arguments to find a Sub_centre
     * @example
     * // Get one Sub_centre
     * const sub_centre = await prisma.sub_centre.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends sub_centreFindFirstOrThrowArgs>(args?: SelectSubset<T, sub_centreFindFirstOrThrowArgs<ExtArgs>>): Prisma__sub_centreClient<$Result.GetResult<Prisma.$sub_centrePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Sub_centres that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {sub_centreFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Sub_centres
     * const sub_centres = await prisma.sub_centre.findMany()
     * 
     * // Get first 10 Sub_centres
     * const sub_centres = await prisma.sub_centre.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const sub_centreWithIdOnly = await prisma.sub_centre.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends sub_centreFindManyArgs>(args?: SelectSubset<T, sub_centreFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$sub_centrePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Sub_centre.
     * @param {sub_centreCreateArgs} args - Arguments to create a Sub_centre.
     * @example
     * // Create one Sub_centre
     * const Sub_centre = await prisma.sub_centre.create({
     *   data: {
     *     // ... data to create a Sub_centre
     *   }
     * })
     * 
     */
    create<T extends sub_centreCreateArgs>(args: SelectSubset<T, sub_centreCreateArgs<ExtArgs>>): Prisma__sub_centreClient<$Result.GetResult<Prisma.$sub_centrePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Sub_centres.
     * @param {sub_centreCreateManyArgs} args - Arguments to create many Sub_centres.
     * @example
     * // Create many Sub_centres
     * const sub_centre = await prisma.sub_centre.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends sub_centreCreateManyArgs>(args?: SelectSubset<T, sub_centreCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Sub_centres and returns the data saved in the database.
     * @param {sub_centreCreateManyAndReturnArgs} args - Arguments to create many Sub_centres.
     * @example
     * // Create many Sub_centres
     * const sub_centre = await prisma.sub_centre.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Sub_centres and only return the `id`
     * const sub_centreWithIdOnly = await prisma.sub_centre.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends sub_centreCreateManyAndReturnArgs>(args?: SelectSubset<T, sub_centreCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$sub_centrePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Sub_centre.
     * @param {sub_centreDeleteArgs} args - Arguments to delete one Sub_centre.
     * @example
     * // Delete one Sub_centre
     * const Sub_centre = await prisma.sub_centre.delete({
     *   where: {
     *     // ... filter to delete one Sub_centre
     *   }
     * })
     * 
     */
    delete<T extends sub_centreDeleteArgs>(args: SelectSubset<T, sub_centreDeleteArgs<ExtArgs>>): Prisma__sub_centreClient<$Result.GetResult<Prisma.$sub_centrePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Sub_centre.
     * @param {sub_centreUpdateArgs} args - Arguments to update one Sub_centre.
     * @example
     * // Update one Sub_centre
     * const sub_centre = await prisma.sub_centre.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends sub_centreUpdateArgs>(args: SelectSubset<T, sub_centreUpdateArgs<ExtArgs>>): Prisma__sub_centreClient<$Result.GetResult<Prisma.$sub_centrePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Sub_centres.
     * @param {sub_centreDeleteManyArgs} args - Arguments to filter Sub_centres to delete.
     * @example
     * // Delete a few Sub_centres
     * const { count } = await prisma.sub_centre.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends sub_centreDeleteManyArgs>(args?: SelectSubset<T, sub_centreDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Sub_centres.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {sub_centreUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Sub_centres
     * const sub_centre = await prisma.sub_centre.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends sub_centreUpdateManyArgs>(args: SelectSubset<T, sub_centreUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Sub_centres and returns the data updated in the database.
     * @param {sub_centreUpdateManyAndReturnArgs} args - Arguments to update many Sub_centres.
     * @example
     * // Update many Sub_centres
     * const sub_centre = await prisma.sub_centre.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Sub_centres and only return the `id`
     * const sub_centreWithIdOnly = await prisma.sub_centre.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends sub_centreUpdateManyAndReturnArgs>(args: SelectSubset<T, sub_centreUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$sub_centrePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Sub_centre.
     * @param {sub_centreUpsertArgs} args - Arguments to update or create a Sub_centre.
     * @example
     * // Update or create a Sub_centre
     * const sub_centre = await prisma.sub_centre.upsert({
     *   create: {
     *     // ... data to create a Sub_centre
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Sub_centre we want to update
     *   }
     * })
     */
    upsert<T extends sub_centreUpsertArgs>(args: SelectSubset<T, sub_centreUpsertArgs<ExtArgs>>): Prisma__sub_centreClient<$Result.GetResult<Prisma.$sub_centrePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Sub_centres.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {sub_centreCountArgs} args - Arguments to filter Sub_centres to count.
     * @example
     * // Count the number of Sub_centres
     * const count = await prisma.sub_centre.count({
     *   where: {
     *     // ... the filter for the Sub_centres we want to count
     *   }
     * })
    **/
    count<T extends sub_centreCountArgs>(
      args?: Subset<T, sub_centreCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], Sub_centreCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Sub_centre.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Sub_centreAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends Sub_centreAggregateArgs>(args: Subset<T, Sub_centreAggregateArgs>): Prisma.PrismaPromise<GetSub_centreAggregateType<T>>

    /**
     * Group by Sub_centre.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {sub_centreGroupByArgs} args - Group by arguments.
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
      T extends sub_centreGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: sub_centreGroupByArgs['orderBy'] }
        : { orderBy?: sub_centreGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, sub_centreGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSub_centreGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the sub_centre model
   */
  readonly fields: sub_centreFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for sub_centre.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__sub_centreClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    monthly_health_data<T extends sub_centre$monthly_health_dataArgs<ExtArgs> = {}>(args?: Subset<T, sub_centre$monthly_health_dataArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MonthlyHealthDataPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    facility<T extends FacilityDefaultArgs<ExtArgs> = {}>(args?: Subset<T, FacilityDefaultArgs<ExtArgs>>): Prisma__FacilityClient<$Result.GetResult<Prisma.$FacilityPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the sub_centre model
   */
  interface sub_centreFieldRefs {
    readonly id: FieldRef<"sub_centre", 'Int'>
    readonly name: FieldRef<"sub_centre", 'String'>
    readonly facility_id: FieldRef<"sub_centre", 'Int'>
    readonly created_at: FieldRef<"sub_centre", 'DateTime'>
    readonly updated_at: FieldRef<"sub_centre", 'DateTime'>
    readonly facility_code: FieldRef<"sub_centre", 'String'>
    readonly nin: FieldRef<"sub_centre", 'String'>
  }
    

  // Custom InputTypes
  /**
   * sub_centre findUnique
   */
  export type sub_centreFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the sub_centre
     */
    select?: sub_centreSelect<ExtArgs> | null
    /**
     * Omit specific fields from the sub_centre
     */
    omit?: sub_centreOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: sub_centreInclude<ExtArgs> | null
    /**
     * Filter, which sub_centre to fetch.
     */
    where: sub_centreWhereUniqueInput
  }

  /**
   * sub_centre findUniqueOrThrow
   */
  export type sub_centreFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the sub_centre
     */
    select?: sub_centreSelect<ExtArgs> | null
    /**
     * Omit specific fields from the sub_centre
     */
    omit?: sub_centreOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: sub_centreInclude<ExtArgs> | null
    /**
     * Filter, which sub_centre to fetch.
     */
    where: sub_centreWhereUniqueInput
  }

  /**
   * sub_centre findFirst
   */
  export type sub_centreFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the sub_centre
     */
    select?: sub_centreSelect<ExtArgs> | null
    /**
     * Omit specific fields from the sub_centre
     */
    omit?: sub_centreOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: sub_centreInclude<ExtArgs> | null
    /**
     * Filter, which sub_centre to fetch.
     */
    where?: sub_centreWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of sub_centres to fetch.
     */
    orderBy?: sub_centreOrderByWithRelationInput | sub_centreOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for sub_centres.
     */
    cursor?: sub_centreWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` sub_centres from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` sub_centres.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of sub_centres.
     */
    distinct?: Sub_centreScalarFieldEnum | Sub_centreScalarFieldEnum[]
  }

  /**
   * sub_centre findFirstOrThrow
   */
  export type sub_centreFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the sub_centre
     */
    select?: sub_centreSelect<ExtArgs> | null
    /**
     * Omit specific fields from the sub_centre
     */
    omit?: sub_centreOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: sub_centreInclude<ExtArgs> | null
    /**
     * Filter, which sub_centre to fetch.
     */
    where?: sub_centreWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of sub_centres to fetch.
     */
    orderBy?: sub_centreOrderByWithRelationInput | sub_centreOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for sub_centres.
     */
    cursor?: sub_centreWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` sub_centres from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` sub_centres.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of sub_centres.
     */
    distinct?: Sub_centreScalarFieldEnum | Sub_centreScalarFieldEnum[]
  }

  /**
   * sub_centre findMany
   */
  export type sub_centreFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the sub_centre
     */
    select?: sub_centreSelect<ExtArgs> | null
    /**
     * Omit specific fields from the sub_centre
     */
    omit?: sub_centreOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: sub_centreInclude<ExtArgs> | null
    /**
     * Filter, which sub_centres to fetch.
     */
    where?: sub_centreWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of sub_centres to fetch.
     */
    orderBy?: sub_centreOrderByWithRelationInput | sub_centreOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing sub_centres.
     */
    cursor?: sub_centreWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` sub_centres from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` sub_centres.
     */
    skip?: number
    distinct?: Sub_centreScalarFieldEnum | Sub_centreScalarFieldEnum[]
  }

  /**
   * sub_centre create
   */
  export type sub_centreCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the sub_centre
     */
    select?: sub_centreSelect<ExtArgs> | null
    /**
     * Omit specific fields from the sub_centre
     */
    omit?: sub_centreOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: sub_centreInclude<ExtArgs> | null
    /**
     * The data needed to create a sub_centre.
     */
    data: XOR<sub_centreCreateInput, sub_centreUncheckedCreateInput>
  }

  /**
   * sub_centre createMany
   */
  export type sub_centreCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many sub_centres.
     */
    data: sub_centreCreateManyInput | sub_centreCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * sub_centre createManyAndReturn
   */
  export type sub_centreCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the sub_centre
     */
    select?: sub_centreSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the sub_centre
     */
    omit?: sub_centreOmit<ExtArgs> | null
    /**
     * The data used to create many sub_centres.
     */
    data: sub_centreCreateManyInput | sub_centreCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: sub_centreIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * sub_centre update
   */
  export type sub_centreUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the sub_centre
     */
    select?: sub_centreSelect<ExtArgs> | null
    /**
     * Omit specific fields from the sub_centre
     */
    omit?: sub_centreOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: sub_centreInclude<ExtArgs> | null
    /**
     * The data needed to update a sub_centre.
     */
    data: XOR<sub_centreUpdateInput, sub_centreUncheckedUpdateInput>
    /**
     * Choose, which sub_centre to update.
     */
    where: sub_centreWhereUniqueInput
  }

  /**
   * sub_centre updateMany
   */
  export type sub_centreUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update sub_centres.
     */
    data: XOR<sub_centreUpdateManyMutationInput, sub_centreUncheckedUpdateManyInput>
    /**
     * Filter which sub_centres to update
     */
    where?: sub_centreWhereInput
    /**
     * Limit how many sub_centres to update.
     */
    limit?: number
  }

  /**
   * sub_centre updateManyAndReturn
   */
  export type sub_centreUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the sub_centre
     */
    select?: sub_centreSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the sub_centre
     */
    omit?: sub_centreOmit<ExtArgs> | null
    /**
     * The data used to update sub_centres.
     */
    data: XOR<sub_centreUpdateManyMutationInput, sub_centreUncheckedUpdateManyInput>
    /**
     * Filter which sub_centres to update
     */
    where?: sub_centreWhereInput
    /**
     * Limit how many sub_centres to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: sub_centreIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * sub_centre upsert
   */
  export type sub_centreUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the sub_centre
     */
    select?: sub_centreSelect<ExtArgs> | null
    /**
     * Omit specific fields from the sub_centre
     */
    omit?: sub_centreOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: sub_centreInclude<ExtArgs> | null
    /**
     * The filter to search for the sub_centre to update in case it exists.
     */
    where: sub_centreWhereUniqueInput
    /**
     * In case the sub_centre found by the `where` argument doesn't exist, create a new sub_centre with this data.
     */
    create: XOR<sub_centreCreateInput, sub_centreUncheckedCreateInput>
    /**
     * In case the sub_centre was found with the provided `where` argument, update it with this data.
     */
    update: XOR<sub_centreUpdateInput, sub_centreUncheckedUpdateInput>
  }

  /**
   * sub_centre delete
   */
  export type sub_centreDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the sub_centre
     */
    select?: sub_centreSelect<ExtArgs> | null
    /**
     * Omit specific fields from the sub_centre
     */
    omit?: sub_centreOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: sub_centreInclude<ExtArgs> | null
    /**
     * Filter which sub_centre to delete.
     */
    where: sub_centreWhereUniqueInput
  }

  /**
   * sub_centre deleteMany
   */
  export type sub_centreDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which sub_centres to delete
     */
    where?: sub_centreWhereInput
    /**
     * Limit how many sub_centres to delete.
     */
    limit?: number
  }

  /**
   * sub_centre.monthly_health_data
   */
  export type sub_centre$monthly_health_dataArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MonthlyHealthData
     */
    select?: MonthlyHealthDataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MonthlyHealthData
     */
    omit?: MonthlyHealthDataOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MonthlyHealthDataInclude<ExtArgs> | null
    where?: MonthlyHealthDataWhereInput
    orderBy?: MonthlyHealthDataOrderByWithRelationInput | MonthlyHealthDataOrderByWithRelationInput[]
    cursor?: MonthlyHealthDataWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MonthlyHealthDataScalarFieldEnum | MonthlyHealthDataScalarFieldEnum[]
  }

  /**
   * sub_centre without action
   */
  export type sub_centreDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the sub_centre
     */
    select?: sub_centreSelect<ExtArgs> | null
    /**
     * Omit specific fields from the sub_centre
     */
    omit?: sub_centreOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: sub_centreInclude<ExtArgs> | null
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


  export const UserScalarFieldEnum: {
    id: 'id',
    username: 'username',
    password_hash: 'password_hash',
    role: 'role',
    is_active: 'is_active',
    last_login: 'last_login',
    created_at: 'created_at'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const DistrictScalarFieldEnum: {
    id: 'id',
    name: 'name',
    created_at: 'created_at',
    updated_at: 'updated_at'
  };

  export type DistrictScalarFieldEnum = (typeof DistrictScalarFieldEnum)[keyof typeof DistrictScalarFieldEnum]


  export const FacilityTypeScalarFieldEnum: {
    id: 'id',
    name: 'name',
    created_at: 'created_at',
    updated_at: 'updated_at'
  };

  export type FacilityTypeScalarFieldEnum = (typeof FacilityTypeScalarFieldEnum)[keyof typeof FacilityTypeScalarFieldEnum]


  export const FacilityScalarFieldEnum: {
    id: 'id',
    name: 'name',
    district_id: 'district_id',
    facility_type_id: 'facility_type_id',
    created_at: 'created_at',
    updated_at: 'updated_at',
    facility_code: 'facility_code',
    nin: 'nin'
  };

  export type FacilityScalarFieldEnum = (typeof FacilityScalarFieldEnum)[keyof typeof FacilityScalarFieldEnum]


  export const MonthlyHealthDataScalarFieldEnum: {
    id: 'id',
    facility_id: 'facility_id',
    sub_centre_id: 'sub_centre_id',
    district_id: 'district_id',
    indicator_id: 'indicator_id',
    report_month: 'report_month',
    value: 'value',
    data_quality: 'data_quality',
    remarks: 'remarks',
    uploaded_by: 'uploaded_by',
    approved_by: 'approved_by',
    approved_at: 'approved_at',
    created_at: 'created_at',
    updated_at: 'updated_at',
    achievement: 'achievement',
    denominator: 'denominator',
    numerator: 'numerator',
    target_value: 'target_value'
  };

  export type MonthlyHealthDataScalarFieldEnum = (typeof MonthlyHealthDataScalarFieldEnum)[keyof typeof MonthlyHealthDataScalarFieldEnum]


  export const DataUploadSessionScalarFieldEnum: {
    id: 'id',
    file_name: 'file_name',
    file_path: 'file_path',
    report_month: 'report_month',
    total_records: 'total_records',
    success_count: 'success_count',
    error_count: 'error_count',
    status: 'status',
    upload_summary: 'upload_summary',
    uploaded_by: 'uploaded_by',
    created_at: 'created_at',
    completed_at: 'completed_at'
  };

  export type DataUploadSessionScalarFieldEnum = (typeof DataUploadSessionScalarFieldEnum)[keyof typeof DataUploadSessionScalarFieldEnum]


  export const FormulaScalarFieldEnum: {
    id: 'id',
    name: 'name',
    description: 'description',
    structure: 'structure',
    created_at: 'created_at',
    updated_at: 'updated_at'
  };

  export type FormulaScalarFieldEnum = (typeof FormulaScalarFieldEnum)[keyof typeof FormulaScalarFieldEnum]


  export const IndicatorScalarFieldEnum: {
    id: 'id',
    code: 'code',
    name: 'name',
    description: 'description',
    type: 'type',
    structure: 'structure',
    created_at: 'created_at',
    updated_at: 'updated_at'
  };

  export type IndicatorScalarFieldEnum = (typeof IndicatorScalarFieldEnum)[keyof typeof IndicatorScalarFieldEnum]


  export const FieldScalarFieldEnum: {
    id: 'id',
    code: 'code',
    name: 'name',
    description: 'description',
    created_at: 'created_at',
    updated_at: 'updated_at'
  };

  export type FieldScalarFieldEnum = (typeof FieldScalarFieldEnum)[keyof typeof FieldScalarFieldEnum]


  export const Sub_centreScalarFieldEnum: {
    id: 'id',
    name: 'name',
    facility_id: 'facility_id',
    created_at: 'created_at',
    updated_at: 'updated_at',
    facility_code: 'facility_code',
    nin: 'nin'
  };

  export type Sub_centreScalarFieldEnum = (typeof Sub_centreScalarFieldEnum)[keyof typeof Sub_centreScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


  export const JsonNullValueInput: {
    JsonNull: typeof JsonNull
  };

  export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'UserRole'
   */
  export type EnumUserRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'UserRole'>
    


  /**
   * Reference to a field of type 'UserRole[]'
   */
  export type ListEnumUserRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'UserRole[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Decimal'
   */
  export type DecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal'>
    


  /**
   * Reference to a field of type 'Decimal[]'
   */
  export type ListDecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal[]'>
    


  /**
   * Reference to a field of type 'DataQuality'
   */
  export type EnumDataQualityFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DataQuality'>
    


  /**
   * Reference to a field of type 'DataQuality[]'
   */
  export type ListEnumDataQualityFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DataQuality[]'>
    


  /**
   * Reference to a field of type 'UploadStatus'
   */
  export type EnumUploadStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'UploadStatus'>
    


  /**
   * Reference to a field of type 'UploadStatus[]'
   */
  export type ListEnumUploadStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'UploadStatus[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: IntFilter<"User"> | number
    username?: StringFilter<"User"> | string
    password_hash?: StringFilter<"User"> | string
    role?: EnumUserRoleFilter<"User"> | $Enums.UserRole
    is_active?: BoolNullableFilter<"User"> | boolean | null
    last_login?: DateTimeNullableFilter<"User"> | Date | string | null
    created_at?: DateTimeNullableFilter<"User"> | Date | string | null
    upload_sessions?: DataUploadSessionListRelationFilter
    approved_data?: MonthlyHealthDataListRelationFilter
    uploaded_data?: MonthlyHealthDataListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    username?: SortOrder
    password_hash?: SortOrder
    role?: SortOrder
    is_active?: SortOrderInput | SortOrder
    last_login?: SortOrderInput | SortOrder
    created_at?: SortOrderInput | SortOrder
    upload_sessions?: DataUploadSessionOrderByRelationAggregateInput
    approved_data?: MonthlyHealthDataOrderByRelationAggregateInput
    uploaded_data?: MonthlyHealthDataOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    username?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    password_hash?: StringFilter<"User"> | string
    role?: EnumUserRoleFilter<"User"> | $Enums.UserRole
    is_active?: BoolNullableFilter<"User"> | boolean | null
    last_login?: DateTimeNullableFilter<"User"> | Date | string | null
    created_at?: DateTimeNullableFilter<"User"> | Date | string | null
    upload_sessions?: DataUploadSessionListRelationFilter
    approved_data?: MonthlyHealthDataListRelationFilter
    uploaded_data?: MonthlyHealthDataListRelationFilter
  }, "id" | "username">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    username?: SortOrder
    password_hash?: SortOrder
    role?: SortOrder
    is_active?: SortOrderInput | SortOrder
    last_login?: SortOrderInput | SortOrder
    created_at?: SortOrderInput | SortOrder
    _count?: UserCountOrderByAggregateInput
    _avg?: UserAvgOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
    _sum?: UserSumOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"User"> | number
    username?: StringWithAggregatesFilter<"User"> | string
    password_hash?: StringWithAggregatesFilter<"User"> | string
    role?: EnumUserRoleWithAggregatesFilter<"User"> | $Enums.UserRole
    is_active?: BoolNullableWithAggregatesFilter<"User"> | boolean | null
    last_login?: DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null
    created_at?: DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null
  }

  export type DistrictWhereInput = {
    AND?: DistrictWhereInput | DistrictWhereInput[]
    OR?: DistrictWhereInput[]
    NOT?: DistrictWhereInput | DistrictWhereInput[]
    id?: IntFilter<"District"> | number
    name?: StringFilter<"District"> | string
    created_at?: DateTimeFilter<"District"> | Date | string
    updated_at?: DateTimeFilter<"District"> | Date | string
    facilities?: FacilityListRelationFilter
    monthly_data?: MonthlyHealthDataListRelationFilter
  }

  export type DistrictOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    facilities?: FacilityOrderByRelationAggregateInput
    monthly_data?: MonthlyHealthDataOrderByRelationAggregateInput
  }

  export type DistrictWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    name?: string
    AND?: DistrictWhereInput | DistrictWhereInput[]
    OR?: DistrictWhereInput[]
    NOT?: DistrictWhereInput | DistrictWhereInput[]
    created_at?: DateTimeFilter<"District"> | Date | string
    updated_at?: DateTimeFilter<"District"> | Date | string
    facilities?: FacilityListRelationFilter
    monthly_data?: MonthlyHealthDataListRelationFilter
  }, "id" | "name">

  export type DistrictOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    _count?: DistrictCountOrderByAggregateInput
    _avg?: DistrictAvgOrderByAggregateInput
    _max?: DistrictMaxOrderByAggregateInput
    _min?: DistrictMinOrderByAggregateInput
    _sum?: DistrictSumOrderByAggregateInput
  }

  export type DistrictScalarWhereWithAggregatesInput = {
    AND?: DistrictScalarWhereWithAggregatesInput | DistrictScalarWhereWithAggregatesInput[]
    OR?: DistrictScalarWhereWithAggregatesInput[]
    NOT?: DistrictScalarWhereWithAggregatesInput | DistrictScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"District"> | number
    name?: StringWithAggregatesFilter<"District"> | string
    created_at?: DateTimeWithAggregatesFilter<"District"> | Date | string
    updated_at?: DateTimeWithAggregatesFilter<"District"> | Date | string
  }

  export type FacilityTypeWhereInput = {
    AND?: FacilityTypeWhereInput | FacilityTypeWhereInput[]
    OR?: FacilityTypeWhereInput[]
    NOT?: FacilityTypeWhereInput | FacilityTypeWhereInput[]
    id?: IntFilter<"FacilityType"> | number
    name?: StringFilter<"FacilityType"> | string
    created_at?: DateTimeFilter<"FacilityType"> | Date | string
    updated_at?: DateTimeFilter<"FacilityType"> | Date | string
    facilities?: FacilityListRelationFilter
  }

  export type FacilityTypeOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    facilities?: FacilityOrderByRelationAggregateInput
  }

  export type FacilityTypeWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    name?: string
    AND?: FacilityTypeWhereInput | FacilityTypeWhereInput[]
    OR?: FacilityTypeWhereInput[]
    NOT?: FacilityTypeWhereInput | FacilityTypeWhereInput[]
    created_at?: DateTimeFilter<"FacilityType"> | Date | string
    updated_at?: DateTimeFilter<"FacilityType"> | Date | string
    facilities?: FacilityListRelationFilter
  }, "id" | "name">

  export type FacilityTypeOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    _count?: FacilityTypeCountOrderByAggregateInput
    _avg?: FacilityTypeAvgOrderByAggregateInput
    _max?: FacilityTypeMaxOrderByAggregateInput
    _min?: FacilityTypeMinOrderByAggregateInput
    _sum?: FacilityTypeSumOrderByAggregateInput
  }

  export type FacilityTypeScalarWhereWithAggregatesInput = {
    AND?: FacilityTypeScalarWhereWithAggregatesInput | FacilityTypeScalarWhereWithAggregatesInput[]
    OR?: FacilityTypeScalarWhereWithAggregatesInput[]
    NOT?: FacilityTypeScalarWhereWithAggregatesInput | FacilityTypeScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"FacilityType"> | number
    name?: StringWithAggregatesFilter<"FacilityType"> | string
    created_at?: DateTimeWithAggregatesFilter<"FacilityType"> | Date | string
    updated_at?: DateTimeWithAggregatesFilter<"FacilityType"> | Date | string
  }

  export type FacilityWhereInput = {
    AND?: FacilityWhereInput | FacilityWhereInput[]
    OR?: FacilityWhereInput[]
    NOT?: FacilityWhereInput | FacilityWhereInput[]
    id?: IntFilter<"Facility"> | number
    name?: StringFilter<"Facility"> | string
    district_id?: IntFilter<"Facility"> | number
    facility_type_id?: IntFilter<"Facility"> | number
    created_at?: DateTimeFilter<"Facility"> | Date | string
    updated_at?: DateTimeFilter<"Facility"> | Date | string
    facility_code?: StringNullableFilter<"Facility"> | string | null
    nin?: StringNullableFilter<"Facility"> | string | null
    district?: XOR<DistrictScalarRelationFilter, DistrictWhereInput>
    facility_type?: XOR<FacilityTypeScalarRelationFilter, FacilityTypeWhereInput>
    monthly_data?: MonthlyHealthDataListRelationFilter
    sub_centre?: Sub_centreListRelationFilter
  }

  export type FacilityOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    district_id?: SortOrder
    facility_type_id?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    facility_code?: SortOrderInput | SortOrder
    nin?: SortOrderInput | SortOrder
    district?: DistrictOrderByWithRelationInput
    facility_type?: FacilityTypeOrderByWithRelationInput
    monthly_data?: MonthlyHealthDataOrderByRelationAggregateInput
    sub_centre?: sub_centreOrderByRelationAggregateInput
  }

  export type FacilityWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    facility_code?: string
    nin?: string
    AND?: FacilityWhereInput | FacilityWhereInput[]
    OR?: FacilityWhereInput[]
    NOT?: FacilityWhereInput | FacilityWhereInput[]
    name?: StringFilter<"Facility"> | string
    district_id?: IntFilter<"Facility"> | number
    facility_type_id?: IntFilter<"Facility"> | number
    created_at?: DateTimeFilter<"Facility"> | Date | string
    updated_at?: DateTimeFilter<"Facility"> | Date | string
    district?: XOR<DistrictScalarRelationFilter, DistrictWhereInput>
    facility_type?: XOR<FacilityTypeScalarRelationFilter, FacilityTypeWhereInput>
    monthly_data?: MonthlyHealthDataListRelationFilter
    sub_centre?: Sub_centreListRelationFilter
  }, "id" | "facility_code" | "nin">

  export type FacilityOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    district_id?: SortOrder
    facility_type_id?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    facility_code?: SortOrderInput | SortOrder
    nin?: SortOrderInput | SortOrder
    _count?: FacilityCountOrderByAggregateInput
    _avg?: FacilityAvgOrderByAggregateInput
    _max?: FacilityMaxOrderByAggregateInput
    _min?: FacilityMinOrderByAggregateInput
    _sum?: FacilitySumOrderByAggregateInput
  }

  export type FacilityScalarWhereWithAggregatesInput = {
    AND?: FacilityScalarWhereWithAggregatesInput | FacilityScalarWhereWithAggregatesInput[]
    OR?: FacilityScalarWhereWithAggregatesInput[]
    NOT?: FacilityScalarWhereWithAggregatesInput | FacilityScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Facility"> | number
    name?: StringWithAggregatesFilter<"Facility"> | string
    district_id?: IntWithAggregatesFilter<"Facility"> | number
    facility_type_id?: IntWithAggregatesFilter<"Facility"> | number
    created_at?: DateTimeWithAggregatesFilter<"Facility"> | Date | string
    updated_at?: DateTimeWithAggregatesFilter<"Facility"> | Date | string
    facility_code?: StringNullableWithAggregatesFilter<"Facility"> | string | null
    nin?: StringNullableWithAggregatesFilter<"Facility"> | string | null
  }

  export type MonthlyHealthDataWhereInput = {
    AND?: MonthlyHealthDataWhereInput | MonthlyHealthDataWhereInput[]
    OR?: MonthlyHealthDataWhereInput[]
    NOT?: MonthlyHealthDataWhereInput | MonthlyHealthDataWhereInput[]
    id?: IntFilter<"MonthlyHealthData"> | number
    facility_id?: IntNullableFilter<"MonthlyHealthData"> | number | null
    sub_centre_id?: IntNullableFilter<"MonthlyHealthData"> | number | null
    district_id?: IntFilter<"MonthlyHealthData"> | number
    indicator_id?: IntNullableFilter<"MonthlyHealthData"> | number | null
    report_month?: StringFilter<"MonthlyHealthData"> | string
    value?: DecimalNullableFilter<"MonthlyHealthData"> | Decimal | DecimalJsLike | number | string | null
    data_quality?: EnumDataQualityFilter<"MonthlyHealthData"> | $Enums.DataQuality
    remarks?: StringNullableFilter<"MonthlyHealthData"> | string | null
    uploaded_by?: IntFilter<"MonthlyHealthData"> | number
    approved_by?: IntNullableFilter<"MonthlyHealthData"> | number | null
    approved_at?: DateTimeNullableFilter<"MonthlyHealthData"> | Date | string | null
    created_at?: DateTimeFilter<"MonthlyHealthData"> | Date | string
    updated_at?: DateTimeFilter<"MonthlyHealthData"> | Date | string
    achievement?: DecimalNullableFilter<"MonthlyHealthData"> | Decimal | DecimalJsLike | number | string | null
    denominator?: DecimalNullableFilter<"MonthlyHealthData"> | Decimal | DecimalJsLike | number | string | null
    numerator?: DecimalNullableFilter<"MonthlyHealthData"> | Decimal | DecimalJsLike | number | string | null
    target_value?: DecimalNullableFilter<"MonthlyHealthData"> | Decimal | DecimalJsLike | number | string | null
    approver?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
    district?: XOR<DistrictScalarRelationFilter, DistrictWhereInput>
    facility?: XOR<FacilityNullableScalarRelationFilter, FacilityWhereInput> | null
    sub_centre?: XOR<Sub_centreNullableScalarRelationFilter, sub_centreWhereInput> | null
    indicator?: XOR<IndicatorNullableScalarRelationFilter, IndicatorWhereInput> | null
    uploader?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type MonthlyHealthDataOrderByWithRelationInput = {
    id?: SortOrder
    facility_id?: SortOrderInput | SortOrder
    sub_centre_id?: SortOrderInput | SortOrder
    district_id?: SortOrder
    indicator_id?: SortOrderInput | SortOrder
    report_month?: SortOrder
    value?: SortOrderInput | SortOrder
    data_quality?: SortOrder
    remarks?: SortOrderInput | SortOrder
    uploaded_by?: SortOrder
    approved_by?: SortOrderInput | SortOrder
    approved_at?: SortOrderInput | SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    achievement?: SortOrderInput | SortOrder
    denominator?: SortOrderInput | SortOrder
    numerator?: SortOrderInput | SortOrder
    target_value?: SortOrderInput | SortOrder
    approver?: UserOrderByWithRelationInput
    district?: DistrictOrderByWithRelationInput
    facility?: FacilityOrderByWithRelationInput
    sub_centre?: sub_centreOrderByWithRelationInput
    indicator?: IndicatorOrderByWithRelationInput
    uploader?: UserOrderByWithRelationInput
  }

  export type MonthlyHealthDataWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    facility_id_sub_centre_id_indicator_id_report_month?: MonthlyHealthDataFacility_idSub_centre_idIndicator_idReport_monthCompoundUniqueInput
    AND?: MonthlyHealthDataWhereInput | MonthlyHealthDataWhereInput[]
    OR?: MonthlyHealthDataWhereInput[]
    NOT?: MonthlyHealthDataWhereInput | MonthlyHealthDataWhereInput[]
    facility_id?: IntNullableFilter<"MonthlyHealthData"> | number | null
    sub_centre_id?: IntNullableFilter<"MonthlyHealthData"> | number | null
    district_id?: IntFilter<"MonthlyHealthData"> | number
    indicator_id?: IntNullableFilter<"MonthlyHealthData"> | number | null
    report_month?: StringFilter<"MonthlyHealthData"> | string
    value?: DecimalNullableFilter<"MonthlyHealthData"> | Decimal | DecimalJsLike | number | string | null
    data_quality?: EnumDataQualityFilter<"MonthlyHealthData"> | $Enums.DataQuality
    remarks?: StringNullableFilter<"MonthlyHealthData"> | string | null
    uploaded_by?: IntFilter<"MonthlyHealthData"> | number
    approved_by?: IntNullableFilter<"MonthlyHealthData"> | number | null
    approved_at?: DateTimeNullableFilter<"MonthlyHealthData"> | Date | string | null
    created_at?: DateTimeFilter<"MonthlyHealthData"> | Date | string
    updated_at?: DateTimeFilter<"MonthlyHealthData"> | Date | string
    achievement?: DecimalNullableFilter<"MonthlyHealthData"> | Decimal | DecimalJsLike | number | string | null
    denominator?: DecimalNullableFilter<"MonthlyHealthData"> | Decimal | DecimalJsLike | number | string | null
    numerator?: DecimalNullableFilter<"MonthlyHealthData"> | Decimal | DecimalJsLike | number | string | null
    target_value?: DecimalNullableFilter<"MonthlyHealthData"> | Decimal | DecimalJsLike | number | string | null
    approver?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
    district?: XOR<DistrictScalarRelationFilter, DistrictWhereInput>
    facility?: XOR<FacilityNullableScalarRelationFilter, FacilityWhereInput> | null
    sub_centre?: XOR<Sub_centreNullableScalarRelationFilter, sub_centreWhereInput> | null
    indicator?: XOR<IndicatorNullableScalarRelationFilter, IndicatorWhereInput> | null
    uploader?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id" | "facility_id_sub_centre_id_indicator_id_report_month">

  export type MonthlyHealthDataOrderByWithAggregationInput = {
    id?: SortOrder
    facility_id?: SortOrderInput | SortOrder
    sub_centre_id?: SortOrderInput | SortOrder
    district_id?: SortOrder
    indicator_id?: SortOrderInput | SortOrder
    report_month?: SortOrder
    value?: SortOrderInput | SortOrder
    data_quality?: SortOrder
    remarks?: SortOrderInput | SortOrder
    uploaded_by?: SortOrder
    approved_by?: SortOrderInput | SortOrder
    approved_at?: SortOrderInput | SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    achievement?: SortOrderInput | SortOrder
    denominator?: SortOrderInput | SortOrder
    numerator?: SortOrderInput | SortOrder
    target_value?: SortOrderInput | SortOrder
    _count?: MonthlyHealthDataCountOrderByAggregateInput
    _avg?: MonthlyHealthDataAvgOrderByAggregateInput
    _max?: MonthlyHealthDataMaxOrderByAggregateInput
    _min?: MonthlyHealthDataMinOrderByAggregateInput
    _sum?: MonthlyHealthDataSumOrderByAggregateInput
  }

  export type MonthlyHealthDataScalarWhereWithAggregatesInput = {
    AND?: MonthlyHealthDataScalarWhereWithAggregatesInput | MonthlyHealthDataScalarWhereWithAggregatesInput[]
    OR?: MonthlyHealthDataScalarWhereWithAggregatesInput[]
    NOT?: MonthlyHealthDataScalarWhereWithAggregatesInput | MonthlyHealthDataScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"MonthlyHealthData"> | number
    facility_id?: IntNullableWithAggregatesFilter<"MonthlyHealthData"> | number | null
    sub_centre_id?: IntNullableWithAggregatesFilter<"MonthlyHealthData"> | number | null
    district_id?: IntWithAggregatesFilter<"MonthlyHealthData"> | number
    indicator_id?: IntNullableWithAggregatesFilter<"MonthlyHealthData"> | number | null
    report_month?: StringWithAggregatesFilter<"MonthlyHealthData"> | string
    value?: DecimalNullableWithAggregatesFilter<"MonthlyHealthData"> | Decimal | DecimalJsLike | number | string | null
    data_quality?: EnumDataQualityWithAggregatesFilter<"MonthlyHealthData"> | $Enums.DataQuality
    remarks?: StringNullableWithAggregatesFilter<"MonthlyHealthData"> | string | null
    uploaded_by?: IntWithAggregatesFilter<"MonthlyHealthData"> | number
    approved_by?: IntNullableWithAggregatesFilter<"MonthlyHealthData"> | number | null
    approved_at?: DateTimeNullableWithAggregatesFilter<"MonthlyHealthData"> | Date | string | null
    created_at?: DateTimeWithAggregatesFilter<"MonthlyHealthData"> | Date | string
    updated_at?: DateTimeWithAggregatesFilter<"MonthlyHealthData"> | Date | string
    achievement?: DecimalNullableWithAggregatesFilter<"MonthlyHealthData"> | Decimal | DecimalJsLike | number | string | null
    denominator?: DecimalNullableWithAggregatesFilter<"MonthlyHealthData"> | Decimal | DecimalJsLike | number | string | null
    numerator?: DecimalNullableWithAggregatesFilter<"MonthlyHealthData"> | Decimal | DecimalJsLike | number | string | null
    target_value?: DecimalNullableWithAggregatesFilter<"MonthlyHealthData"> | Decimal | DecimalJsLike | number | string | null
  }

  export type DataUploadSessionWhereInput = {
    AND?: DataUploadSessionWhereInput | DataUploadSessionWhereInput[]
    OR?: DataUploadSessionWhereInput[]
    NOT?: DataUploadSessionWhereInput | DataUploadSessionWhereInput[]
    id?: IntFilter<"DataUploadSession"> | number
    file_name?: StringFilter<"DataUploadSession"> | string
    file_path?: StringNullableFilter<"DataUploadSession"> | string | null
    report_month?: StringFilter<"DataUploadSession"> | string
    total_records?: IntFilter<"DataUploadSession"> | number
    success_count?: IntFilter<"DataUploadSession"> | number
    error_count?: IntFilter<"DataUploadSession"> | number
    status?: EnumUploadStatusFilter<"DataUploadSession"> | $Enums.UploadStatus
    upload_summary?: JsonNullableFilter<"DataUploadSession">
    uploaded_by?: IntFilter<"DataUploadSession"> | number
    created_at?: DateTimeFilter<"DataUploadSession"> | Date | string
    completed_at?: DateTimeNullableFilter<"DataUploadSession"> | Date | string | null
    uploader?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type DataUploadSessionOrderByWithRelationInput = {
    id?: SortOrder
    file_name?: SortOrder
    file_path?: SortOrderInput | SortOrder
    report_month?: SortOrder
    total_records?: SortOrder
    success_count?: SortOrder
    error_count?: SortOrder
    status?: SortOrder
    upload_summary?: SortOrderInput | SortOrder
    uploaded_by?: SortOrder
    created_at?: SortOrder
    completed_at?: SortOrderInput | SortOrder
    uploader?: UserOrderByWithRelationInput
  }

  export type DataUploadSessionWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: DataUploadSessionWhereInput | DataUploadSessionWhereInput[]
    OR?: DataUploadSessionWhereInput[]
    NOT?: DataUploadSessionWhereInput | DataUploadSessionWhereInput[]
    file_name?: StringFilter<"DataUploadSession"> | string
    file_path?: StringNullableFilter<"DataUploadSession"> | string | null
    report_month?: StringFilter<"DataUploadSession"> | string
    total_records?: IntFilter<"DataUploadSession"> | number
    success_count?: IntFilter<"DataUploadSession"> | number
    error_count?: IntFilter<"DataUploadSession"> | number
    status?: EnumUploadStatusFilter<"DataUploadSession"> | $Enums.UploadStatus
    upload_summary?: JsonNullableFilter<"DataUploadSession">
    uploaded_by?: IntFilter<"DataUploadSession"> | number
    created_at?: DateTimeFilter<"DataUploadSession"> | Date | string
    completed_at?: DateTimeNullableFilter<"DataUploadSession"> | Date | string | null
    uploader?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id">

  export type DataUploadSessionOrderByWithAggregationInput = {
    id?: SortOrder
    file_name?: SortOrder
    file_path?: SortOrderInput | SortOrder
    report_month?: SortOrder
    total_records?: SortOrder
    success_count?: SortOrder
    error_count?: SortOrder
    status?: SortOrder
    upload_summary?: SortOrderInput | SortOrder
    uploaded_by?: SortOrder
    created_at?: SortOrder
    completed_at?: SortOrderInput | SortOrder
    _count?: DataUploadSessionCountOrderByAggregateInput
    _avg?: DataUploadSessionAvgOrderByAggregateInput
    _max?: DataUploadSessionMaxOrderByAggregateInput
    _min?: DataUploadSessionMinOrderByAggregateInput
    _sum?: DataUploadSessionSumOrderByAggregateInput
  }

  export type DataUploadSessionScalarWhereWithAggregatesInput = {
    AND?: DataUploadSessionScalarWhereWithAggregatesInput | DataUploadSessionScalarWhereWithAggregatesInput[]
    OR?: DataUploadSessionScalarWhereWithAggregatesInput[]
    NOT?: DataUploadSessionScalarWhereWithAggregatesInput | DataUploadSessionScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"DataUploadSession"> | number
    file_name?: StringWithAggregatesFilter<"DataUploadSession"> | string
    file_path?: StringNullableWithAggregatesFilter<"DataUploadSession"> | string | null
    report_month?: StringWithAggregatesFilter<"DataUploadSession"> | string
    total_records?: IntWithAggregatesFilter<"DataUploadSession"> | number
    success_count?: IntWithAggregatesFilter<"DataUploadSession"> | number
    error_count?: IntWithAggregatesFilter<"DataUploadSession"> | number
    status?: EnumUploadStatusWithAggregatesFilter<"DataUploadSession"> | $Enums.UploadStatus
    upload_summary?: JsonNullableWithAggregatesFilter<"DataUploadSession">
    uploaded_by?: IntWithAggregatesFilter<"DataUploadSession"> | number
    created_at?: DateTimeWithAggregatesFilter<"DataUploadSession"> | Date | string
    completed_at?: DateTimeNullableWithAggregatesFilter<"DataUploadSession"> | Date | string | null
  }

  export type FormulaWhereInput = {
    AND?: FormulaWhereInput | FormulaWhereInput[]
    OR?: FormulaWhereInput[]
    NOT?: FormulaWhereInput | FormulaWhereInput[]
    id?: IntFilter<"Formula"> | number
    name?: StringFilter<"Formula"> | string
    description?: StringNullableFilter<"Formula"> | string | null
    structure?: JsonFilter<"Formula">
    created_at?: DateTimeFilter<"Formula"> | Date | string
    updated_at?: DateTimeFilter<"Formula"> | Date | string
  }

  export type FormulaOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    structure?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type FormulaWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    name?: string
    AND?: FormulaWhereInput | FormulaWhereInput[]
    OR?: FormulaWhereInput[]
    NOT?: FormulaWhereInput | FormulaWhereInput[]
    description?: StringNullableFilter<"Formula"> | string | null
    structure?: JsonFilter<"Formula">
    created_at?: DateTimeFilter<"Formula"> | Date | string
    updated_at?: DateTimeFilter<"Formula"> | Date | string
  }, "id" | "name">

  export type FormulaOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    structure?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    _count?: FormulaCountOrderByAggregateInput
    _avg?: FormulaAvgOrderByAggregateInput
    _max?: FormulaMaxOrderByAggregateInput
    _min?: FormulaMinOrderByAggregateInput
    _sum?: FormulaSumOrderByAggregateInput
  }

  export type FormulaScalarWhereWithAggregatesInput = {
    AND?: FormulaScalarWhereWithAggregatesInput | FormulaScalarWhereWithAggregatesInput[]
    OR?: FormulaScalarWhereWithAggregatesInput[]
    NOT?: FormulaScalarWhereWithAggregatesInput | FormulaScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Formula"> | number
    name?: StringWithAggregatesFilter<"Formula"> | string
    description?: StringNullableWithAggregatesFilter<"Formula"> | string | null
    structure?: JsonWithAggregatesFilter<"Formula">
    created_at?: DateTimeWithAggregatesFilter<"Formula"> | Date | string
    updated_at?: DateTimeWithAggregatesFilter<"Formula"> | Date | string
  }

  export type IndicatorWhereInput = {
    AND?: IndicatorWhereInput | IndicatorWhereInput[]
    OR?: IndicatorWhereInput[]
    NOT?: IndicatorWhereInput | IndicatorWhereInput[]
    id?: IntFilter<"Indicator"> | number
    code?: StringFilter<"Indicator"> | string
    name?: StringFilter<"Indicator"> | string
    description?: StringNullableFilter<"Indicator"> | string | null
    type?: StringFilter<"Indicator"> | string
    structure?: JsonNullableFilter<"Indicator">
    created_at?: DateTimeFilter<"Indicator"> | Date | string
    updated_at?: DateTimeFilter<"Indicator"> | Date | string
    monthly_data?: MonthlyHealthDataListRelationFilter
  }

  export type IndicatorOrderByWithRelationInput = {
    id?: SortOrder
    code?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    type?: SortOrder
    structure?: SortOrderInput | SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    monthly_data?: MonthlyHealthDataOrderByRelationAggregateInput
  }

  export type IndicatorWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    code?: string
    AND?: IndicatorWhereInput | IndicatorWhereInput[]
    OR?: IndicatorWhereInput[]
    NOT?: IndicatorWhereInput | IndicatorWhereInput[]
    name?: StringFilter<"Indicator"> | string
    description?: StringNullableFilter<"Indicator"> | string | null
    type?: StringFilter<"Indicator"> | string
    structure?: JsonNullableFilter<"Indicator">
    created_at?: DateTimeFilter<"Indicator"> | Date | string
    updated_at?: DateTimeFilter<"Indicator"> | Date | string
    monthly_data?: MonthlyHealthDataListRelationFilter
  }, "id" | "code">

  export type IndicatorOrderByWithAggregationInput = {
    id?: SortOrder
    code?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    type?: SortOrder
    structure?: SortOrderInput | SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    _count?: IndicatorCountOrderByAggregateInput
    _avg?: IndicatorAvgOrderByAggregateInput
    _max?: IndicatorMaxOrderByAggregateInput
    _min?: IndicatorMinOrderByAggregateInput
    _sum?: IndicatorSumOrderByAggregateInput
  }

  export type IndicatorScalarWhereWithAggregatesInput = {
    AND?: IndicatorScalarWhereWithAggregatesInput | IndicatorScalarWhereWithAggregatesInput[]
    OR?: IndicatorScalarWhereWithAggregatesInput[]
    NOT?: IndicatorScalarWhereWithAggregatesInput | IndicatorScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Indicator"> | number
    code?: StringWithAggregatesFilter<"Indicator"> | string
    name?: StringWithAggregatesFilter<"Indicator"> | string
    description?: StringNullableWithAggregatesFilter<"Indicator"> | string | null
    type?: StringWithAggregatesFilter<"Indicator"> | string
    structure?: JsonNullableWithAggregatesFilter<"Indicator">
    created_at?: DateTimeWithAggregatesFilter<"Indicator"> | Date | string
    updated_at?: DateTimeWithAggregatesFilter<"Indicator"> | Date | string
  }

  export type fieldWhereInput = {
    AND?: fieldWhereInput | fieldWhereInput[]
    OR?: fieldWhereInput[]
    NOT?: fieldWhereInput | fieldWhereInput[]
    id?: IntFilter<"field"> | number
    code?: StringFilter<"field"> | string
    name?: StringFilter<"field"> | string
    description?: StringNullableFilter<"field"> | string | null
    created_at?: DateTimeFilter<"field"> | Date | string
    updated_at?: DateTimeFilter<"field"> | Date | string
  }

  export type fieldOrderByWithRelationInput = {
    id?: SortOrder
    code?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type fieldWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    code?: string
    AND?: fieldWhereInput | fieldWhereInput[]
    OR?: fieldWhereInput[]
    NOT?: fieldWhereInput | fieldWhereInput[]
    name?: StringFilter<"field"> | string
    description?: StringNullableFilter<"field"> | string | null
    created_at?: DateTimeFilter<"field"> | Date | string
    updated_at?: DateTimeFilter<"field"> | Date | string
  }, "id" | "code">

  export type fieldOrderByWithAggregationInput = {
    id?: SortOrder
    code?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    _count?: fieldCountOrderByAggregateInput
    _avg?: fieldAvgOrderByAggregateInput
    _max?: fieldMaxOrderByAggregateInput
    _min?: fieldMinOrderByAggregateInput
    _sum?: fieldSumOrderByAggregateInput
  }

  export type fieldScalarWhereWithAggregatesInput = {
    AND?: fieldScalarWhereWithAggregatesInput | fieldScalarWhereWithAggregatesInput[]
    OR?: fieldScalarWhereWithAggregatesInput[]
    NOT?: fieldScalarWhereWithAggregatesInput | fieldScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"field"> | number
    code?: StringWithAggregatesFilter<"field"> | string
    name?: StringWithAggregatesFilter<"field"> | string
    description?: StringNullableWithAggregatesFilter<"field"> | string | null
    created_at?: DateTimeWithAggregatesFilter<"field"> | Date | string
    updated_at?: DateTimeWithAggregatesFilter<"field"> | Date | string
  }

  export type sub_centreWhereInput = {
    AND?: sub_centreWhereInput | sub_centreWhereInput[]
    OR?: sub_centreWhereInput[]
    NOT?: sub_centreWhereInput | sub_centreWhereInput[]
    id?: IntFilter<"sub_centre"> | number
    name?: StringFilter<"sub_centre"> | string
    facility_id?: IntFilter<"sub_centre"> | number
    created_at?: DateTimeFilter<"sub_centre"> | Date | string
    updated_at?: DateTimeFilter<"sub_centre"> | Date | string
    facility_code?: StringNullableFilter<"sub_centre"> | string | null
    nin?: StringNullableFilter<"sub_centre"> | string | null
    monthly_health_data?: MonthlyHealthDataListRelationFilter
    facility?: XOR<FacilityScalarRelationFilter, FacilityWhereInput>
  }

  export type sub_centreOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    facility_id?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    facility_code?: SortOrderInput | SortOrder
    nin?: SortOrderInput | SortOrder
    monthly_health_data?: MonthlyHealthDataOrderByRelationAggregateInput
    facility?: FacilityOrderByWithRelationInput
  }

  export type sub_centreWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    facility_code?: string
    nin?: string
    AND?: sub_centreWhereInput | sub_centreWhereInput[]
    OR?: sub_centreWhereInput[]
    NOT?: sub_centreWhereInput | sub_centreWhereInput[]
    name?: StringFilter<"sub_centre"> | string
    facility_id?: IntFilter<"sub_centre"> | number
    created_at?: DateTimeFilter<"sub_centre"> | Date | string
    updated_at?: DateTimeFilter<"sub_centre"> | Date | string
    monthly_health_data?: MonthlyHealthDataListRelationFilter
    facility?: XOR<FacilityScalarRelationFilter, FacilityWhereInput>
  }, "id" | "facility_code" | "nin">

  export type sub_centreOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    facility_id?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    facility_code?: SortOrderInput | SortOrder
    nin?: SortOrderInput | SortOrder
    _count?: sub_centreCountOrderByAggregateInput
    _avg?: sub_centreAvgOrderByAggregateInput
    _max?: sub_centreMaxOrderByAggregateInput
    _min?: sub_centreMinOrderByAggregateInput
    _sum?: sub_centreSumOrderByAggregateInput
  }

  export type sub_centreScalarWhereWithAggregatesInput = {
    AND?: sub_centreScalarWhereWithAggregatesInput | sub_centreScalarWhereWithAggregatesInput[]
    OR?: sub_centreScalarWhereWithAggregatesInput[]
    NOT?: sub_centreScalarWhereWithAggregatesInput | sub_centreScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"sub_centre"> | number
    name?: StringWithAggregatesFilter<"sub_centre"> | string
    facility_id?: IntWithAggregatesFilter<"sub_centre"> | number
    created_at?: DateTimeWithAggregatesFilter<"sub_centre"> | Date | string
    updated_at?: DateTimeWithAggregatesFilter<"sub_centre"> | Date | string
    facility_code?: StringNullableWithAggregatesFilter<"sub_centre"> | string | null
    nin?: StringNullableWithAggregatesFilter<"sub_centre"> | string | null
  }

  export type UserCreateInput = {
    username: string
    password_hash: string
    role?: $Enums.UserRole
    is_active?: boolean | null
    last_login?: Date | string | null
    created_at?: Date | string | null
    upload_sessions?: DataUploadSessionCreateNestedManyWithoutUploaderInput
    approved_data?: MonthlyHealthDataCreateNestedManyWithoutApproverInput
    uploaded_data?: MonthlyHealthDataCreateNestedManyWithoutUploaderInput
  }

  export type UserUncheckedCreateInput = {
    id?: number
    username: string
    password_hash: string
    role?: $Enums.UserRole
    is_active?: boolean | null
    last_login?: Date | string | null
    created_at?: Date | string | null
    upload_sessions?: DataUploadSessionUncheckedCreateNestedManyWithoutUploaderInput
    approved_data?: MonthlyHealthDataUncheckedCreateNestedManyWithoutApproverInput
    uploaded_data?: MonthlyHealthDataUncheckedCreateNestedManyWithoutUploaderInput
  }

  export type UserUpdateInput = {
    username?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    is_active?: NullableBoolFieldUpdateOperationsInput | boolean | null
    last_login?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    upload_sessions?: DataUploadSessionUpdateManyWithoutUploaderNestedInput
    approved_data?: MonthlyHealthDataUpdateManyWithoutApproverNestedInput
    uploaded_data?: MonthlyHealthDataUpdateManyWithoutUploaderNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    username?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    is_active?: NullableBoolFieldUpdateOperationsInput | boolean | null
    last_login?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    upload_sessions?: DataUploadSessionUncheckedUpdateManyWithoutUploaderNestedInput
    approved_data?: MonthlyHealthDataUncheckedUpdateManyWithoutApproverNestedInput
    uploaded_data?: MonthlyHealthDataUncheckedUpdateManyWithoutUploaderNestedInput
  }

  export type UserCreateManyInput = {
    id?: number
    username: string
    password_hash: string
    role?: $Enums.UserRole
    is_active?: boolean | null
    last_login?: Date | string | null
    created_at?: Date | string | null
  }

  export type UserUpdateManyMutationInput = {
    username?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    is_active?: NullableBoolFieldUpdateOperationsInput | boolean | null
    last_login?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type UserUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    username?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    is_active?: NullableBoolFieldUpdateOperationsInput | boolean | null
    last_login?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type DistrictCreateInput = {
    name: string
    created_at?: Date | string
    updated_at?: Date | string
    facilities?: FacilityCreateNestedManyWithoutDistrictInput
    monthly_data?: MonthlyHealthDataCreateNestedManyWithoutDistrictInput
  }

  export type DistrictUncheckedCreateInput = {
    id?: number
    name: string
    created_at?: Date | string
    updated_at?: Date | string
    facilities?: FacilityUncheckedCreateNestedManyWithoutDistrictInput
    monthly_data?: MonthlyHealthDataUncheckedCreateNestedManyWithoutDistrictInput
  }

  export type DistrictUpdateInput = {
    name?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    facilities?: FacilityUpdateManyWithoutDistrictNestedInput
    monthly_data?: MonthlyHealthDataUpdateManyWithoutDistrictNestedInput
  }

  export type DistrictUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    facilities?: FacilityUncheckedUpdateManyWithoutDistrictNestedInput
    monthly_data?: MonthlyHealthDataUncheckedUpdateManyWithoutDistrictNestedInput
  }

  export type DistrictCreateManyInput = {
    id?: number
    name: string
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type DistrictUpdateManyMutationInput = {
    name?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DistrictUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FacilityTypeCreateInput = {
    name: string
    created_at?: Date | string
    updated_at?: Date | string
    facilities?: FacilityCreateNestedManyWithoutFacility_typeInput
  }

  export type FacilityTypeUncheckedCreateInput = {
    id?: number
    name: string
    created_at?: Date | string
    updated_at?: Date | string
    facilities?: FacilityUncheckedCreateNestedManyWithoutFacility_typeInput
  }

  export type FacilityTypeUpdateInput = {
    name?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    facilities?: FacilityUpdateManyWithoutFacility_typeNestedInput
  }

  export type FacilityTypeUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    facilities?: FacilityUncheckedUpdateManyWithoutFacility_typeNestedInput
  }

  export type FacilityTypeCreateManyInput = {
    id?: number
    name: string
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type FacilityTypeUpdateManyMutationInput = {
    name?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FacilityTypeUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FacilityCreateInput = {
    name: string
    created_at?: Date | string
    updated_at?: Date | string
    facility_code?: string | null
    nin?: string | null
    district: DistrictCreateNestedOneWithoutFacilitiesInput
    facility_type: FacilityTypeCreateNestedOneWithoutFacilitiesInput
    monthly_data?: MonthlyHealthDataCreateNestedManyWithoutFacilityInput
    sub_centre?: sub_centreCreateNestedManyWithoutFacilityInput
  }

  export type FacilityUncheckedCreateInput = {
    id?: number
    name: string
    district_id: number
    facility_type_id: number
    created_at?: Date | string
    updated_at?: Date | string
    facility_code?: string | null
    nin?: string | null
    monthly_data?: MonthlyHealthDataUncheckedCreateNestedManyWithoutFacilityInput
    sub_centre?: sub_centreUncheckedCreateNestedManyWithoutFacilityInput
  }

  export type FacilityUpdateInput = {
    name?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    facility_code?: NullableStringFieldUpdateOperationsInput | string | null
    nin?: NullableStringFieldUpdateOperationsInput | string | null
    district?: DistrictUpdateOneRequiredWithoutFacilitiesNestedInput
    facility_type?: FacilityTypeUpdateOneRequiredWithoutFacilitiesNestedInput
    monthly_data?: MonthlyHealthDataUpdateManyWithoutFacilityNestedInput
    sub_centre?: sub_centreUpdateManyWithoutFacilityNestedInput
  }

  export type FacilityUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    district_id?: IntFieldUpdateOperationsInput | number
    facility_type_id?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    facility_code?: NullableStringFieldUpdateOperationsInput | string | null
    nin?: NullableStringFieldUpdateOperationsInput | string | null
    monthly_data?: MonthlyHealthDataUncheckedUpdateManyWithoutFacilityNestedInput
    sub_centre?: sub_centreUncheckedUpdateManyWithoutFacilityNestedInput
  }

  export type FacilityCreateManyInput = {
    id?: number
    name: string
    district_id: number
    facility_type_id: number
    created_at?: Date | string
    updated_at?: Date | string
    facility_code?: string | null
    nin?: string | null
  }

  export type FacilityUpdateManyMutationInput = {
    name?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    facility_code?: NullableStringFieldUpdateOperationsInput | string | null
    nin?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type FacilityUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    district_id?: IntFieldUpdateOperationsInput | number
    facility_type_id?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    facility_code?: NullableStringFieldUpdateOperationsInput | string | null
    nin?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type MonthlyHealthDataCreateInput = {
    report_month: string
    value?: Decimal | DecimalJsLike | number | string | null
    data_quality?: $Enums.DataQuality
    remarks?: string | null
    approved_at?: Date | string | null
    created_at?: Date | string
    updated_at?: Date | string
    achievement?: Decimal | DecimalJsLike | number | string | null
    denominator?: Decimal | DecimalJsLike | number | string | null
    numerator?: Decimal | DecimalJsLike | number | string | null
    target_value?: Decimal | DecimalJsLike | number | string | null
    approver?: UserCreateNestedOneWithoutApproved_dataInput
    district: DistrictCreateNestedOneWithoutMonthly_dataInput
    facility?: FacilityCreateNestedOneWithoutMonthly_dataInput
    sub_centre?: sub_centreCreateNestedOneWithoutMonthly_health_dataInput
    indicator?: IndicatorCreateNestedOneWithoutMonthly_dataInput
    uploader: UserCreateNestedOneWithoutUploaded_dataInput
  }

  export type MonthlyHealthDataUncheckedCreateInput = {
    id?: number
    facility_id?: number | null
    sub_centre_id?: number | null
    district_id: number
    indicator_id?: number | null
    report_month: string
    value?: Decimal | DecimalJsLike | number | string | null
    data_quality?: $Enums.DataQuality
    remarks?: string | null
    uploaded_by: number
    approved_by?: number | null
    approved_at?: Date | string | null
    created_at?: Date | string
    updated_at?: Date | string
    achievement?: Decimal | DecimalJsLike | number | string | null
    denominator?: Decimal | DecimalJsLike | number | string | null
    numerator?: Decimal | DecimalJsLike | number | string | null
    target_value?: Decimal | DecimalJsLike | number | string | null
  }

  export type MonthlyHealthDataUpdateInput = {
    report_month?: StringFieldUpdateOperationsInput | string
    value?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    data_quality?: EnumDataQualityFieldUpdateOperationsInput | $Enums.DataQuality
    remarks?: NullableStringFieldUpdateOperationsInput | string | null
    approved_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    achievement?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    denominator?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    numerator?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    target_value?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    approver?: UserUpdateOneWithoutApproved_dataNestedInput
    district?: DistrictUpdateOneRequiredWithoutMonthly_dataNestedInput
    facility?: FacilityUpdateOneWithoutMonthly_dataNestedInput
    sub_centre?: sub_centreUpdateOneWithoutMonthly_health_dataNestedInput
    indicator?: IndicatorUpdateOneWithoutMonthly_dataNestedInput
    uploader?: UserUpdateOneRequiredWithoutUploaded_dataNestedInput
  }

  export type MonthlyHealthDataUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    facility_id?: NullableIntFieldUpdateOperationsInput | number | null
    sub_centre_id?: NullableIntFieldUpdateOperationsInput | number | null
    district_id?: IntFieldUpdateOperationsInput | number
    indicator_id?: NullableIntFieldUpdateOperationsInput | number | null
    report_month?: StringFieldUpdateOperationsInput | string
    value?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    data_quality?: EnumDataQualityFieldUpdateOperationsInput | $Enums.DataQuality
    remarks?: NullableStringFieldUpdateOperationsInput | string | null
    uploaded_by?: IntFieldUpdateOperationsInput | number
    approved_by?: NullableIntFieldUpdateOperationsInput | number | null
    approved_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    achievement?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    denominator?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    numerator?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    target_value?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
  }

  export type MonthlyHealthDataCreateManyInput = {
    id?: number
    facility_id?: number | null
    sub_centre_id?: number | null
    district_id: number
    indicator_id?: number | null
    report_month: string
    value?: Decimal | DecimalJsLike | number | string | null
    data_quality?: $Enums.DataQuality
    remarks?: string | null
    uploaded_by: number
    approved_by?: number | null
    approved_at?: Date | string | null
    created_at?: Date | string
    updated_at?: Date | string
    achievement?: Decimal | DecimalJsLike | number | string | null
    denominator?: Decimal | DecimalJsLike | number | string | null
    numerator?: Decimal | DecimalJsLike | number | string | null
    target_value?: Decimal | DecimalJsLike | number | string | null
  }

  export type MonthlyHealthDataUpdateManyMutationInput = {
    report_month?: StringFieldUpdateOperationsInput | string
    value?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    data_quality?: EnumDataQualityFieldUpdateOperationsInput | $Enums.DataQuality
    remarks?: NullableStringFieldUpdateOperationsInput | string | null
    approved_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    achievement?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    denominator?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    numerator?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    target_value?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
  }

  export type MonthlyHealthDataUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    facility_id?: NullableIntFieldUpdateOperationsInput | number | null
    sub_centre_id?: NullableIntFieldUpdateOperationsInput | number | null
    district_id?: IntFieldUpdateOperationsInput | number
    indicator_id?: NullableIntFieldUpdateOperationsInput | number | null
    report_month?: StringFieldUpdateOperationsInput | string
    value?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    data_quality?: EnumDataQualityFieldUpdateOperationsInput | $Enums.DataQuality
    remarks?: NullableStringFieldUpdateOperationsInput | string | null
    uploaded_by?: IntFieldUpdateOperationsInput | number
    approved_by?: NullableIntFieldUpdateOperationsInput | number | null
    approved_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    achievement?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    denominator?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    numerator?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    target_value?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
  }

  export type DataUploadSessionCreateInput = {
    file_name: string
    file_path?: string | null
    report_month: string
    total_records: number
    success_count?: number
    error_count?: number
    status?: $Enums.UploadStatus
    upload_summary?: NullableJsonNullValueInput | InputJsonValue
    created_at?: Date | string
    completed_at?: Date | string | null
    uploader: UserCreateNestedOneWithoutUpload_sessionsInput
  }

  export type DataUploadSessionUncheckedCreateInput = {
    id?: number
    file_name: string
    file_path?: string | null
    report_month: string
    total_records: number
    success_count?: number
    error_count?: number
    status?: $Enums.UploadStatus
    upload_summary?: NullableJsonNullValueInput | InputJsonValue
    uploaded_by: number
    created_at?: Date | string
    completed_at?: Date | string | null
  }

  export type DataUploadSessionUpdateInput = {
    file_name?: StringFieldUpdateOperationsInput | string
    file_path?: NullableStringFieldUpdateOperationsInput | string | null
    report_month?: StringFieldUpdateOperationsInput | string
    total_records?: IntFieldUpdateOperationsInput | number
    success_count?: IntFieldUpdateOperationsInput | number
    error_count?: IntFieldUpdateOperationsInput | number
    status?: EnumUploadStatusFieldUpdateOperationsInput | $Enums.UploadStatus
    upload_summary?: NullableJsonNullValueInput | InputJsonValue
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    completed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    uploader?: UserUpdateOneRequiredWithoutUpload_sessionsNestedInput
  }

  export type DataUploadSessionUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    file_name?: StringFieldUpdateOperationsInput | string
    file_path?: NullableStringFieldUpdateOperationsInput | string | null
    report_month?: StringFieldUpdateOperationsInput | string
    total_records?: IntFieldUpdateOperationsInput | number
    success_count?: IntFieldUpdateOperationsInput | number
    error_count?: IntFieldUpdateOperationsInput | number
    status?: EnumUploadStatusFieldUpdateOperationsInput | $Enums.UploadStatus
    upload_summary?: NullableJsonNullValueInput | InputJsonValue
    uploaded_by?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    completed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type DataUploadSessionCreateManyInput = {
    id?: number
    file_name: string
    file_path?: string | null
    report_month: string
    total_records: number
    success_count?: number
    error_count?: number
    status?: $Enums.UploadStatus
    upload_summary?: NullableJsonNullValueInput | InputJsonValue
    uploaded_by: number
    created_at?: Date | string
    completed_at?: Date | string | null
  }

  export type DataUploadSessionUpdateManyMutationInput = {
    file_name?: StringFieldUpdateOperationsInput | string
    file_path?: NullableStringFieldUpdateOperationsInput | string | null
    report_month?: StringFieldUpdateOperationsInput | string
    total_records?: IntFieldUpdateOperationsInput | number
    success_count?: IntFieldUpdateOperationsInput | number
    error_count?: IntFieldUpdateOperationsInput | number
    status?: EnumUploadStatusFieldUpdateOperationsInput | $Enums.UploadStatus
    upload_summary?: NullableJsonNullValueInput | InputJsonValue
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    completed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type DataUploadSessionUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    file_name?: StringFieldUpdateOperationsInput | string
    file_path?: NullableStringFieldUpdateOperationsInput | string | null
    report_month?: StringFieldUpdateOperationsInput | string
    total_records?: IntFieldUpdateOperationsInput | number
    success_count?: IntFieldUpdateOperationsInput | number
    error_count?: IntFieldUpdateOperationsInput | number
    status?: EnumUploadStatusFieldUpdateOperationsInput | $Enums.UploadStatus
    upload_summary?: NullableJsonNullValueInput | InputJsonValue
    uploaded_by?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    completed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type FormulaCreateInput = {
    name: string
    description?: string | null
    structure: JsonNullValueInput | InputJsonValue
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type FormulaUncheckedCreateInput = {
    id?: number
    name: string
    description?: string | null
    structure: JsonNullValueInput | InputJsonValue
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type FormulaUpdateInput = {
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    structure?: JsonNullValueInput | InputJsonValue
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FormulaUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    structure?: JsonNullValueInput | InputJsonValue
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FormulaCreateManyInput = {
    id?: number
    name: string
    description?: string | null
    structure: JsonNullValueInput | InputJsonValue
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type FormulaUpdateManyMutationInput = {
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    structure?: JsonNullValueInput | InputJsonValue
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FormulaUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    structure?: JsonNullValueInput | InputJsonValue
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type IndicatorCreateInput = {
    code: string
    name: string
    description?: string | null
    type: string
    structure?: NullableJsonNullValueInput | InputJsonValue
    created_at?: Date | string
    updated_at?: Date | string
    monthly_data?: MonthlyHealthDataCreateNestedManyWithoutIndicatorInput
  }

  export type IndicatorUncheckedCreateInput = {
    id?: number
    code: string
    name: string
    description?: string | null
    type: string
    structure?: NullableJsonNullValueInput | InputJsonValue
    created_at?: Date | string
    updated_at?: Date | string
    monthly_data?: MonthlyHealthDataUncheckedCreateNestedManyWithoutIndicatorInput
  }

  export type IndicatorUpdateInput = {
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    type?: StringFieldUpdateOperationsInput | string
    structure?: NullableJsonNullValueInput | InputJsonValue
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    monthly_data?: MonthlyHealthDataUpdateManyWithoutIndicatorNestedInput
  }

  export type IndicatorUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    type?: StringFieldUpdateOperationsInput | string
    structure?: NullableJsonNullValueInput | InputJsonValue
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    monthly_data?: MonthlyHealthDataUncheckedUpdateManyWithoutIndicatorNestedInput
  }

  export type IndicatorCreateManyInput = {
    id?: number
    code: string
    name: string
    description?: string | null
    type: string
    structure?: NullableJsonNullValueInput | InputJsonValue
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type IndicatorUpdateManyMutationInput = {
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    type?: StringFieldUpdateOperationsInput | string
    structure?: NullableJsonNullValueInput | InputJsonValue
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type IndicatorUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    type?: StringFieldUpdateOperationsInput | string
    structure?: NullableJsonNullValueInput | InputJsonValue
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type fieldCreateInput = {
    code: string
    name: string
    description?: string | null
    created_at?: Date | string
    updated_at: Date | string
  }

  export type fieldUncheckedCreateInput = {
    id?: number
    code: string
    name: string
    description?: string | null
    created_at?: Date | string
    updated_at: Date | string
  }

  export type fieldUpdateInput = {
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type fieldUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type fieldCreateManyInput = {
    id?: number
    code: string
    name: string
    description?: string | null
    created_at?: Date | string
    updated_at: Date | string
  }

  export type fieldUpdateManyMutationInput = {
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type fieldUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type sub_centreCreateInput = {
    name: string
    created_at?: Date | string
    updated_at: Date | string
    facility_code?: string | null
    nin?: string | null
    monthly_health_data?: MonthlyHealthDataCreateNestedManyWithoutSub_centreInput
    facility: FacilityCreateNestedOneWithoutSub_centreInput
  }

  export type sub_centreUncheckedCreateInput = {
    id?: number
    name: string
    facility_id: number
    created_at?: Date | string
    updated_at: Date | string
    facility_code?: string | null
    nin?: string | null
    monthly_health_data?: MonthlyHealthDataUncheckedCreateNestedManyWithoutSub_centreInput
  }

  export type sub_centreUpdateInput = {
    name?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    facility_code?: NullableStringFieldUpdateOperationsInput | string | null
    nin?: NullableStringFieldUpdateOperationsInput | string | null
    monthly_health_data?: MonthlyHealthDataUpdateManyWithoutSub_centreNestedInput
    facility?: FacilityUpdateOneRequiredWithoutSub_centreNestedInput
  }

  export type sub_centreUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    facility_id?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    facility_code?: NullableStringFieldUpdateOperationsInput | string | null
    nin?: NullableStringFieldUpdateOperationsInput | string | null
    monthly_health_data?: MonthlyHealthDataUncheckedUpdateManyWithoutSub_centreNestedInput
  }

  export type sub_centreCreateManyInput = {
    id?: number
    name: string
    facility_id: number
    created_at?: Date | string
    updated_at: Date | string
    facility_code?: string | null
    nin?: string | null
  }

  export type sub_centreUpdateManyMutationInput = {
    name?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    facility_code?: NullableStringFieldUpdateOperationsInput | string | null
    nin?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type sub_centreUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    facility_id?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    facility_code?: NullableStringFieldUpdateOperationsInput | string | null
    nin?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type EnumUserRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>
    in?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumUserRoleFilter<$PrismaModel> | $Enums.UserRole
  }

  export type BoolNullableFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableFilter<$PrismaModel> | boolean | null
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type DataUploadSessionListRelationFilter = {
    every?: DataUploadSessionWhereInput
    some?: DataUploadSessionWhereInput
    none?: DataUploadSessionWhereInput
  }

  export type MonthlyHealthDataListRelationFilter = {
    every?: MonthlyHealthDataWhereInput
    some?: MonthlyHealthDataWhereInput
    none?: MonthlyHealthDataWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type DataUploadSessionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type MonthlyHealthDataOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    username?: SortOrder
    password_hash?: SortOrder
    role?: SortOrder
    is_active?: SortOrder
    last_login?: SortOrder
    created_at?: SortOrder
  }

  export type UserAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    username?: SortOrder
    password_hash?: SortOrder
    role?: SortOrder
    is_active?: SortOrder
    last_login?: SortOrder
    created_at?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    username?: SortOrder
    password_hash?: SortOrder
    role?: SortOrder
    is_active?: SortOrder
    last_login?: SortOrder
    created_at?: SortOrder
  }

  export type UserSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
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
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type EnumUserRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>
    in?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumUserRoleWithAggregatesFilter<$PrismaModel> | $Enums.UserRole
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumUserRoleFilter<$PrismaModel>
    _max?: NestedEnumUserRoleFilter<$PrismaModel>
  }

  export type BoolNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableWithAggregatesFilter<$PrismaModel> | boolean | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedBoolNullableFilter<$PrismaModel>
    _max?: NestedBoolNullableFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type FacilityListRelationFilter = {
    every?: FacilityWhereInput
    some?: FacilityWhereInput
    none?: FacilityWhereInput
  }

  export type FacilityOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type DistrictCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type DistrictAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type DistrictMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type DistrictMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type DistrictSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type FacilityTypeCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type FacilityTypeAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type FacilityTypeMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type FacilityTypeMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type FacilityTypeSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type DistrictScalarRelationFilter = {
    is?: DistrictWhereInput
    isNot?: DistrictWhereInput
  }

  export type FacilityTypeScalarRelationFilter = {
    is?: FacilityTypeWhereInput
    isNot?: FacilityTypeWhereInput
  }

  export type Sub_centreListRelationFilter = {
    every?: sub_centreWhereInput
    some?: sub_centreWhereInput
    none?: sub_centreWhereInput
  }

  export type sub_centreOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type FacilityCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    district_id?: SortOrder
    facility_type_id?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    facility_code?: SortOrder
    nin?: SortOrder
  }

  export type FacilityAvgOrderByAggregateInput = {
    id?: SortOrder
    district_id?: SortOrder
    facility_type_id?: SortOrder
  }

  export type FacilityMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    district_id?: SortOrder
    facility_type_id?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    facility_code?: SortOrder
    nin?: SortOrder
  }

  export type FacilityMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    district_id?: SortOrder
    facility_type_id?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    facility_code?: SortOrder
    nin?: SortOrder
  }

  export type FacilitySumOrderByAggregateInput = {
    id?: SortOrder
    district_id?: SortOrder
    facility_type_id?: SortOrder
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type DecimalNullableFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
  }

  export type EnumDataQualityFilter<$PrismaModel = never> = {
    equals?: $Enums.DataQuality | EnumDataQualityFieldRefInput<$PrismaModel>
    in?: $Enums.DataQuality[] | ListEnumDataQualityFieldRefInput<$PrismaModel>
    notIn?: $Enums.DataQuality[] | ListEnumDataQualityFieldRefInput<$PrismaModel>
    not?: NestedEnumDataQualityFilter<$PrismaModel> | $Enums.DataQuality
  }

  export type UserNullableScalarRelationFilter = {
    is?: UserWhereInput | null
    isNot?: UserWhereInput | null
  }

  export type FacilityNullableScalarRelationFilter = {
    is?: FacilityWhereInput | null
    isNot?: FacilityWhereInput | null
  }

  export type Sub_centreNullableScalarRelationFilter = {
    is?: sub_centreWhereInput | null
    isNot?: sub_centreWhereInput | null
  }

  export type IndicatorNullableScalarRelationFilter = {
    is?: IndicatorWhereInput | null
    isNot?: IndicatorWhereInput | null
  }

  export type UserScalarRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type MonthlyHealthDataFacility_idSub_centre_idIndicator_idReport_monthCompoundUniqueInput = {
    facility_id: number
    sub_centre_id: number
    indicator_id: number
    report_month: string
  }

  export type MonthlyHealthDataCountOrderByAggregateInput = {
    id?: SortOrder
    facility_id?: SortOrder
    sub_centre_id?: SortOrder
    district_id?: SortOrder
    indicator_id?: SortOrder
    report_month?: SortOrder
    value?: SortOrder
    data_quality?: SortOrder
    remarks?: SortOrder
    uploaded_by?: SortOrder
    approved_by?: SortOrder
    approved_at?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    achievement?: SortOrder
    denominator?: SortOrder
    numerator?: SortOrder
    target_value?: SortOrder
  }

  export type MonthlyHealthDataAvgOrderByAggregateInput = {
    id?: SortOrder
    facility_id?: SortOrder
    sub_centre_id?: SortOrder
    district_id?: SortOrder
    indicator_id?: SortOrder
    value?: SortOrder
    uploaded_by?: SortOrder
    approved_by?: SortOrder
    achievement?: SortOrder
    denominator?: SortOrder
    numerator?: SortOrder
    target_value?: SortOrder
  }

  export type MonthlyHealthDataMaxOrderByAggregateInput = {
    id?: SortOrder
    facility_id?: SortOrder
    sub_centre_id?: SortOrder
    district_id?: SortOrder
    indicator_id?: SortOrder
    report_month?: SortOrder
    value?: SortOrder
    data_quality?: SortOrder
    remarks?: SortOrder
    uploaded_by?: SortOrder
    approved_by?: SortOrder
    approved_at?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    achievement?: SortOrder
    denominator?: SortOrder
    numerator?: SortOrder
    target_value?: SortOrder
  }

  export type MonthlyHealthDataMinOrderByAggregateInput = {
    id?: SortOrder
    facility_id?: SortOrder
    sub_centre_id?: SortOrder
    district_id?: SortOrder
    indicator_id?: SortOrder
    report_month?: SortOrder
    value?: SortOrder
    data_quality?: SortOrder
    remarks?: SortOrder
    uploaded_by?: SortOrder
    approved_by?: SortOrder
    approved_at?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    achievement?: SortOrder
    denominator?: SortOrder
    numerator?: SortOrder
    target_value?: SortOrder
  }

  export type MonthlyHealthDataSumOrderByAggregateInput = {
    id?: SortOrder
    facility_id?: SortOrder
    sub_centre_id?: SortOrder
    district_id?: SortOrder
    indicator_id?: SortOrder
    value?: SortOrder
    uploaded_by?: SortOrder
    approved_by?: SortOrder
    achievement?: SortOrder
    denominator?: SortOrder
    numerator?: SortOrder
    target_value?: SortOrder
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
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

  export type DecimalNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
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

  export type EnumDataQualityWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.DataQuality | EnumDataQualityFieldRefInput<$PrismaModel>
    in?: $Enums.DataQuality[] | ListEnumDataQualityFieldRefInput<$PrismaModel>
    notIn?: $Enums.DataQuality[] | ListEnumDataQualityFieldRefInput<$PrismaModel>
    not?: NestedEnumDataQualityWithAggregatesFilter<$PrismaModel> | $Enums.DataQuality
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumDataQualityFilter<$PrismaModel>
    _max?: NestedEnumDataQualityFilter<$PrismaModel>
  }

  export type EnumUploadStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.UploadStatus | EnumUploadStatusFieldRefInput<$PrismaModel>
    in?: $Enums.UploadStatus[] | ListEnumUploadStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.UploadStatus[] | ListEnumUploadStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumUploadStatusFilter<$PrismaModel> | $Enums.UploadStatus
  }
  export type JsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type DataUploadSessionCountOrderByAggregateInput = {
    id?: SortOrder
    file_name?: SortOrder
    file_path?: SortOrder
    report_month?: SortOrder
    total_records?: SortOrder
    success_count?: SortOrder
    error_count?: SortOrder
    status?: SortOrder
    upload_summary?: SortOrder
    uploaded_by?: SortOrder
    created_at?: SortOrder
    completed_at?: SortOrder
  }

  export type DataUploadSessionAvgOrderByAggregateInput = {
    id?: SortOrder
    total_records?: SortOrder
    success_count?: SortOrder
    error_count?: SortOrder
    uploaded_by?: SortOrder
  }

  export type DataUploadSessionMaxOrderByAggregateInput = {
    id?: SortOrder
    file_name?: SortOrder
    file_path?: SortOrder
    report_month?: SortOrder
    total_records?: SortOrder
    success_count?: SortOrder
    error_count?: SortOrder
    status?: SortOrder
    uploaded_by?: SortOrder
    created_at?: SortOrder
    completed_at?: SortOrder
  }

  export type DataUploadSessionMinOrderByAggregateInput = {
    id?: SortOrder
    file_name?: SortOrder
    file_path?: SortOrder
    report_month?: SortOrder
    total_records?: SortOrder
    success_count?: SortOrder
    error_count?: SortOrder
    status?: SortOrder
    uploaded_by?: SortOrder
    created_at?: SortOrder
    completed_at?: SortOrder
  }

  export type DataUploadSessionSumOrderByAggregateInput = {
    id?: SortOrder
    total_records?: SortOrder
    success_count?: SortOrder
    error_count?: SortOrder
    uploaded_by?: SortOrder
  }

  export type EnumUploadStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.UploadStatus | EnumUploadStatusFieldRefInput<$PrismaModel>
    in?: $Enums.UploadStatus[] | ListEnumUploadStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.UploadStatus[] | ListEnumUploadStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumUploadStatusWithAggregatesFilter<$PrismaModel> | $Enums.UploadStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumUploadStatusFilter<$PrismaModel>
    _max?: NestedEnumUploadStatusFilter<$PrismaModel>
  }
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedJsonNullableFilter<$PrismaModel>
    _max?: NestedJsonNullableFilter<$PrismaModel>
  }
  export type JsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonFilterBase<$PrismaModel>>, 'path'>>

  export type JsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type FormulaCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    structure?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type FormulaAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type FormulaMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type FormulaMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type FormulaSumOrderByAggregateInput = {
    id?: SortOrder
  }
  export type JsonWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedJsonFilter<$PrismaModel>
    _max?: NestedJsonFilter<$PrismaModel>
  }

  export type IndicatorCountOrderByAggregateInput = {
    id?: SortOrder
    code?: SortOrder
    name?: SortOrder
    description?: SortOrder
    type?: SortOrder
    structure?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type IndicatorAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type IndicatorMaxOrderByAggregateInput = {
    id?: SortOrder
    code?: SortOrder
    name?: SortOrder
    description?: SortOrder
    type?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type IndicatorMinOrderByAggregateInput = {
    id?: SortOrder
    code?: SortOrder
    name?: SortOrder
    description?: SortOrder
    type?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type IndicatorSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type fieldCountOrderByAggregateInput = {
    id?: SortOrder
    code?: SortOrder
    name?: SortOrder
    description?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type fieldAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type fieldMaxOrderByAggregateInput = {
    id?: SortOrder
    code?: SortOrder
    name?: SortOrder
    description?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type fieldMinOrderByAggregateInput = {
    id?: SortOrder
    code?: SortOrder
    name?: SortOrder
    description?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type fieldSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type FacilityScalarRelationFilter = {
    is?: FacilityWhereInput
    isNot?: FacilityWhereInput
  }

  export type sub_centreCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    facility_id?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    facility_code?: SortOrder
    nin?: SortOrder
  }

  export type sub_centreAvgOrderByAggregateInput = {
    id?: SortOrder
    facility_id?: SortOrder
  }

  export type sub_centreMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    facility_id?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    facility_code?: SortOrder
    nin?: SortOrder
  }

  export type sub_centreMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    facility_id?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    facility_code?: SortOrder
    nin?: SortOrder
  }

  export type sub_centreSumOrderByAggregateInput = {
    id?: SortOrder
    facility_id?: SortOrder
  }

  export type DataUploadSessionCreateNestedManyWithoutUploaderInput = {
    create?: XOR<DataUploadSessionCreateWithoutUploaderInput, DataUploadSessionUncheckedCreateWithoutUploaderInput> | DataUploadSessionCreateWithoutUploaderInput[] | DataUploadSessionUncheckedCreateWithoutUploaderInput[]
    connectOrCreate?: DataUploadSessionCreateOrConnectWithoutUploaderInput | DataUploadSessionCreateOrConnectWithoutUploaderInput[]
    createMany?: DataUploadSessionCreateManyUploaderInputEnvelope
    connect?: DataUploadSessionWhereUniqueInput | DataUploadSessionWhereUniqueInput[]
  }

  export type MonthlyHealthDataCreateNestedManyWithoutApproverInput = {
    create?: XOR<MonthlyHealthDataCreateWithoutApproverInput, MonthlyHealthDataUncheckedCreateWithoutApproverInput> | MonthlyHealthDataCreateWithoutApproverInput[] | MonthlyHealthDataUncheckedCreateWithoutApproverInput[]
    connectOrCreate?: MonthlyHealthDataCreateOrConnectWithoutApproverInput | MonthlyHealthDataCreateOrConnectWithoutApproverInput[]
    createMany?: MonthlyHealthDataCreateManyApproverInputEnvelope
    connect?: MonthlyHealthDataWhereUniqueInput | MonthlyHealthDataWhereUniqueInput[]
  }

  export type MonthlyHealthDataCreateNestedManyWithoutUploaderInput = {
    create?: XOR<MonthlyHealthDataCreateWithoutUploaderInput, MonthlyHealthDataUncheckedCreateWithoutUploaderInput> | MonthlyHealthDataCreateWithoutUploaderInput[] | MonthlyHealthDataUncheckedCreateWithoutUploaderInput[]
    connectOrCreate?: MonthlyHealthDataCreateOrConnectWithoutUploaderInput | MonthlyHealthDataCreateOrConnectWithoutUploaderInput[]
    createMany?: MonthlyHealthDataCreateManyUploaderInputEnvelope
    connect?: MonthlyHealthDataWhereUniqueInput | MonthlyHealthDataWhereUniqueInput[]
  }

  export type DataUploadSessionUncheckedCreateNestedManyWithoutUploaderInput = {
    create?: XOR<DataUploadSessionCreateWithoutUploaderInput, DataUploadSessionUncheckedCreateWithoutUploaderInput> | DataUploadSessionCreateWithoutUploaderInput[] | DataUploadSessionUncheckedCreateWithoutUploaderInput[]
    connectOrCreate?: DataUploadSessionCreateOrConnectWithoutUploaderInput | DataUploadSessionCreateOrConnectWithoutUploaderInput[]
    createMany?: DataUploadSessionCreateManyUploaderInputEnvelope
    connect?: DataUploadSessionWhereUniqueInput | DataUploadSessionWhereUniqueInput[]
  }

  export type MonthlyHealthDataUncheckedCreateNestedManyWithoutApproverInput = {
    create?: XOR<MonthlyHealthDataCreateWithoutApproverInput, MonthlyHealthDataUncheckedCreateWithoutApproverInput> | MonthlyHealthDataCreateWithoutApproverInput[] | MonthlyHealthDataUncheckedCreateWithoutApproverInput[]
    connectOrCreate?: MonthlyHealthDataCreateOrConnectWithoutApproverInput | MonthlyHealthDataCreateOrConnectWithoutApproverInput[]
    createMany?: MonthlyHealthDataCreateManyApproverInputEnvelope
    connect?: MonthlyHealthDataWhereUniqueInput | MonthlyHealthDataWhereUniqueInput[]
  }

  export type MonthlyHealthDataUncheckedCreateNestedManyWithoutUploaderInput = {
    create?: XOR<MonthlyHealthDataCreateWithoutUploaderInput, MonthlyHealthDataUncheckedCreateWithoutUploaderInput> | MonthlyHealthDataCreateWithoutUploaderInput[] | MonthlyHealthDataUncheckedCreateWithoutUploaderInput[]
    connectOrCreate?: MonthlyHealthDataCreateOrConnectWithoutUploaderInput | MonthlyHealthDataCreateOrConnectWithoutUploaderInput[]
    createMany?: MonthlyHealthDataCreateManyUploaderInputEnvelope
    connect?: MonthlyHealthDataWhereUniqueInput | MonthlyHealthDataWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type EnumUserRoleFieldUpdateOperationsInput = {
    set?: $Enums.UserRole
  }

  export type NullableBoolFieldUpdateOperationsInput = {
    set?: boolean | null
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type DataUploadSessionUpdateManyWithoutUploaderNestedInput = {
    create?: XOR<DataUploadSessionCreateWithoutUploaderInput, DataUploadSessionUncheckedCreateWithoutUploaderInput> | DataUploadSessionCreateWithoutUploaderInput[] | DataUploadSessionUncheckedCreateWithoutUploaderInput[]
    connectOrCreate?: DataUploadSessionCreateOrConnectWithoutUploaderInput | DataUploadSessionCreateOrConnectWithoutUploaderInput[]
    upsert?: DataUploadSessionUpsertWithWhereUniqueWithoutUploaderInput | DataUploadSessionUpsertWithWhereUniqueWithoutUploaderInput[]
    createMany?: DataUploadSessionCreateManyUploaderInputEnvelope
    set?: DataUploadSessionWhereUniqueInput | DataUploadSessionWhereUniqueInput[]
    disconnect?: DataUploadSessionWhereUniqueInput | DataUploadSessionWhereUniqueInput[]
    delete?: DataUploadSessionWhereUniqueInput | DataUploadSessionWhereUniqueInput[]
    connect?: DataUploadSessionWhereUniqueInput | DataUploadSessionWhereUniqueInput[]
    update?: DataUploadSessionUpdateWithWhereUniqueWithoutUploaderInput | DataUploadSessionUpdateWithWhereUniqueWithoutUploaderInput[]
    updateMany?: DataUploadSessionUpdateManyWithWhereWithoutUploaderInput | DataUploadSessionUpdateManyWithWhereWithoutUploaderInput[]
    deleteMany?: DataUploadSessionScalarWhereInput | DataUploadSessionScalarWhereInput[]
  }

  export type MonthlyHealthDataUpdateManyWithoutApproverNestedInput = {
    create?: XOR<MonthlyHealthDataCreateWithoutApproverInput, MonthlyHealthDataUncheckedCreateWithoutApproverInput> | MonthlyHealthDataCreateWithoutApproverInput[] | MonthlyHealthDataUncheckedCreateWithoutApproverInput[]
    connectOrCreate?: MonthlyHealthDataCreateOrConnectWithoutApproverInput | MonthlyHealthDataCreateOrConnectWithoutApproverInput[]
    upsert?: MonthlyHealthDataUpsertWithWhereUniqueWithoutApproverInput | MonthlyHealthDataUpsertWithWhereUniqueWithoutApproverInput[]
    createMany?: MonthlyHealthDataCreateManyApproverInputEnvelope
    set?: MonthlyHealthDataWhereUniqueInput | MonthlyHealthDataWhereUniqueInput[]
    disconnect?: MonthlyHealthDataWhereUniqueInput | MonthlyHealthDataWhereUniqueInput[]
    delete?: MonthlyHealthDataWhereUniqueInput | MonthlyHealthDataWhereUniqueInput[]
    connect?: MonthlyHealthDataWhereUniqueInput | MonthlyHealthDataWhereUniqueInput[]
    update?: MonthlyHealthDataUpdateWithWhereUniqueWithoutApproverInput | MonthlyHealthDataUpdateWithWhereUniqueWithoutApproverInput[]
    updateMany?: MonthlyHealthDataUpdateManyWithWhereWithoutApproverInput | MonthlyHealthDataUpdateManyWithWhereWithoutApproverInput[]
    deleteMany?: MonthlyHealthDataScalarWhereInput | MonthlyHealthDataScalarWhereInput[]
  }

  export type MonthlyHealthDataUpdateManyWithoutUploaderNestedInput = {
    create?: XOR<MonthlyHealthDataCreateWithoutUploaderInput, MonthlyHealthDataUncheckedCreateWithoutUploaderInput> | MonthlyHealthDataCreateWithoutUploaderInput[] | MonthlyHealthDataUncheckedCreateWithoutUploaderInput[]
    connectOrCreate?: MonthlyHealthDataCreateOrConnectWithoutUploaderInput | MonthlyHealthDataCreateOrConnectWithoutUploaderInput[]
    upsert?: MonthlyHealthDataUpsertWithWhereUniqueWithoutUploaderInput | MonthlyHealthDataUpsertWithWhereUniqueWithoutUploaderInput[]
    createMany?: MonthlyHealthDataCreateManyUploaderInputEnvelope
    set?: MonthlyHealthDataWhereUniqueInput | MonthlyHealthDataWhereUniqueInput[]
    disconnect?: MonthlyHealthDataWhereUniqueInput | MonthlyHealthDataWhereUniqueInput[]
    delete?: MonthlyHealthDataWhereUniqueInput | MonthlyHealthDataWhereUniqueInput[]
    connect?: MonthlyHealthDataWhereUniqueInput | MonthlyHealthDataWhereUniqueInput[]
    update?: MonthlyHealthDataUpdateWithWhereUniqueWithoutUploaderInput | MonthlyHealthDataUpdateWithWhereUniqueWithoutUploaderInput[]
    updateMany?: MonthlyHealthDataUpdateManyWithWhereWithoutUploaderInput | MonthlyHealthDataUpdateManyWithWhereWithoutUploaderInput[]
    deleteMany?: MonthlyHealthDataScalarWhereInput | MonthlyHealthDataScalarWhereInput[]
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type DataUploadSessionUncheckedUpdateManyWithoutUploaderNestedInput = {
    create?: XOR<DataUploadSessionCreateWithoutUploaderInput, DataUploadSessionUncheckedCreateWithoutUploaderInput> | DataUploadSessionCreateWithoutUploaderInput[] | DataUploadSessionUncheckedCreateWithoutUploaderInput[]
    connectOrCreate?: DataUploadSessionCreateOrConnectWithoutUploaderInput | DataUploadSessionCreateOrConnectWithoutUploaderInput[]
    upsert?: DataUploadSessionUpsertWithWhereUniqueWithoutUploaderInput | DataUploadSessionUpsertWithWhereUniqueWithoutUploaderInput[]
    createMany?: DataUploadSessionCreateManyUploaderInputEnvelope
    set?: DataUploadSessionWhereUniqueInput | DataUploadSessionWhereUniqueInput[]
    disconnect?: DataUploadSessionWhereUniqueInput | DataUploadSessionWhereUniqueInput[]
    delete?: DataUploadSessionWhereUniqueInput | DataUploadSessionWhereUniqueInput[]
    connect?: DataUploadSessionWhereUniqueInput | DataUploadSessionWhereUniqueInput[]
    update?: DataUploadSessionUpdateWithWhereUniqueWithoutUploaderInput | DataUploadSessionUpdateWithWhereUniqueWithoutUploaderInput[]
    updateMany?: DataUploadSessionUpdateManyWithWhereWithoutUploaderInput | DataUploadSessionUpdateManyWithWhereWithoutUploaderInput[]
    deleteMany?: DataUploadSessionScalarWhereInput | DataUploadSessionScalarWhereInput[]
  }

  export type MonthlyHealthDataUncheckedUpdateManyWithoutApproverNestedInput = {
    create?: XOR<MonthlyHealthDataCreateWithoutApproverInput, MonthlyHealthDataUncheckedCreateWithoutApproverInput> | MonthlyHealthDataCreateWithoutApproverInput[] | MonthlyHealthDataUncheckedCreateWithoutApproverInput[]
    connectOrCreate?: MonthlyHealthDataCreateOrConnectWithoutApproverInput | MonthlyHealthDataCreateOrConnectWithoutApproverInput[]
    upsert?: MonthlyHealthDataUpsertWithWhereUniqueWithoutApproverInput | MonthlyHealthDataUpsertWithWhereUniqueWithoutApproverInput[]
    createMany?: MonthlyHealthDataCreateManyApproverInputEnvelope
    set?: MonthlyHealthDataWhereUniqueInput | MonthlyHealthDataWhereUniqueInput[]
    disconnect?: MonthlyHealthDataWhereUniqueInput | MonthlyHealthDataWhereUniqueInput[]
    delete?: MonthlyHealthDataWhereUniqueInput | MonthlyHealthDataWhereUniqueInput[]
    connect?: MonthlyHealthDataWhereUniqueInput | MonthlyHealthDataWhereUniqueInput[]
    update?: MonthlyHealthDataUpdateWithWhereUniqueWithoutApproverInput | MonthlyHealthDataUpdateWithWhereUniqueWithoutApproverInput[]
    updateMany?: MonthlyHealthDataUpdateManyWithWhereWithoutApproverInput | MonthlyHealthDataUpdateManyWithWhereWithoutApproverInput[]
    deleteMany?: MonthlyHealthDataScalarWhereInput | MonthlyHealthDataScalarWhereInput[]
  }

  export type MonthlyHealthDataUncheckedUpdateManyWithoutUploaderNestedInput = {
    create?: XOR<MonthlyHealthDataCreateWithoutUploaderInput, MonthlyHealthDataUncheckedCreateWithoutUploaderInput> | MonthlyHealthDataCreateWithoutUploaderInput[] | MonthlyHealthDataUncheckedCreateWithoutUploaderInput[]
    connectOrCreate?: MonthlyHealthDataCreateOrConnectWithoutUploaderInput | MonthlyHealthDataCreateOrConnectWithoutUploaderInput[]
    upsert?: MonthlyHealthDataUpsertWithWhereUniqueWithoutUploaderInput | MonthlyHealthDataUpsertWithWhereUniqueWithoutUploaderInput[]
    createMany?: MonthlyHealthDataCreateManyUploaderInputEnvelope
    set?: MonthlyHealthDataWhereUniqueInput | MonthlyHealthDataWhereUniqueInput[]
    disconnect?: MonthlyHealthDataWhereUniqueInput | MonthlyHealthDataWhereUniqueInput[]
    delete?: MonthlyHealthDataWhereUniqueInput | MonthlyHealthDataWhereUniqueInput[]
    connect?: MonthlyHealthDataWhereUniqueInput | MonthlyHealthDataWhereUniqueInput[]
    update?: MonthlyHealthDataUpdateWithWhereUniqueWithoutUploaderInput | MonthlyHealthDataUpdateWithWhereUniqueWithoutUploaderInput[]
    updateMany?: MonthlyHealthDataUpdateManyWithWhereWithoutUploaderInput | MonthlyHealthDataUpdateManyWithWhereWithoutUploaderInput[]
    deleteMany?: MonthlyHealthDataScalarWhereInput | MonthlyHealthDataScalarWhereInput[]
  }

  export type FacilityCreateNestedManyWithoutDistrictInput = {
    create?: XOR<FacilityCreateWithoutDistrictInput, FacilityUncheckedCreateWithoutDistrictInput> | FacilityCreateWithoutDistrictInput[] | FacilityUncheckedCreateWithoutDistrictInput[]
    connectOrCreate?: FacilityCreateOrConnectWithoutDistrictInput | FacilityCreateOrConnectWithoutDistrictInput[]
    createMany?: FacilityCreateManyDistrictInputEnvelope
    connect?: FacilityWhereUniqueInput | FacilityWhereUniqueInput[]
  }

  export type MonthlyHealthDataCreateNestedManyWithoutDistrictInput = {
    create?: XOR<MonthlyHealthDataCreateWithoutDistrictInput, MonthlyHealthDataUncheckedCreateWithoutDistrictInput> | MonthlyHealthDataCreateWithoutDistrictInput[] | MonthlyHealthDataUncheckedCreateWithoutDistrictInput[]
    connectOrCreate?: MonthlyHealthDataCreateOrConnectWithoutDistrictInput | MonthlyHealthDataCreateOrConnectWithoutDistrictInput[]
    createMany?: MonthlyHealthDataCreateManyDistrictInputEnvelope
    connect?: MonthlyHealthDataWhereUniqueInput | MonthlyHealthDataWhereUniqueInput[]
  }

  export type FacilityUncheckedCreateNestedManyWithoutDistrictInput = {
    create?: XOR<FacilityCreateWithoutDistrictInput, FacilityUncheckedCreateWithoutDistrictInput> | FacilityCreateWithoutDistrictInput[] | FacilityUncheckedCreateWithoutDistrictInput[]
    connectOrCreate?: FacilityCreateOrConnectWithoutDistrictInput | FacilityCreateOrConnectWithoutDistrictInput[]
    createMany?: FacilityCreateManyDistrictInputEnvelope
    connect?: FacilityWhereUniqueInput | FacilityWhereUniqueInput[]
  }

  export type MonthlyHealthDataUncheckedCreateNestedManyWithoutDistrictInput = {
    create?: XOR<MonthlyHealthDataCreateWithoutDistrictInput, MonthlyHealthDataUncheckedCreateWithoutDistrictInput> | MonthlyHealthDataCreateWithoutDistrictInput[] | MonthlyHealthDataUncheckedCreateWithoutDistrictInput[]
    connectOrCreate?: MonthlyHealthDataCreateOrConnectWithoutDistrictInput | MonthlyHealthDataCreateOrConnectWithoutDistrictInput[]
    createMany?: MonthlyHealthDataCreateManyDistrictInputEnvelope
    connect?: MonthlyHealthDataWhereUniqueInput | MonthlyHealthDataWhereUniqueInput[]
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type FacilityUpdateManyWithoutDistrictNestedInput = {
    create?: XOR<FacilityCreateWithoutDistrictInput, FacilityUncheckedCreateWithoutDistrictInput> | FacilityCreateWithoutDistrictInput[] | FacilityUncheckedCreateWithoutDistrictInput[]
    connectOrCreate?: FacilityCreateOrConnectWithoutDistrictInput | FacilityCreateOrConnectWithoutDistrictInput[]
    upsert?: FacilityUpsertWithWhereUniqueWithoutDistrictInput | FacilityUpsertWithWhereUniqueWithoutDistrictInput[]
    createMany?: FacilityCreateManyDistrictInputEnvelope
    set?: FacilityWhereUniqueInput | FacilityWhereUniqueInput[]
    disconnect?: FacilityWhereUniqueInput | FacilityWhereUniqueInput[]
    delete?: FacilityWhereUniqueInput | FacilityWhereUniqueInput[]
    connect?: FacilityWhereUniqueInput | FacilityWhereUniqueInput[]
    update?: FacilityUpdateWithWhereUniqueWithoutDistrictInput | FacilityUpdateWithWhereUniqueWithoutDistrictInput[]
    updateMany?: FacilityUpdateManyWithWhereWithoutDistrictInput | FacilityUpdateManyWithWhereWithoutDistrictInput[]
    deleteMany?: FacilityScalarWhereInput | FacilityScalarWhereInput[]
  }

  export type MonthlyHealthDataUpdateManyWithoutDistrictNestedInput = {
    create?: XOR<MonthlyHealthDataCreateWithoutDistrictInput, MonthlyHealthDataUncheckedCreateWithoutDistrictInput> | MonthlyHealthDataCreateWithoutDistrictInput[] | MonthlyHealthDataUncheckedCreateWithoutDistrictInput[]
    connectOrCreate?: MonthlyHealthDataCreateOrConnectWithoutDistrictInput | MonthlyHealthDataCreateOrConnectWithoutDistrictInput[]
    upsert?: MonthlyHealthDataUpsertWithWhereUniqueWithoutDistrictInput | MonthlyHealthDataUpsertWithWhereUniqueWithoutDistrictInput[]
    createMany?: MonthlyHealthDataCreateManyDistrictInputEnvelope
    set?: MonthlyHealthDataWhereUniqueInput | MonthlyHealthDataWhereUniqueInput[]
    disconnect?: MonthlyHealthDataWhereUniqueInput | MonthlyHealthDataWhereUniqueInput[]
    delete?: MonthlyHealthDataWhereUniqueInput | MonthlyHealthDataWhereUniqueInput[]
    connect?: MonthlyHealthDataWhereUniqueInput | MonthlyHealthDataWhereUniqueInput[]
    update?: MonthlyHealthDataUpdateWithWhereUniqueWithoutDistrictInput | MonthlyHealthDataUpdateWithWhereUniqueWithoutDistrictInput[]
    updateMany?: MonthlyHealthDataUpdateManyWithWhereWithoutDistrictInput | MonthlyHealthDataUpdateManyWithWhereWithoutDistrictInput[]
    deleteMany?: MonthlyHealthDataScalarWhereInput | MonthlyHealthDataScalarWhereInput[]
  }

  export type FacilityUncheckedUpdateManyWithoutDistrictNestedInput = {
    create?: XOR<FacilityCreateWithoutDistrictInput, FacilityUncheckedCreateWithoutDistrictInput> | FacilityCreateWithoutDistrictInput[] | FacilityUncheckedCreateWithoutDistrictInput[]
    connectOrCreate?: FacilityCreateOrConnectWithoutDistrictInput | FacilityCreateOrConnectWithoutDistrictInput[]
    upsert?: FacilityUpsertWithWhereUniqueWithoutDistrictInput | FacilityUpsertWithWhereUniqueWithoutDistrictInput[]
    createMany?: FacilityCreateManyDistrictInputEnvelope
    set?: FacilityWhereUniqueInput | FacilityWhereUniqueInput[]
    disconnect?: FacilityWhereUniqueInput | FacilityWhereUniqueInput[]
    delete?: FacilityWhereUniqueInput | FacilityWhereUniqueInput[]
    connect?: FacilityWhereUniqueInput | FacilityWhereUniqueInput[]
    update?: FacilityUpdateWithWhereUniqueWithoutDistrictInput | FacilityUpdateWithWhereUniqueWithoutDistrictInput[]
    updateMany?: FacilityUpdateManyWithWhereWithoutDistrictInput | FacilityUpdateManyWithWhereWithoutDistrictInput[]
    deleteMany?: FacilityScalarWhereInput | FacilityScalarWhereInput[]
  }

  export type MonthlyHealthDataUncheckedUpdateManyWithoutDistrictNestedInput = {
    create?: XOR<MonthlyHealthDataCreateWithoutDistrictInput, MonthlyHealthDataUncheckedCreateWithoutDistrictInput> | MonthlyHealthDataCreateWithoutDistrictInput[] | MonthlyHealthDataUncheckedCreateWithoutDistrictInput[]
    connectOrCreate?: MonthlyHealthDataCreateOrConnectWithoutDistrictInput | MonthlyHealthDataCreateOrConnectWithoutDistrictInput[]
    upsert?: MonthlyHealthDataUpsertWithWhereUniqueWithoutDistrictInput | MonthlyHealthDataUpsertWithWhereUniqueWithoutDistrictInput[]
    createMany?: MonthlyHealthDataCreateManyDistrictInputEnvelope
    set?: MonthlyHealthDataWhereUniqueInput | MonthlyHealthDataWhereUniqueInput[]
    disconnect?: MonthlyHealthDataWhereUniqueInput | MonthlyHealthDataWhereUniqueInput[]
    delete?: MonthlyHealthDataWhereUniqueInput | MonthlyHealthDataWhereUniqueInput[]
    connect?: MonthlyHealthDataWhereUniqueInput | MonthlyHealthDataWhereUniqueInput[]
    update?: MonthlyHealthDataUpdateWithWhereUniqueWithoutDistrictInput | MonthlyHealthDataUpdateWithWhereUniqueWithoutDistrictInput[]
    updateMany?: MonthlyHealthDataUpdateManyWithWhereWithoutDistrictInput | MonthlyHealthDataUpdateManyWithWhereWithoutDistrictInput[]
    deleteMany?: MonthlyHealthDataScalarWhereInput | MonthlyHealthDataScalarWhereInput[]
  }

  export type FacilityCreateNestedManyWithoutFacility_typeInput = {
    create?: XOR<FacilityCreateWithoutFacility_typeInput, FacilityUncheckedCreateWithoutFacility_typeInput> | FacilityCreateWithoutFacility_typeInput[] | FacilityUncheckedCreateWithoutFacility_typeInput[]
    connectOrCreate?: FacilityCreateOrConnectWithoutFacility_typeInput | FacilityCreateOrConnectWithoutFacility_typeInput[]
    createMany?: FacilityCreateManyFacility_typeInputEnvelope
    connect?: FacilityWhereUniqueInput | FacilityWhereUniqueInput[]
  }

  export type FacilityUncheckedCreateNestedManyWithoutFacility_typeInput = {
    create?: XOR<FacilityCreateWithoutFacility_typeInput, FacilityUncheckedCreateWithoutFacility_typeInput> | FacilityCreateWithoutFacility_typeInput[] | FacilityUncheckedCreateWithoutFacility_typeInput[]
    connectOrCreate?: FacilityCreateOrConnectWithoutFacility_typeInput | FacilityCreateOrConnectWithoutFacility_typeInput[]
    createMany?: FacilityCreateManyFacility_typeInputEnvelope
    connect?: FacilityWhereUniqueInput | FacilityWhereUniqueInput[]
  }

  export type FacilityUpdateManyWithoutFacility_typeNestedInput = {
    create?: XOR<FacilityCreateWithoutFacility_typeInput, FacilityUncheckedCreateWithoutFacility_typeInput> | FacilityCreateWithoutFacility_typeInput[] | FacilityUncheckedCreateWithoutFacility_typeInput[]
    connectOrCreate?: FacilityCreateOrConnectWithoutFacility_typeInput | FacilityCreateOrConnectWithoutFacility_typeInput[]
    upsert?: FacilityUpsertWithWhereUniqueWithoutFacility_typeInput | FacilityUpsertWithWhereUniqueWithoutFacility_typeInput[]
    createMany?: FacilityCreateManyFacility_typeInputEnvelope
    set?: FacilityWhereUniqueInput | FacilityWhereUniqueInput[]
    disconnect?: FacilityWhereUniqueInput | FacilityWhereUniqueInput[]
    delete?: FacilityWhereUniqueInput | FacilityWhereUniqueInput[]
    connect?: FacilityWhereUniqueInput | FacilityWhereUniqueInput[]
    update?: FacilityUpdateWithWhereUniqueWithoutFacility_typeInput | FacilityUpdateWithWhereUniqueWithoutFacility_typeInput[]
    updateMany?: FacilityUpdateManyWithWhereWithoutFacility_typeInput | FacilityUpdateManyWithWhereWithoutFacility_typeInput[]
    deleteMany?: FacilityScalarWhereInput | FacilityScalarWhereInput[]
  }

  export type FacilityUncheckedUpdateManyWithoutFacility_typeNestedInput = {
    create?: XOR<FacilityCreateWithoutFacility_typeInput, FacilityUncheckedCreateWithoutFacility_typeInput> | FacilityCreateWithoutFacility_typeInput[] | FacilityUncheckedCreateWithoutFacility_typeInput[]
    connectOrCreate?: FacilityCreateOrConnectWithoutFacility_typeInput | FacilityCreateOrConnectWithoutFacility_typeInput[]
    upsert?: FacilityUpsertWithWhereUniqueWithoutFacility_typeInput | FacilityUpsertWithWhereUniqueWithoutFacility_typeInput[]
    createMany?: FacilityCreateManyFacility_typeInputEnvelope
    set?: FacilityWhereUniqueInput | FacilityWhereUniqueInput[]
    disconnect?: FacilityWhereUniqueInput | FacilityWhereUniqueInput[]
    delete?: FacilityWhereUniqueInput | FacilityWhereUniqueInput[]
    connect?: FacilityWhereUniqueInput | FacilityWhereUniqueInput[]
    update?: FacilityUpdateWithWhereUniqueWithoutFacility_typeInput | FacilityUpdateWithWhereUniqueWithoutFacility_typeInput[]
    updateMany?: FacilityUpdateManyWithWhereWithoutFacility_typeInput | FacilityUpdateManyWithWhereWithoutFacility_typeInput[]
    deleteMany?: FacilityScalarWhereInput | FacilityScalarWhereInput[]
  }

  export type DistrictCreateNestedOneWithoutFacilitiesInput = {
    create?: XOR<DistrictCreateWithoutFacilitiesInput, DistrictUncheckedCreateWithoutFacilitiesInput>
    connectOrCreate?: DistrictCreateOrConnectWithoutFacilitiesInput
    connect?: DistrictWhereUniqueInput
  }

  export type FacilityTypeCreateNestedOneWithoutFacilitiesInput = {
    create?: XOR<FacilityTypeCreateWithoutFacilitiesInput, FacilityTypeUncheckedCreateWithoutFacilitiesInput>
    connectOrCreate?: FacilityTypeCreateOrConnectWithoutFacilitiesInput
    connect?: FacilityTypeWhereUniqueInput
  }

  export type MonthlyHealthDataCreateNestedManyWithoutFacilityInput = {
    create?: XOR<MonthlyHealthDataCreateWithoutFacilityInput, MonthlyHealthDataUncheckedCreateWithoutFacilityInput> | MonthlyHealthDataCreateWithoutFacilityInput[] | MonthlyHealthDataUncheckedCreateWithoutFacilityInput[]
    connectOrCreate?: MonthlyHealthDataCreateOrConnectWithoutFacilityInput | MonthlyHealthDataCreateOrConnectWithoutFacilityInput[]
    createMany?: MonthlyHealthDataCreateManyFacilityInputEnvelope
    connect?: MonthlyHealthDataWhereUniqueInput | MonthlyHealthDataWhereUniqueInput[]
  }

  export type sub_centreCreateNestedManyWithoutFacilityInput = {
    create?: XOR<sub_centreCreateWithoutFacilityInput, sub_centreUncheckedCreateWithoutFacilityInput> | sub_centreCreateWithoutFacilityInput[] | sub_centreUncheckedCreateWithoutFacilityInput[]
    connectOrCreate?: sub_centreCreateOrConnectWithoutFacilityInput | sub_centreCreateOrConnectWithoutFacilityInput[]
    createMany?: sub_centreCreateManyFacilityInputEnvelope
    connect?: sub_centreWhereUniqueInput | sub_centreWhereUniqueInput[]
  }

  export type MonthlyHealthDataUncheckedCreateNestedManyWithoutFacilityInput = {
    create?: XOR<MonthlyHealthDataCreateWithoutFacilityInput, MonthlyHealthDataUncheckedCreateWithoutFacilityInput> | MonthlyHealthDataCreateWithoutFacilityInput[] | MonthlyHealthDataUncheckedCreateWithoutFacilityInput[]
    connectOrCreate?: MonthlyHealthDataCreateOrConnectWithoutFacilityInput | MonthlyHealthDataCreateOrConnectWithoutFacilityInput[]
    createMany?: MonthlyHealthDataCreateManyFacilityInputEnvelope
    connect?: MonthlyHealthDataWhereUniqueInput | MonthlyHealthDataWhereUniqueInput[]
  }

  export type sub_centreUncheckedCreateNestedManyWithoutFacilityInput = {
    create?: XOR<sub_centreCreateWithoutFacilityInput, sub_centreUncheckedCreateWithoutFacilityInput> | sub_centreCreateWithoutFacilityInput[] | sub_centreUncheckedCreateWithoutFacilityInput[]
    connectOrCreate?: sub_centreCreateOrConnectWithoutFacilityInput | sub_centreCreateOrConnectWithoutFacilityInput[]
    createMany?: sub_centreCreateManyFacilityInputEnvelope
    connect?: sub_centreWhereUniqueInput | sub_centreWhereUniqueInput[]
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type DistrictUpdateOneRequiredWithoutFacilitiesNestedInput = {
    create?: XOR<DistrictCreateWithoutFacilitiesInput, DistrictUncheckedCreateWithoutFacilitiesInput>
    connectOrCreate?: DistrictCreateOrConnectWithoutFacilitiesInput
    upsert?: DistrictUpsertWithoutFacilitiesInput
    connect?: DistrictWhereUniqueInput
    update?: XOR<XOR<DistrictUpdateToOneWithWhereWithoutFacilitiesInput, DistrictUpdateWithoutFacilitiesInput>, DistrictUncheckedUpdateWithoutFacilitiesInput>
  }

  export type FacilityTypeUpdateOneRequiredWithoutFacilitiesNestedInput = {
    create?: XOR<FacilityTypeCreateWithoutFacilitiesInput, FacilityTypeUncheckedCreateWithoutFacilitiesInput>
    connectOrCreate?: FacilityTypeCreateOrConnectWithoutFacilitiesInput
    upsert?: FacilityTypeUpsertWithoutFacilitiesInput
    connect?: FacilityTypeWhereUniqueInput
    update?: XOR<XOR<FacilityTypeUpdateToOneWithWhereWithoutFacilitiesInput, FacilityTypeUpdateWithoutFacilitiesInput>, FacilityTypeUncheckedUpdateWithoutFacilitiesInput>
  }

  export type MonthlyHealthDataUpdateManyWithoutFacilityNestedInput = {
    create?: XOR<MonthlyHealthDataCreateWithoutFacilityInput, MonthlyHealthDataUncheckedCreateWithoutFacilityInput> | MonthlyHealthDataCreateWithoutFacilityInput[] | MonthlyHealthDataUncheckedCreateWithoutFacilityInput[]
    connectOrCreate?: MonthlyHealthDataCreateOrConnectWithoutFacilityInput | MonthlyHealthDataCreateOrConnectWithoutFacilityInput[]
    upsert?: MonthlyHealthDataUpsertWithWhereUniqueWithoutFacilityInput | MonthlyHealthDataUpsertWithWhereUniqueWithoutFacilityInput[]
    createMany?: MonthlyHealthDataCreateManyFacilityInputEnvelope
    set?: MonthlyHealthDataWhereUniqueInput | MonthlyHealthDataWhereUniqueInput[]
    disconnect?: MonthlyHealthDataWhereUniqueInput | MonthlyHealthDataWhereUniqueInput[]
    delete?: MonthlyHealthDataWhereUniqueInput | MonthlyHealthDataWhereUniqueInput[]
    connect?: MonthlyHealthDataWhereUniqueInput | MonthlyHealthDataWhereUniqueInput[]
    update?: MonthlyHealthDataUpdateWithWhereUniqueWithoutFacilityInput | MonthlyHealthDataUpdateWithWhereUniqueWithoutFacilityInput[]
    updateMany?: MonthlyHealthDataUpdateManyWithWhereWithoutFacilityInput | MonthlyHealthDataUpdateManyWithWhereWithoutFacilityInput[]
    deleteMany?: MonthlyHealthDataScalarWhereInput | MonthlyHealthDataScalarWhereInput[]
  }

  export type sub_centreUpdateManyWithoutFacilityNestedInput = {
    create?: XOR<sub_centreCreateWithoutFacilityInput, sub_centreUncheckedCreateWithoutFacilityInput> | sub_centreCreateWithoutFacilityInput[] | sub_centreUncheckedCreateWithoutFacilityInput[]
    connectOrCreate?: sub_centreCreateOrConnectWithoutFacilityInput | sub_centreCreateOrConnectWithoutFacilityInput[]
    upsert?: sub_centreUpsertWithWhereUniqueWithoutFacilityInput | sub_centreUpsertWithWhereUniqueWithoutFacilityInput[]
    createMany?: sub_centreCreateManyFacilityInputEnvelope
    set?: sub_centreWhereUniqueInput | sub_centreWhereUniqueInput[]
    disconnect?: sub_centreWhereUniqueInput | sub_centreWhereUniqueInput[]
    delete?: sub_centreWhereUniqueInput | sub_centreWhereUniqueInput[]
    connect?: sub_centreWhereUniqueInput | sub_centreWhereUniqueInput[]
    update?: sub_centreUpdateWithWhereUniqueWithoutFacilityInput | sub_centreUpdateWithWhereUniqueWithoutFacilityInput[]
    updateMany?: sub_centreUpdateManyWithWhereWithoutFacilityInput | sub_centreUpdateManyWithWhereWithoutFacilityInput[]
    deleteMany?: sub_centreScalarWhereInput | sub_centreScalarWhereInput[]
  }

  export type MonthlyHealthDataUncheckedUpdateManyWithoutFacilityNestedInput = {
    create?: XOR<MonthlyHealthDataCreateWithoutFacilityInput, MonthlyHealthDataUncheckedCreateWithoutFacilityInput> | MonthlyHealthDataCreateWithoutFacilityInput[] | MonthlyHealthDataUncheckedCreateWithoutFacilityInput[]
    connectOrCreate?: MonthlyHealthDataCreateOrConnectWithoutFacilityInput | MonthlyHealthDataCreateOrConnectWithoutFacilityInput[]
    upsert?: MonthlyHealthDataUpsertWithWhereUniqueWithoutFacilityInput | MonthlyHealthDataUpsertWithWhereUniqueWithoutFacilityInput[]
    createMany?: MonthlyHealthDataCreateManyFacilityInputEnvelope
    set?: MonthlyHealthDataWhereUniqueInput | MonthlyHealthDataWhereUniqueInput[]
    disconnect?: MonthlyHealthDataWhereUniqueInput | MonthlyHealthDataWhereUniqueInput[]
    delete?: MonthlyHealthDataWhereUniqueInput | MonthlyHealthDataWhereUniqueInput[]
    connect?: MonthlyHealthDataWhereUniqueInput | MonthlyHealthDataWhereUniqueInput[]
    update?: MonthlyHealthDataUpdateWithWhereUniqueWithoutFacilityInput | MonthlyHealthDataUpdateWithWhereUniqueWithoutFacilityInput[]
    updateMany?: MonthlyHealthDataUpdateManyWithWhereWithoutFacilityInput | MonthlyHealthDataUpdateManyWithWhereWithoutFacilityInput[]
    deleteMany?: MonthlyHealthDataScalarWhereInput | MonthlyHealthDataScalarWhereInput[]
  }

  export type sub_centreUncheckedUpdateManyWithoutFacilityNestedInput = {
    create?: XOR<sub_centreCreateWithoutFacilityInput, sub_centreUncheckedCreateWithoutFacilityInput> | sub_centreCreateWithoutFacilityInput[] | sub_centreUncheckedCreateWithoutFacilityInput[]
    connectOrCreate?: sub_centreCreateOrConnectWithoutFacilityInput | sub_centreCreateOrConnectWithoutFacilityInput[]
    upsert?: sub_centreUpsertWithWhereUniqueWithoutFacilityInput | sub_centreUpsertWithWhereUniqueWithoutFacilityInput[]
    createMany?: sub_centreCreateManyFacilityInputEnvelope
    set?: sub_centreWhereUniqueInput | sub_centreWhereUniqueInput[]
    disconnect?: sub_centreWhereUniqueInput | sub_centreWhereUniqueInput[]
    delete?: sub_centreWhereUniqueInput | sub_centreWhereUniqueInput[]
    connect?: sub_centreWhereUniqueInput | sub_centreWhereUniqueInput[]
    update?: sub_centreUpdateWithWhereUniqueWithoutFacilityInput | sub_centreUpdateWithWhereUniqueWithoutFacilityInput[]
    updateMany?: sub_centreUpdateManyWithWhereWithoutFacilityInput | sub_centreUpdateManyWithWhereWithoutFacilityInput[]
    deleteMany?: sub_centreScalarWhereInput | sub_centreScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutApproved_dataInput = {
    create?: XOR<UserCreateWithoutApproved_dataInput, UserUncheckedCreateWithoutApproved_dataInput>
    connectOrCreate?: UserCreateOrConnectWithoutApproved_dataInput
    connect?: UserWhereUniqueInput
  }

  export type DistrictCreateNestedOneWithoutMonthly_dataInput = {
    create?: XOR<DistrictCreateWithoutMonthly_dataInput, DistrictUncheckedCreateWithoutMonthly_dataInput>
    connectOrCreate?: DistrictCreateOrConnectWithoutMonthly_dataInput
    connect?: DistrictWhereUniqueInput
  }

  export type FacilityCreateNestedOneWithoutMonthly_dataInput = {
    create?: XOR<FacilityCreateWithoutMonthly_dataInput, FacilityUncheckedCreateWithoutMonthly_dataInput>
    connectOrCreate?: FacilityCreateOrConnectWithoutMonthly_dataInput
    connect?: FacilityWhereUniqueInput
  }

  export type sub_centreCreateNestedOneWithoutMonthly_health_dataInput = {
    create?: XOR<sub_centreCreateWithoutMonthly_health_dataInput, sub_centreUncheckedCreateWithoutMonthly_health_dataInput>
    connectOrCreate?: sub_centreCreateOrConnectWithoutMonthly_health_dataInput
    connect?: sub_centreWhereUniqueInput
  }

  export type IndicatorCreateNestedOneWithoutMonthly_dataInput = {
    create?: XOR<IndicatorCreateWithoutMonthly_dataInput, IndicatorUncheckedCreateWithoutMonthly_dataInput>
    connectOrCreate?: IndicatorCreateOrConnectWithoutMonthly_dataInput
    connect?: IndicatorWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutUploaded_dataInput = {
    create?: XOR<UserCreateWithoutUploaded_dataInput, UserUncheckedCreateWithoutUploaded_dataInput>
    connectOrCreate?: UserCreateOrConnectWithoutUploaded_dataInput
    connect?: UserWhereUniqueInput
  }

  export type NullableDecimalFieldUpdateOperationsInput = {
    set?: Decimal | DecimalJsLike | number | string | null
    increment?: Decimal | DecimalJsLike | number | string
    decrement?: Decimal | DecimalJsLike | number | string
    multiply?: Decimal | DecimalJsLike | number | string
    divide?: Decimal | DecimalJsLike | number | string
  }

  export type EnumDataQualityFieldUpdateOperationsInput = {
    set?: $Enums.DataQuality
  }

  export type UserUpdateOneWithoutApproved_dataNestedInput = {
    create?: XOR<UserCreateWithoutApproved_dataInput, UserUncheckedCreateWithoutApproved_dataInput>
    connectOrCreate?: UserCreateOrConnectWithoutApproved_dataInput
    upsert?: UserUpsertWithoutApproved_dataInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutApproved_dataInput, UserUpdateWithoutApproved_dataInput>, UserUncheckedUpdateWithoutApproved_dataInput>
  }

  export type DistrictUpdateOneRequiredWithoutMonthly_dataNestedInput = {
    create?: XOR<DistrictCreateWithoutMonthly_dataInput, DistrictUncheckedCreateWithoutMonthly_dataInput>
    connectOrCreate?: DistrictCreateOrConnectWithoutMonthly_dataInput
    upsert?: DistrictUpsertWithoutMonthly_dataInput
    connect?: DistrictWhereUniqueInput
    update?: XOR<XOR<DistrictUpdateToOneWithWhereWithoutMonthly_dataInput, DistrictUpdateWithoutMonthly_dataInput>, DistrictUncheckedUpdateWithoutMonthly_dataInput>
  }

  export type FacilityUpdateOneWithoutMonthly_dataNestedInput = {
    create?: XOR<FacilityCreateWithoutMonthly_dataInput, FacilityUncheckedCreateWithoutMonthly_dataInput>
    connectOrCreate?: FacilityCreateOrConnectWithoutMonthly_dataInput
    upsert?: FacilityUpsertWithoutMonthly_dataInput
    disconnect?: FacilityWhereInput | boolean
    delete?: FacilityWhereInput | boolean
    connect?: FacilityWhereUniqueInput
    update?: XOR<XOR<FacilityUpdateToOneWithWhereWithoutMonthly_dataInput, FacilityUpdateWithoutMonthly_dataInput>, FacilityUncheckedUpdateWithoutMonthly_dataInput>
  }

  export type sub_centreUpdateOneWithoutMonthly_health_dataNestedInput = {
    create?: XOR<sub_centreCreateWithoutMonthly_health_dataInput, sub_centreUncheckedCreateWithoutMonthly_health_dataInput>
    connectOrCreate?: sub_centreCreateOrConnectWithoutMonthly_health_dataInput
    upsert?: sub_centreUpsertWithoutMonthly_health_dataInput
    disconnect?: sub_centreWhereInput | boolean
    delete?: sub_centreWhereInput | boolean
    connect?: sub_centreWhereUniqueInput
    update?: XOR<XOR<sub_centreUpdateToOneWithWhereWithoutMonthly_health_dataInput, sub_centreUpdateWithoutMonthly_health_dataInput>, sub_centreUncheckedUpdateWithoutMonthly_health_dataInput>
  }

  export type IndicatorUpdateOneWithoutMonthly_dataNestedInput = {
    create?: XOR<IndicatorCreateWithoutMonthly_dataInput, IndicatorUncheckedCreateWithoutMonthly_dataInput>
    connectOrCreate?: IndicatorCreateOrConnectWithoutMonthly_dataInput
    upsert?: IndicatorUpsertWithoutMonthly_dataInput
    disconnect?: IndicatorWhereInput | boolean
    delete?: IndicatorWhereInput | boolean
    connect?: IndicatorWhereUniqueInput
    update?: XOR<XOR<IndicatorUpdateToOneWithWhereWithoutMonthly_dataInput, IndicatorUpdateWithoutMonthly_dataInput>, IndicatorUncheckedUpdateWithoutMonthly_dataInput>
  }

  export type UserUpdateOneRequiredWithoutUploaded_dataNestedInput = {
    create?: XOR<UserCreateWithoutUploaded_dataInput, UserUncheckedCreateWithoutUploaded_dataInput>
    connectOrCreate?: UserCreateOrConnectWithoutUploaded_dataInput
    upsert?: UserUpsertWithoutUploaded_dataInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutUploaded_dataInput, UserUpdateWithoutUploaded_dataInput>, UserUncheckedUpdateWithoutUploaded_dataInput>
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type UserCreateNestedOneWithoutUpload_sessionsInput = {
    create?: XOR<UserCreateWithoutUpload_sessionsInput, UserUncheckedCreateWithoutUpload_sessionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutUpload_sessionsInput
    connect?: UserWhereUniqueInput
  }

  export type EnumUploadStatusFieldUpdateOperationsInput = {
    set?: $Enums.UploadStatus
  }

  export type UserUpdateOneRequiredWithoutUpload_sessionsNestedInput = {
    create?: XOR<UserCreateWithoutUpload_sessionsInput, UserUncheckedCreateWithoutUpload_sessionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutUpload_sessionsInput
    upsert?: UserUpsertWithoutUpload_sessionsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutUpload_sessionsInput, UserUpdateWithoutUpload_sessionsInput>, UserUncheckedUpdateWithoutUpload_sessionsInput>
  }

  export type MonthlyHealthDataCreateNestedManyWithoutIndicatorInput = {
    create?: XOR<MonthlyHealthDataCreateWithoutIndicatorInput, MonthlyHealthDataUncheckedCreateWithoutIndicatorInput> | MonthlyHealthDataCreateWithoutIndicatorInput[] | MonthlyHealthDataUncheckedCreateWithoutIndicatorInput[]
    connectOrCreate?: MonthlyHealthDataCreateOrConnectWithoutIndicatorInput | MonthlyHealthDataCreateOrConnectWithoutIndicatorInput[]
    createMany?: MonthlyHealthDataCreateManyIndicatorInputEnvelope
    connect?: MonthlyHealthDataWhereUniqueInput | MonthlyHealthDataWhereUniqueInput[]
  }

  export type MonthlyHealthDataUncheckedCreateNestedManyWithoutIndicatorInput = {
    create?: XOR<MonthlyHealthDataCreateWithoutIndicatorInput, MonthlyHealthDataUncheckedCreateWithoutIndicatorInput> | MonthlyHealthDataCreateWithoutIndicatorInput[] | MonthlyHealthDataUncheckedCreateWithoutIndicatorInput[]
    connectOrCreate?: MonthlyHealthDataCreateOrConnectWithoutIndicatorInput | MonthlyHealthDataCreateOrConnectWithoutIndicatorInput[]
    createMany?: MonthlyHealthDataCreateManyIndicatorInputEnvelope
    connect?: MonthlyHealthDataWhereUniqueInput | MonthlyHealthDataWhereUniqueInput[]
  }

  export type MonthlyHealthDataUpdateManyWithoutIndicatorNestedInput = {
    create?: XOR<MonthlyHealthDataCreateWithoutIndicatorInput, MonthlyHealthDataUncheckedCreateWithoutIndicatorInput> | MonthlyHealthDataCreateWithoutIndicatorInput[] | MonthlyHealthDataUncheckedCreateWithoutIndicatorInput[]
    connectOrCreate?: MonthlyHealthDataCreateOrConnectWithoutIndicatorInput | MonthlyHealthDataCreateOrConnectWithoutIndicatorInput[]
    upsert?: MonthlyHealthDataUpsertWithWhereUniqueWithoutIndicatorInput | MonthlyHealthDataUpsertWithWhereUniqueWithoutIndicatorInput[]
    createMany?: MonthlyHealthDataCreateManyIndicatorInputEnvelope
    set?: MonthlyHealthDataWhereUniqueInput | MonthlyHealthDataWhereUniqueInput[]
    disconnect?: MonthlyHealthDataWhereUniqueInput | MonthlyHealthDataWhereUniqueInput[]
    delete?: MonthlyHealthDataWhereUniqueInput | MonthlyHealthDataWhereUniqueInput[]
    connect?: MonthlyHealthDataWhereUniqueInput | MonthlyHealthDataWhereUniqueInput[]
    update?: MonthlyHealthDataUpdateWithWhereUniqueWithoutIndicatorInput | MonthlyHealthDataUpdateWithWhereUniqueWithoutIndicatorInput[]
    updateMany?: MonthlyHealthDataUpdateManyWithWhereWithoutIndicatorInput | MonthlyHealthDataUpdateManyWithWhereWithoutIndicatorInput[]
    deleteMany?: MonthlyHealthDataScalarWhereInput | MonthlyHealthDataScalarWhereInput[]
  }

  export type MonthlyHealthDataUncheckedUpdateManyWithoutIndicatorNestedInput = {
    create?: XOR<MonthlyHealthDataCreateWithoutIndicatorInput, MonthlyHealthDataUncheckedCreateWithoutIndicatorInput> | MonthlyHealthDataCreateWithoutIndicatorInput[] | MonthlyHealthDataUncheckedCreateWithoutIndicatorInput[]
    connectOrCreate?: MonthlyHealthDataCreateOrConnectWithoutIndicatorInput | MonthlyHealthDataCreateOrConnectWithoutIndicatorInput[]
    upsert?: MonthlyHealthDataUpsertWithWhereUniqueWithoutIndicatorInput | MonthlyHealthDataUpsertWithWhereUniqueWithoutIndicatorInput[]
    createMany?: MonthlyHealthDataCreateManyIndicatorInputEnvelope
    set?: MonthlyHealthDataWhereUniqueInput | MonthlyHealthDataWhereUniqueInput[]
    disconnect?: MonthlyHealthDataWhereUniqueInput | MonthlyHealthDataWhereUniqueInput[]
    delete?: MonthlyHealthDataWhereUniqueInput | MonthlyHealthDataWhereUniqueInput[]
    connect?: MonthlyHealthDataWhereUniqueInput | MonthlyHealthDataWhereUniqueInput[]
    update?: MonthlyHealthDataUpdateWithWhereUniqueWithoutIndicatorInput | MonthlyHealthDataUpdateWithWhereUniqueWithoutIndicatorInput[]
    updateMany?: MonthlyHealthDataUpdateManyWithWhereWithoutIndicatorInput | MonthlyHealthDataUpdateManyWithWhereWithoutIndicatorInput[]
    deleteMany?: MonthlyHealthDataScalarWhereInput | MonthlyHealthDataScalarWhereInput[]
  }

  export type MonthlyHealthDataCreateNestedManyWithoutSub_centreInput = {
    create?: XOR<MonthlyHealthDataCreateWithoutSub_centreInput, MonthlyHealthDataUncheckedCreateWithoutSub_centreInput> | MonthlyHealthDataCreateWithoutSub_centreInput[] | MonthlyHealthDataUncheckedCreateWithoutSub_centreInput[]
    connectOrCreate?: MonthlyHealthDataCreateOrConnectWithoutSub_centreInput | MonthlyHealthDataCreateOrConnectWithoutSub_centreInput[]
    createMany?: MonthlyHealthDataCreateManySub_centreInputEnvelope
    connect?: MonthlyHealthDataWhereUniqueInput | MonthlyHealthDataWhereUniqueInput[]
  }

  export type FacilityCreateNestedOneWithoutSub_centreInput = {
    create?: XOR<FacilityCreateWithoutSub_centreInput, FacilityUncheckedCreateWithoutSub_centreInput>
    connectOrCreate?: FacilityCreateOrConnectWithoutSub_centreInput
    connect?: FacilityWhereUniqueInput
  }

  export type MonthlyHealthDataUncheckedCreateNestedManyWithoutSub_centreInput = {
    create?: XOR<MonthlyHealthDataCreateWithoutSub_centreInput, MonthlyHealthDataUncheckedCreateWithoutSub_centreInput> | MonthlyHealthDataCreateWithoutSub_centreInput[] | MonthlyHealthDataUncheckedCreateWithoutSub_centreInput[]
    connectOrCreate?: MonthlyHealthDataCreateOrConnectWithoutSub_centreInput | MonthlyHealthDataCreateOrConnectWithoutSub_centreInput[]
    createMany?: MonthlyHealthDataCreateManySub_centreInputEnvelope
    connect?: MonthlyHealthDataWhereUniqueInput | MonthlyHealthDataWhereUniqueInput[]
  }

  export type MonthlyHealthDataUpdateManyWithoutSub_centreNestedInput = {
    create?: XOR<MonthlyHealthDataCreateWithoutSub_centreInput, MonthlyHealthDataUncheckedCreateWithoutSub_centreInput> | MonthlyHealthDataCreateWithoutSub_centreInput[] | MonthlyHealthDataUncheckedCreateWithoutSub_centreInput[]
    connectOrCreate?: MonthlyHealthDataCreateOrConnectWithoutSub_centreInput | MonthlyHealthDataCreateOrConnectWithoutSub_centreInput[]
    upsert?: MonthlyHealthDataUpsertWithWhereUniqueWithoutSub_centreInput | MonthlyHealthDataUpsertWithWhereUniqueWithoutSub_centreInput[]
    createMany?: MonthlyHealthDataCreateManySub_centreInputEnvelope
    set?: MonthlyHealthDataWhereUniqueInput | MonthlyHealthDataWhereUniqueInput[]
    disconnect?: MonthlyHealthDataWhereUniqueInput | MonthlyHealthDataWhereUniqueInput[]
    delete?: MonthlyHealthDataWhereUniqueInput | MonthlyHealthDataWhereUniqueInput[]
    connect?: MonthlyHealthDataWhereUniqueInput | MonthlyHealthDataWhereUniqueInput[]
    update?: MonthlyHealthDataUpdateWithWhereUniqueWithoutSub_centreInput | MonthlyHealthDataUpdateWithWhereUniqueWithoutSub_centreInput[]
    updateMany?: MonthlyHealthDataUpdateManyWithWhereWithoutSub_centreInput | MonthlyHealthDataUpdateManyWithWhereWithoutSub_centreInput[]
    deleteMany?: MonthlyHealthDataScalarWhereInput | MonthlyHealthDataScalarWhereInput[]
  }

  export type FacilityUpdateOneRequiredWithoutSub_centreNestedInput = {
    create?: XOR<FacilityCreateWithoutSub_centreInput, FacilityUncheckedCreateWithoutSub_centreInput>
    connectOrCreate?: FacilityCreateOrConnectWithoutSub_centreInput
    upsert?: FacilityUpsertWithoutSub_centreInput
    connect?: FacilityWhereUniqueInput
    update?: XOR<XOR<FacilityUpdateToOneWithWhereWithoutSub_centreInput, FacilityUpdateWithoutSub_centreInput>, FacilityUncheckedUpdateWithoutSub_centreInput>
  }

  export type MonthlyHealthDataUncheckedUpdateManyWithoutSub_centreNestedInput = {
    create?: XOR<MonthlyHealthDataCreateWithoutSub_centreInput, MonthlyHealthDataUncheckedCreateWithoutSub_centreInput> | MonthlyHealthDataCreateWithoutSub_centreInput[] | MonthlyHealthDataUncheckedCreateWithoutSub_centreInput[]
    connectOrCreate?: MonthlyHealthDataCreateOrConnectWithoutSub_centreInput | MonthlyHealthDataCreateOrConnectWithoutSub_centreInput[]
    upsert?: MonthlyHealthDataUpsertWithWhereUniqueWithoutSub_centreInput | MonthlyHealthDataUpsertWithWhereUniqueWithoutSub_centreInput[]
    createMany?: MonthlyHealthDataCreateManySub_centreInputEnvelope
    set?: MonthlyHealthDataWhereUniqueInput | MonthlyHealthDataWhereUniqueInput[]
    disconnect?: MonthlyHealthDataWhereUniqueInput | MonthlyHealthDataWhereUniqueInput[]
    delete?: MonthlyHealthDataWhereUniqueInput | MonthlyHealthDataWhereUniqueInput[]
    connect?: MonthlyHealthDataWhereUniqueInput | MonthlyHealthDataWhereUniqueInput[]
    update?: MonthlyHealthDataUpdateWithWhereUniqueWithoutSub_centreInput | MonthlyHealthDataUpdateWithWhereUniqueWithoutSub_centreInput[]
    updateMany?: MonthlyHealthDataUpdateManyWithWhereWithoutSub_centreInput | MonthlyHealthDataUpdateManyWithWhereWithoutSub_centreInput[]
    deleteMany?: MonthlyHealthDataScalarWhereInput | MonthlyHealthDataScalarWhereInput[]
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedEnumUserRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>
    in?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumUserRoleFilter<$PrismaModel> | $Enums.UserRole
  }

  export type NestedBoolNullableFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableFilter<$PrismaModel> | boolean | null
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
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
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedEnumUserRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>
    in?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumUserRoleWithAggregatesFilter<$PrismaModel> | $Enums.UserRole
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumUserRoleFilter<$PrismaModel>
    _max?: NestedEnumUserRoleFilter<$PrismaModel>
  }

  export type NestedBoolNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableWithAggregatesFilter<$PrismaModel> | boolean | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedBoolNullableFilter<$PrismaModel>
    _max?: NestedBoolNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedDecimalNullableFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
  }

  export type NestedEnumDataQualityFilter<$PrismaModel = never> = {
    equals?: $Enums.DataQuality | EnumDataQualityFieldRefInput<$PrismaModel>
    in?: $Enums.DataQuality[] | ListEnumDataQualityFieldRefInput<$PrismaModel>
    notIn?: $Enums.DataQuality[] | ListEnumDataQualityFieldRefInput<$PrismaModel>
    not?: NestedEnumDataQualityFilter<$PrismaModel> | $Enums.DataQuality
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
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
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDecimalNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
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

  export type NestedEnumDataQualityWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.DataQuality | EnumDataQualityFieldRefInput<$PrismaModel>
    in?: $Enums.DataQuality[] | ListEnumDataQualityFieldRefInput<$PrismaModel>
    notIn?: $Enums.DataQuality[] | ListEnumDataQualityFieldRefInput<$PrismaModel>
    not?: NestedEnumDataQualityWithAggregatesFilter<$PrismaModel> | $Enums.DataQuality
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumDataQualityFilter<$PrismaModel>
    _max?: NestedEnumDataQualityFilter<$PrismaModel>
  }

  export type NestedEnumUploadStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.UploadStatus | EnumUploadStatusFieldRefInput<$PrismaModel>
    in?: $Enums.UploadStatus[] | ListEnumUploadStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.UploadStatus[] | ListEnumUploadStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumUploadStatusFilter<$PrismaModel> | $Enums.UploadStatus
  }

  export type NestedEnumUploadStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.UploadStatus | EnumUploadStatusFieldRefInput<$PrismaModel>
    in?: $Enums.UploadStatus[] | ListEnumUploadStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.UploadStatus[] | ListEnumUploadStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumUploadStatusWithAggregatesFilter<$PrismaModel> | $Enums.UploadStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumUploadStatusFilter<$PrismaModel>
    _max?: NestedEnumUploadStatusFilter<$PrismaModel>
  }
  export type NestedJsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }
  export type NestedJsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type DataUploadSessionCreateWithoutUploaderInput = {
    file_name: string
    file_path?: string | null
    report_month: string
    total_records: number
    success_count?: number
    error_count?: number
    status?: $Enums.UploadStatus
    upload_summary?: NullableJsonNullValueInput | InputJsonValue
    created_at?: Date | string
    completed_at?: Date | string | null
  }

  export type DataUploadSessionUncheckedCreateWithoutUploaderInput = {
    id?: number
    file_name: string
    file_path?: string | null
    report_month: string
    total_records: number
    success_count?: number
    error_count?: number
    status?: $Enums.UploadStatus
    upload_summary?: NullableJsonNullValueInput | InputJsonValue
    created_at?: Date | string
    completed_at?: Date | string | null
  }

  export type DataUploadSessionCreateOrConnectWithoutUploaderInput = {
    where: DataUploadSessionWhereUniqueInput
    create: XOR<DataUploadSessionCreateWithoutUploaderInput, DataUploadSessionUncheckedCreateWithoutUploaderInput>
  }

  export type DataUploadSessionCreateManyUploaderInputEnvelope = {
    data: DataUploadSessionCreateManyUploaderInput | DataUploadSessionCreateManyUploaderInput[]
    skipDuplicates?: boolean
  }

  export type MonthlyHealthDataCreateWithoutApproverInput = {
    report_month: string
    value?: Decimal | DecimalJsLike | number | string | null
    data_quality?: $Enums.DataQuality
    remarks?: string | null
    approved_at?: Date | string | null
    created_at?: Date | string
    updated_at?: Date | string
    achievement?: Decimal | DecimalJsLike | number | string | null
    denominator?: Decimal | DecimalJsLike | number | string | null
    numerator?: Decimal | DecimalJsLike | number | string | null
    target_value?: Decimal | DecimalJsLike | number | string | null
    district: DistrictCreateNestedOneWithoutMonthly_dataInput
    facility?: FacilityCreateNestedOneWithoutMonthly_dataInput
    sub_centre?: sub_centreCreateNestedOneWithoutMonthly_health_dataInput
    indicator?: IndicatorCreateNestedOneWithoutMonthly_dataInput
    uploader: UserCreateNestedOneWithoutUploaded_dataInput
  }

  export type MonthlyHealthDataUncheckedCreateWithoutApproverInput = {
    id?: number
    facility_id?: number | null
    sub_centre_id?: number | null
    district_id: number
    indicator_id?: number | null
    report_month: string
    value?: Decimal | DecimalJsLike | number | string | null
    data_quality?: $Enums.DataQuality
    remarks?: string | null
    uploaded_by: number
    approved_at?: Date | string | null
    created_at?: Date | string
    updated_at?: Date | string
    achievement?: Decimal | DecimalJsLike | number | string | null
    denominator?: Decimal | DecimalJsLike | number | string | null
    numerator?: Decimal | DecimalJsLike | number | string | null
    target_value?: Decimal | DecimalJsLike | number | string | null
  }

  export type MonthlyHealthDataCreateOrConnectWithoutApproverInput = {
    where: MonthlyHealthDataWhereUniqueInput
    create: XOR<MonthlyHealthDataCreateWithoutApproverInput, MonthlyHealthDataUncheckedCreateWithoutApproverInput>
  }

  export type MonthlyHealthDataCreateManyApproverInputEnvelope = {
    data: MonthlyHealthDataCreateManyApproverInput | MonthlyHealthDataCreateManyApproverInput[]
    skipDuplicates?: boolean
  }

  export type MonthlyHealthDataCreateWithoutUploaderInput = {
    report_month: string
    value?: Decimal | DecimalJsLike | number | string | null
    data_quality?: $Enums.DataQuality
    remarks?: string | null
    approved_at?: Date | string | null
    created_at?: Date | string
    updated_at?: Date | string
    achievement?: Decimal | DecimalJsLike | number | string | null
    denominator?: Decimal | DecimalJsLike | number | string | null
    numerator?: Decimal | DecimalJsLike | number | string | null
    target_value?: Decimal | DecimalJsLike | number | string | null
    approver?: UserCreateNestedOneWithoutApproved_dataInput
    district: DistrictCreateNestedOneWithoutMonthly_dataInput
    facility?: FacilityCreateNestedOneWithoutMonthly_dataInput
    sub_centre?: sub_centreCreateNestedOneWithoutMonthly_health_dataInput
    indicator?: IndicatorCreateNestedOneWithoutMonthly_dataInput
  }

  export type MonthlyHealthDataUncheckedCreateWithoutUploaderInput = {
    id?: number
    facility_id?: number | null
    sub_centre_id?: number | null
    district_id: number
    indicator_id?: number | null
    report_month: string
    value?: Decimal | DecimalJsLike | number | string | null
    data_quality?: $Enums.DataQuality
    remarks?: string | null
    approved_by?: number | null
    approved_at?: Date | string | null
    created_at?: Date | string
    updated_at?: Date | string
    achievement?: Decimal | DecimalJsLike | number | string | null
    denominator?: Decimal | DecimalJsLike | number | string | null
    numerator?: Decimal | DecimalJsLike | number | string | null
    target_value?: Decimal | DecimalJsLike | number | string | null
  }

  export type MonthlyHealthDataCreateOrConnectWithoutUploaderInput = {
    where: MonthlyHealthDataWhereUniqueInput
    create: XOR<MonthlyHealthDataCreateWithoutUploaderInput, MonthlyHealthDataUncheckedCreateWithoutUploaderInput>
  }

  export type MonthlyHealthDataCreateManyUploaderInputEnvelope = {
    data: MonthlyHealthDataCreateManyUploaderInput | MonthlyHealthDataCreateManyUploaderInput[]
    skipDuplicates?: boolean
  }

  export type DataUploadSessionUpsertWithWhereUniqueWithoutUploaderInput = {
    where: DataUploadSessionWhereUniqueInput
    update: XOR<DataUploadSessionUpdateWithoutUploaderInput, DataUploadSessionUncheckedUpdateWithoutUploaderInput>
    create: XOR<DataUploadSessionCreateWithoutUploaderInput, DataUploadSessionUncheckedCreateWithoutUploaderInput>
  }

  export type DataUploadSessionUpdateWithWhereUniqueWithoutUploaderInput = {
    where: DataUploadSessionWhereUniqueInput
    data: XOR<DataUploadSessionUpdateWithoutUploaderInput, DataUploadSessionUncheckedUpdateWithoutUploaderInput>
  }

  export type DataUploadSessionUpdateManyWithWhereWithoutUploaderInput = {
    where: DataUploadSessionScalarWhereInput
    data: XOR<DataUploadSessionUpdateManyMutationInput, DataUploadSessionUncheckedUpdateManyWithoutUploaderInput>
  }

  export type DataUploadSessionScalarWhereInput = {
    AND?: DataUploadSessionScalarWhereInput | DataUploadSessionScalarWhereInput[]
    OR?: DataUploadSessionScalarWhereInput[]
    NOT?: DataUploadSessionScalarWhereInput | DataUploadSessionScalarWhereInput[]
    id?: IntFilter<"DataUploadSession"> | number
    file_name?: StringFilter<"DataUploadSession"> | string
    file_path?: StringNullableFilter<"DataUploadSession"> | string | null
    report_month?: StringFilter<"DataUploadSession"> | string
    total_records?: IntFilter<"DataUploadSession"> | number
    success_count?: IntFilter<"DataUploadSession"> | number
    error_count?: IntFilter<"DataUploadSession"> | number
    status?: EnumUploadStatusFilter<"DataUploadSession"> | $Enums.UploadStatus
    upload_summary?: JsonNullableFilter<"DataUploadSession">
    uploaded_by?: IntFilter<"DataUploadSession"> | number
    created_at?: DateTimeFilter<"DataUploadSession"> | Date | string
    completed_at?: DateTimeNullableFilter<"DataUploadSession"> | Date | string | null
  }

  export type MonthlyHealthDataUpsertWithWhereUniqueWithoutApproverInput = {
    where: MonthlyHealthDataWhereUniqueInput
    update: XOR<MonthlyHealthDataUpdateWithoutApproverInput, MonthlyHealthDataUncheckedUpdateWithoutApproverInput>
    create: XOR<MonthlyHealthDataCreateWithoutApproverInput, MonthlyHealthDataUncheckedCreateWithoutApproverInput>
  }

  export type MonthlyHealthDataUpdateWithWhereUniqueWithoutApproverInput = {
    where: MonthlyHealthDataWhereUniqueInput
    data: XOR<MonthlyHealthDataUpdateWithoutApproverInput, MonthlyHealthDataUncheckedUpdateWithoutApproverInput>
  }

  export type MonthlyHealthDataUpdateManyWithWhereWithoutApproverInput = {
    where: MonthlyHealthDataScalarWhereInput
    data: XOR<MonthlyHealthDataUpdateManyMutationInput, MonthlyHealthDataUncheckedUpdateManyWithoutApproverInput>
  }

  export type MonthlyHealthDataScalarWhereInput = {
    AND?: MonthlyHealthDataScalarWhereInput | MonthlyHealthDataScalarWhereInput[]
    OR?: MonthlyHealthDataScalarWhereInput[]
    NOT?: MonthlyHealthDataScalarWhereInput | MonthlyHealthDataScalarWhereInput[]
    id?: IntFilter<"MonthlyHealthData"> | number
    facility_id?: IntNullableFilter<"MonthlyHealthData"> | number | null
    sub_centre_id?: IntNullableFilter<"MonthlyHealthData"> | number | null
    district_id?: IntFilter<"MonthlyHealthData"> | number
    indicator_id?: IntNullableFilter<"MonthlyHealthData"> | number | null
    report_month?: StringFilter<"MonthlyHealthData"> | string
    value?: DecimalNullableFilter<"MonthlyHealthData"> | Decimal | DecimalJsLike | number | string | null
    data_quality?: EnumDataQualityFilter<"MonthlyHealthData"> | $Enums.DataQuality
    remarks?: StringNullableFilter<"MonthlyHealthData"> | string | null
    uploaded_by?: IntFilter<"MonthlyHealthData"> | number
    approved_by?: IntNullableFilter<"MonthlyHealthData"> | number | null
    approved_at?: DateTimeNullableFilter<"MonthlyHealthData"> | Date | string | null
    created_at?: DateTimeFilter<"MonthlyHealthData"> | Date | string
    updated_at?: DateTimeFilter<"MonthlyHealthData"> | Date | string
    achievement?: DecimalNullableFilter<"MonthlyHealthData"> | Decimal | DecimalJsLike | number | string | null
    denominator?: DecimalNullableFilter<"MonthlyHealthData"> | Decimal | DecimalJsLike | number | string | null
    numerator?: DecimalNullableFilter<"MonthlyHealthData"> | Decimal | DecimalJsLike | number | string | null
    target_value?: DecimalNullableFilter<"MonthlyHealthData"> | Decimal | DecimalJsLike | number | string | null
  }

  export type MonthlyHealthDataUpsertWithWhereUniqueWithoutUploaderInput = {
    where: MonthlyHealthDataWhereUniqueInput
    update: XOR<MonthlyHealthDataUpdateWithoutUploaderInput, MonthlyHealthDataUncheckedUpdateWithoutUploaderInput>
    create: XOR<MonthlyHealthDataCreateWithoutUploaderInput, MonthlyHealthDataUncheckedCreateWithoutUploaderInput>
  }

  export type MonthlyHealthDataUpdateWithWhereUniqueWithoutUploaderInput = {
    where: MonthlyHealthDataWhereUniqueInput
    data: XOR<MonthlyHealthDataUpdateWithoutUploaderInput, MonthlyHealthDataUncheckedUpdateWithoutUploaderInput>
  }

  export type MonthlyHealthDataUpdateManyWithWhereWithoutUploaderInput = {
    where: MonthlyHealthDataScalarWhereInput
    data: XOR<MonthlyHealthDataUpdateManyMutationInput, MonthlyHealthDataUncheckedUpdateManyWithoutUploaderInput>
  }

  export type FacilityCreateWithoutDistrictInput = {
    name: string
    created_at?: Date | string
    updated_at?: Date | string
    facility_code?: string | null
    nin?: string | null
    facility_type: FacilityTypeCreateNestedOneWithoutFacilitiesInput
    monthly_data?: MonthlyHealthDataCreateNestedManyWithoutFacilityInput
    sub_centre?: sub_centreCreateNestedManyWithoutFacilityInput
  }

  export type FacilityUncheckedCreateWithoutDistrictInput = {
    id?: number
    name: string
    facility_type_id: number
    created_at?: Date | string
    updated_at?: Date | string
    facility_code?: string | null
    nin?: string | null
    monthly_data?: MonthlyHealthDataUncheckedCreateNestedManyWithoutFacilityInput
    sub_centre?: sub_centreUncheckedCreateNestedManyWithoutFacilityInput
  }

  export type FacilityCreateOrConnectWithoutDistrictInput = {
    where: FacilityWhereUniqueInput
    create: XOR<FacilityCreateWithoutDistrictInput, FacilityUncheckedCreateWithoutDistrictInput>
  }

  export type FacilityCreateManyDistrictInputEnvelope = {
    data: FacilityCreateManyDistrictInput | FacilityCreateManyDistrictInput[]
    skipDuplicates?: boolean
  }

  export type MonthlyHealthDataCreateWithoutDistrictInput = {
    report_month: string
    value?: Decimal | DecimalJsLike | number | string | null
    data_quality?: $Enums.DataQuality
    remarks?: string | null
    approved_at?: Date | string | null
    created_at?: Date | string
    updated_at?: Date | string
    achievement?: Decimal | DecimalJsLike | number | string | null
    denominator?: Decimal | DecimalJsLike | number | string | null
    numerator?: Decimal | DecimalJsLike | number | string | null
    target_value?: Decimal | DecimalJsLike | number | string | null
    approver?: UserCreateNestedOneWithoutApproved_dataInput
    facility?: FacilityCreateNestedOneWithoutMonthly_dataInput
    sub_centre?: sub_centreCreateNestedOneWithoutMonthly_health_dataInput
    indicator?: IndicatorCreateNestedOneWithoutMonthly_dataInput
    uploader: UserCreateNestedOneWithoutUploaded_dataInput
  }

  export type MonthlyHealthDataUncheckedCreateWithoutDistrictInput = {
    id?: number
    facility_id?: number | null
    sub_centre_id?: number | null
    indicator_id?: number | null
    report_month: string
    value?: Decimal | DecimalJsLike | number | string | null
    data_quality?: $Enums.DataQuality
    remarks?: string | null
    uploaded_by: number
    approved_by?: number | null
    approved_at?: Date | string | null
    created_at?: Date | string
    updated_at?: Date | string
    achievement?: Decimal | DecimalJsLike | number | string | null
    denominator?: Decimal | DecimalJsLike | number | string | null
    numerator?: Decimal | DecimalJsLike | number | string | null
    target_value?: Decimal | DecimalJsLike | number | string | null
  }

  export type MonthlyHealthDataCreateOrConnectWithoutDistrictInput = {
    where: MonthlyHealthDataWhereUniqueInput
    create: XOR<MonthlyHealthDataCreateWithoutDistrictInput, MonthlyHealthDataUncheckedCreateWithoutDistrictInput>
  }

  export type MonthlyHealthDataCreateManyDistrictInputEnvelope = {
    data: MonthlyHealthDataCreateManyDistrictInput | MonthlyHealthDataCreateManyDistrictInput[]
    skipDuplicates?: boolean
  }

  export type FacilityUpsertWithWhereUniqueWithoutDistrictInput = {
    where: FacilityWhereUniqueInput
    update: XOR<FacilityUpdateWithoutDistrictInput, FacilityUncheckedUpdateWithoutDistrictInput>
    create: XOR<FacilityCreateWithoutDistrictInput, FacilityUncheckedCreateWithoutDistrictInput>
  }

  export type FacilityUpdateWithWhereUniqueWithoutDistrictInput = {
    where: FacilityWhereUniqueInput
    data: XOR<FacilityUpdateWithoutDistrictInput, FacilityUncheckedUpdateWithoutDistrictInput>
  }

  export type FacilityUpdateManyWithWhereWithoutDistrictInput = {
    where: FacilityScalarWhereInput
    data: XOR<FacilityUpdateManyMutationInput, FacilityUncheckedUpdateManyWithoutDistrictInput>
  }

  export type FacilityScalarWhereInput = {
    AND?: FacilityScalarWhereInput | FacilityScalarWhereInput[]
    OR?: FacilityScalarWhereInput[]
    NOT?: FacilityScalarWhereInput | FacilityScalarWhereInput[]
    id?: IntFilter<"Facility"> | number
    name?: StringFilter<"Facility"> | string
    district_id?: IntFilter<"Facility"> | number
    facility_type_id?: IntFilter<"Facility"> | number
    created_at?: DateTimeFilter<"Facility"> | Date | string
    updated_at?: DateTimeFilter<"Facility"> | Date | string
    facility_code?: StringNullableFilter<"Facility"> | string | null
    nin?: StringNullableFilter<"Facility"> | string | null
  }

  export type MonthlyHealthDataUpsertWithWhereUniqueWithoutDistrictInput = {
    where: MonthlyHealthDataWhereUniqueInput
    update: XOR<MonthlyHealthDataUpdateWithoutDistrictInput, MonthlyHealthDataUncheckedUpdateWithoutDistrictInput>
    create: XOR<MonthlyHealthDataCreateWithoutDistrictInput, MonthlyHealthDataUncheckedCreateWithoutDistrictInput>
  }

  export type MonthlyHealthDataUpdateWithWhereUniqueWithoutDistrictInput = {
    where: MonthlyHealthDataWhereUniqueInput
    data: XOR<MonthlyHealthDataUpdateWithoutDistrictInput, MonthlyHealthDataUncheckedUpdateWithoutDistrictInput>
  }

  export type MonthlyHealthDataUpdateManyWithWhereWithoutDistrictInput = {
    where: MonthlyHealthDataScalarWhereInput
    data: XOR<MonthlyHealthDataUpdateManyMutationInput, MonthlyHealthDataUncheckedUpdateManyWithoutDistrictInput>
  }

  export type FacilityCreateWithoutFacility_typeInput = {
    name: string
    created_at?: Date | string
    updated_at?: Date | string
    facility_code?: string | null
    nin?: string | null
    district: DistrictCreateNestedOneWithoutFacilitiesInput
    monthly_data?: MonthlyHealthDataCreateNestedManyWithoutFacilityInput
    sub_centre?: sub_centreCreateNestedManyWithoutFacilityInput
  }

  export type FacilityUncheckedCreateWithoutFacility_typeInput = {
    id?: number
    name: string
    district_id: number
    created_at?: Date | string
    updated_at?: Date | string
    facility_code?: string | null
    nin?: string | null
    monthly_data?: MonthlyHealthDataUncheckedCreateNestedManyWithoutFacilityInput
    sub_centre?: sub_centreUncheckedCreateNestedManyWithoutFacilityInput
  }

  export type FacilityCreateOrConnectWithoutFacility_typeInput = {
    where: FacilityWhereUniqueInput
    create: XOR<FacilityCreateWithoutFacility_typeInput, FacilityUncheckedCreateWithoutFacility_typeInput>
  }

  export type FacilityCreateManyFacility_typeInputEnvelope = {
    data: FacilityCreateManyFacility_typeInput | FacilityCreateManyFacility_typeInput[]
    skipDuplicates?: boolean
  }

  export type FacilityUpsertWithWhereUniqueWithoutFacility_typeInput = {
    where: FacilityWhereUniqueInput
    update: XOR<FacilityUpdateWithoutFacility_typeInput, FacilityUncheckedUpdateWithoutFacility_typeInput>
    create: XOR<FacilityCreateWithoutFacility_typeInput, FacilityUncheckedCreateWithoutFacility_typeInput>
  }

  export type FacilityUpdateWithWhereUniqueWithoutFacility_typeInput = {
    where: FacilityWhereUniqueInput
    data: XOR<FacilityUpdateWithoutFacility_typeInput, FacilityUncheckedUpdateWithoutFacility_typeInput>
  }

  export type FacilityUpdateManyWithWhereWithoutFacility_typeInput = {
    where: FacilityScalarWhereInput
    data: XOR<FacilityUpdateManyMutationInput, FacilityUncheckedUpdateManyWithoutFacility_typeInput>
  }

  export type DistrictCreateWithoutFacilitiesInput = {
    name: string
    created_at?: Date | string
    updated_at?: Date | string
    monthly_data?: MonthlyHealthDataCreateNestedManyWithoutDistrictInput
  }

  export type DistrictUncheckedCreateWithoutFacilitiesInput = {
    id?: number
    name: string
    created_at?: Date | string
    updated_at?: Date | string
    monthly_data?: MonthlyHealthDataUncheckedCreateNestedManyWithoutDistrictInput
  }

  export type DistrictCreateOrConnectWithoutFacilitiesInput = {
    where: DistrictWhereUniqueInput
    create: XOR<DistrictCreateWithoutFacilitiesInput, DistrictUncheckedCreateWithoutFacilitiesInput>
  }

  export type FacilityTypeCreateWithoutFacilitiesInput = {
    name: string
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type FacilityTypeUncheckedCreateWithoutFacilitiesInput = {
    id?: number
    name: string
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type FacilityTypeCreateOrConnectWithoutFacilitiesInput = {
    where: FacilityTypeWhereUniqueInput
    create: XOR<FacilityTypeCreateWithoutFacilitiesInput, FacilityTypeUncheckedCreateWithoutFacilitiesInput>
  }

  export type MonthlyHealthDataCreateWithoutFacilityInput = {
    report_month: string
    value?: Decimal | DecimalJsLike | number | string | null
    data_quality?: $Enums.DataQuality
    remarks?: string | null
    approved_at?: Date | string | null
    created_at?: Date | string
    updated_at?: Date | string
    achievement?: Decimal | DecimalJsLike | number | string | null
    denominator?: Decimal | DecimalJsLike | number | string | null
    numerator?: Decimal | DecimalJsLike | number | string | null
    target_value?: Decimal | DecimalJsLike | number | string | null
    approver?: UserCreateNestedOneWithoutApproved_dataInput
    district: DistrictCreateNestedOneWithoutMonthly_dataInput
    sub_centre?: sub_centreCreateNestedOneWithoutMonthly_health_dataInput
    indicator?: IndicatorCreateNestedOneWithoutMonthly_dataInput
    uploader: UserCreateNestedOneWithoutUploaded_dataInput
  }

  export type MonthlyHealthDataUncheckedCreateWithoutFacilityInput = {
    id?: number
    sub_centre_id?: number | null
    district_id: number
    indicator_id?: number | null
    report_month: string
    value?: Decimal | DecimalJsLike | number | string | null
    data_quality?: $Enums.DataQuality
    remarks?: string | null
    uploaded_by: number
    approved_by?: number | null
    approved_at?: Date | string | null
    created_at?: Date | string
    updated_at?: Date | string
    achievement?: Decimal | DecimalJsLike | number | string | null
    denominator?: Decimal | DecimalJsLike | number | string | null
    numerator?: Decimal | DecimalJsLike | number | string | null
    target_value?: Decimal | DecimalJsLike | number | string | null
  }

  export type MonthlyHealthDataCreateOrConnectWithoutFacilityInput = {
    where: MonthlyHealthDataWhereUniqueInput
    create: XOR<MonthlyHealthDataCreateWithoutFacilityInput, MonthlyHealthDataUncheckedCreateWithoutFacilityInput>
  }

  export type MonthlyHealthDataCreateManyFacilityInputEnvelope = {
    data: MonthlyHealthDataCreateManyFacilityInput | MonthlyHealthDataCreateManyFacilityInput[]
    skipDuplicates?: boolean
  }

  export type sub_centreCreateWithoutFacilityInput = {
    name: string
    created_at?: Date | string
    updated_at: Date | string
    facility_code?: string | null
    nin?: string | null
    monthly_health_data?: MonthlyHealthDataCreateNestedManyWithoutSub_centreInput
  }

  export type sub_centreUncheckedCreateWithoutFacilityInput = {
    id?: number
    name: string
    created_at?: Date | string
    updated_at: Date | string
    facility_code?: string | null
    nin?: string | null
    monthly_health_data?: MonthlyHealthDataUncheckedCreateNestedManyWithoutSub_centreInput
  }

  export type sub_centreCreateOrConnectWithoutFacilityInput = {
    where: sub_centreWhereUniqueInput
    create: XOR<sub_centreCreateWithoutFacilityInput, sub_centreUncheckedCreateWithoutFacilityInput>
  }

  export type sub_centreCreateManyFacilityInputEnvelope = {
    data: sub_centreCreateManyFacilityInput | sub_centreCreateManyFacilityInput[]
    skipDuplicates?: boolean
  }

  export type DistrictUpsertWithoutFacilitiesInput = {
    update: XOR<DistrictUpdateWithoutFacilitiesInput, DistrictUncheckedUpdateWithoutFacilitiesInput>
    create: XOR<DistrictCreateWithoutFacilitiesInput, DistrictUncheckedCreateWithoutFacilitiesInput>
    where?: DistrictWhereInput
  }

  export type DistrictUpdateToOneWithWhereWithoutFacilitiesInput = {
    where?: DistrictWhereInput
    data: XOR<DistrictUpdateWithoutFacilitiesInput, DistrictUncheckedUpdateWithoutFacilitiesInput>
  }

  export type DistrictUpdateWithoutFacilitiesInput = {
    name?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    monthly_data?: MonthlyHealthDataUpdateManyWithoutDistrictNestedInput
  }

  export type DistrictUncheckedUpdateWithoutFacilitiesInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    monthly_data?: MonthlyHealthDataUncheckedUpdateManyWithoutDistrictNestedInput
  }

  export type FacilityTypeUpsertWithoutFacilitiesInput = {
    update: XOR<FacilityTypeUpdateWithoutFacilitiesInput, FacilityTypeUncheckedUpdateWithoutFacilitiesInput>
    create: XOR<FacilityTypeCreateWithoutFacilitiesInput, FacilityTypeUncheckedCreateWithoutFacilitiesInput>
    where?: FacilityTypeWhereInput
  }

  export type FacilityTypeUpdateToOneWithWhereWithoutFacilitiesInput = {
    where?: FacilityTypeWhereInput
    data: XOR<FacilityTypeUpdateWithoutFacilitiesInput, FacilityTypeUncheckedUpdateWithoutFacilitiesInput>
  }

  export type FacilityTypeUpdateWithoutFacilitiesInput = {
    name?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FacilityTypeUncheckedUpdateWithoutFacilitiesInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MonthlyHealthDataUpsertWithWhereUniqueWithoutFacilityInput = {
    where: MonthlyHealthDataWhereUniqueInput
    update: XOR<MonthlyHealthDataUpdateWithoutFacilityInput, MonthlyHealthDataUncheckedUpdateWithoutFacilityInput>
    create: XOR<MonthlyHealthDataCreateWithoutFacilityInput, MonthlyHealthDataUncheckedCreateWithoutFacilityInput>
  }

  export type MonthlyHealthDataUpdateWithWhereUniqueWithoutFacilityInput = {
    where: MonthlyHealthDataWhereUniqueInput
    data: XOR<MonthlyHealthDataUpdateWithoutFacilityInput, MonthlyHealthDataUncheckedUpdateWithoutFacilityInput>
  }

  export type MonthlyHealthDataUpdateManyWithWhereWithoutFacilityInput = {
    where: MonthlyHealthDataScalarWhereInput
    data: XOR<MonthlyHealthDataUpdateManyMutationInput, MonthlyHealthDataUncheckedUpdateManyWithoutFacilityInput>
  }

  export type sub_centreUpsertWithWhereUniqueWithoutFacilityInput = {
    where: sub_centreWhereUniqueInput
    update: XOR<sub_centreUpdateWithoutFacilityInput, sub_centreUncheckedUpdateWithoutFacilityInput>
    create: XOR<sub_centreCreateWithoutFacilityInput, sub_centreUncheckedCreateWithoutFacilityInput>
  }

  export type sub_centreUpdateWithWhereUniqueWithoutFacilityInput = {
    where: sub_centreWhereUniqueInput
    data: XOR<sub_centreUpdateWithoutFacilityInput, sub_centreUncheckedUpdateWithoutFacilityInput>
  }

  export type sub_centreUpdateManyWithWhereWithoutFacilityInput = {
    where: sub_centreScalarWhereInput
    data: XOR<sub_centreUpdateManyMutationInput, sub_centreUncheckedUpdateManyWithoutFacilityInput>
  }

  export type sub_centreScalarWhereInput = {
    AND?: sub_centreScalarWhereInput | sub_centreScalarWhereInput[]
    OR?: sub_centreScalarWhereInput[]
    NOT?: sub_centreScalarWhereInput | sub_centreScalarWhereInput[]
    id?: IntFilter<"sub_centre"> | number
    name?: StringFilter<"sub_centre"> | string
    facility_id?: IntFilter<"sub_centre"> | number
    created_at?: DateTimeFilter<"sub_centre"> | Date | string
    updated_at?: DateTimeFilter<"sub_centre"> | Date | string
    facility_code?: StringNullableFilter<"sub_centre"> | string | null
    nin?: StringNullableFilter<"sub_centre"> | string | null
  }

  export type UserCreateWithoutApproved_dataInput = {
    username: string
    password_hash: string
    role?: $Enums.UserRole
    is_active?: boolean | null
    last_login?: Date | string | null
    created_at?: Date | string | null
    upload_sessions?: DataUploadSessionCreateNestedManyWithoutUploaderInput
    uploaded_data?: MonthlyHealthDataCreateNestedManyWithoutUploaderInput
  }

  export type UserUncheckedCreateWithoutApproved_dataInput = {
    id?: number
    username: string
    password_hash: string
    role?: $Enums.UserRole
    is_active?: boolean | null
    last_login?: Date | string | null
    created_at?: Date | string | null
    upload_sessions?: DataUploadSessionUncheckedCreateNestedManyWithoutUploaderInput
    uploaded_data?: MonthlyHealthDataUncheckedCreateNestedManyWithoutUploaderInput
  }

  export type UserCreateOrConnectWithoutApproved_dataInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutApproved_dataInput, UserUncheckedCreateWithoutApproved_dataInput>
  }

  export type DistrictCreateWithoutMonthly_dataInput = {
    name: string
    created_at?: Date | string
    updated_at?: Date | string
    facilities?: FacilityCreateNestedManyWithoutDistrictInput
  }

  export type DistrictUncheckedCreateWithoutMonthly_dataInput = {
    id?: number
    name: string
    created_at?: Date | string
    updated_at?: Date | string
    facilities?: FacilityUncheckedCreateNestedManyWithoutDistrictInput
  }

  export type DistrictCreateOrConnectWithoutMonthly_dataInput = {
    where: DistrictWhereUniqueInput
    create: XOR<DistrictCreateWithoutMonthly_dataInput, DistrictUncheckedCreateWithoutMonthly_dataInput>
  }

  export type FacilityCreateWithoutMonthly_dataInput = {
    name: string
    created_at?: Date | string
    updated_at?: Date | string
    facility_code?: string | null
    nin?: string | null
    district: DistrictCreateNestedOneWithoutFacilitiesInput
    facility_type: FacilityTypeCreateNestedOneWithoutFacilitiesInput
    sub_centre?: sub_centreCreateNestedManyWithoutFacilityInput
  }

  export type FacilityUncheckedCreateWithoutMonthly_dataInput = {
    id?: number
    name: string
    district_id: number
    facility_type_id: number
    created_at?: Date | string
    updated_at?: Date | string
    facility_code?: string | null
    nin?: string | null
    sub_centre?: sub_centreUncheckedCreateNestedManyWithoutFacilityInput
  }

  export type FacilityCreateOrConnectWithoutMonthly_dataInput = {
    where: FacilityWhereUniqueInput
    create: XOR<FacilityCreateWithoutMonthly_dataInput, FacilityUncheckedCreateWithoutMonthly_dataInput>
  }

  export type sub_centreCreateWithoutMonthly_health_dataInput = {
    name: string
    created_at?: Date | string
    updated_at: Date | string
    facility_code?: string | null
    nin?: string | null
    facility: FacilityCreateNestedOneWithoutSub_centreInput
  }

  export type sub_centreUncheckedCreateWithoutMonthly_health_dataInput = {
    id?: number
    name: string
    facility_id: number
    created_at?: Date | string
    updated_at: Date | string
    facility_code?: string | null
    nin?: string | null
  }

  export type sub_centreCreateOrConnectWithoutMonthly_health_dataInput = {
    where: sub_centreWhereUniqueInput
    create: XOR<sub_centreCreateWithoutMonthly_health_dataInput, sub_centreUncheckedCreateWithoutMonthly_health_dataInput>
  }

  export type IndicatorCreateWithoutMonthly_dataInput = {
    code: string
    name: string
    description?: string | null
    type: string
    structure?: NullableJsonNullValueInput | InputJsonValue
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type IndicatorUncheckedCreateWithoutMonthly_dataInput = {
    id?: number
    code: string
    name: string
    description?: string | null
    type: string
    structure?: NullableJsonNullValueInput | InputJsonValue
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type IndicatorCreateOrConnectWithoutMonthly_dataInput = {
    where: IndicatorWhereUniqueInput
    create: XOR<IndicatorCreateWithoutMonthly_dataInput, IndicatorUncheckedCreateWithoutMonthly_dataInput>
  }

  export type UserCreateWithoutUploaded_dataInput = {
    username: string
    password_hash: string
    role?: $Enums.UserRole
    is_active?: boolean | null
    last_login?: Date | string | null
    created_at?: Date | string | null
    upload_sessions?: DataUploadSessionCreateNestedManyWithoutUploaderInput
    approved_data?: MonthlyHealthDataCreateNestedManyWithoutApproverInput
  }

  export type UserUncheckedCreateWithoutUploaded_dataInput = {
    id?: number
    username: string
    password_hash: string
    role?: $Enums.UserRole
    is_active?: boolean | null
    last_login?: Date | string | null
    created_at?: Date | string | null
    upload_sessions?: DataUploadSessionUncheckedCreateNestedManyWithoutUploaderInput
    approved_data?: MonthlyHealthDataUncheckedCreateNestedManyWithoutApproverInput
  }

  export type UserCreateOrConnectWithoutUploaded_dataInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutUploaded_dataInput, UserUncheckedCreateWithoutUploaded_dataInput>
  }

  export type UserUpsertWithoutApproved_dataInput = {
    update: XOR<UserUpdateWithoutApproved_dataInput, UserUncheckedUpdateWithoutApproved_dataInput>
    create: XOR<UserCreateWithoutApproved_dataInput, UserUncheckedCreateWithoutApproved_dataInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutApproved_dataInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutApproved_dataInput, UserUncheckedUpdateWithoutApproved_dataInput>
  }

  export type UserUpdateWithoutApproved_dataInput = {
    username?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    is_active?: NullableBoolFieldUpdateOperationsInput | boolean | null
    last_login?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    upload_sessions?: DataUploadSessionUpdateManyWithoutUploaderNestedInput
    uploaded_data?: MonthlyHealthDataUpdateManyWithoutUploaderNestedInput
  }

  export type UserUncheckedUpdateWithoutApproved_dataInput = {
    id?: IntFieldUpdateOperationsInput | number
    username?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    is_active?: NullableBoolFieldUpdateOperationsInput | boolean | null
    last_login?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    upload_sessions?: DataUploadSessionUncheckedUpdateManyWithoutUploaderNestedInput
    uploaded_data?: MonthlyHealthDataUncheckedUpdateManyWithoutUploaderNestedInput
  }

  export type DistrictUpsertWithoutMonthly_dataInput = {
    update: XOR<DistrictUpdateWithoutMonthly_dataInput, DistrictUncheckedUpdateWithoutMonthly_dataInput>
    create: XOR<DistrictCreateWithoutMonthly_dataInput, DistrictUncheckedCreateWithoutMonthly_dataInput>
    where?: DistrictWhereInput
  }

  export type DistrictUpdateToOneWithWhereWithoutMonthly_dataInput = {
    where?: DistrictWhereInput
    data: XOR<DistrictUpdateWithoutMonthly_dataInput, DistrictUncheckedUpdateWithoutMonthly_dataInput>
  }

  export type DistrictUpdateWithoutMonthly_dataInput = {
    name?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    facilities?: FacilityUpdateManyWithoutDistrictNestedInput
  }

  export type DistrictUncheckedUpdateWithoutMonthly_dataInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    facilities?: FacilityUncheckedUpdateManyWithoutDistrictNestedInput
  }

  export type FacilityUpsertWithoutMonthly_dataInput = {
    update: XOR<FacilityUpdateWithoutMonthly_dataInput, FacilityUncheckedUpdateWithoutMonthly_dataInput>
    create: XOR<FacilityCreateWithoutMonthly_dataInput, FacilityUncheckedCreateWithoutMonthly_dataInput>
    where?: FacilityWhereInput
  }

  export type FacilityUpdateToOneWithWhereWithoutMonthly_dataInput = {
    where?: FacilityWhereInput
    data: XOR<FacilityUpdateWithoutMonthly_dataInput, FacilityUncheckedUpdateWithoutMonthly_dataInput>
  }

  export type FacilityUpdateWithoutMonthly_dataInput = {
    name?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    facility_code?: NullableStringFieldUpdateOperationsInput | string | null
    nin?: NullableStringFieldUpdateOperationsInput | string | null
    district?: DistrictUpdateOneRequiredWithoutFacilitiesNestedInput
    facility_type?: FacilityTypeUpdateOneRequiredWithoutFacilitiesNestedInput
    sub_centre?: sub_centreUpdateManyWithoutFacilityNestedInput
  }

  export type FacilityUncheckedUpdateWithoutMonthly_dataInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    district_id?: IntFieldUpdateOperationsInput | number
    facility_type_id?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    facility_code?: NullableStringFieldUpdateOperationsInput | string | null
    nin?: NullableStringFieldUpdateOperationsInput | string | null
    sub_centre?: sub_centreUncheckedUpdateManyWithoutFacilityNestedInput
  }

  export type sub_centreUpsertWithoutMonthly_health_dataInput = {
    update: XOR<sub_centreUpdateWithoutMonthly_health_dataInput, sub_centreUncheckedUpdateWithoutMonthly_health_dataInput>
    create: XOR<sub_centreCreateWithoutMonthly_health_dataInput, sub_centreUncheckedCreateWithoutMonthly_health_dataInput>
    where?: sub_centreWhereInput
  }

  export type sub_centreUpdateToOneWithWhereWithoutMonthly_health_dataInput = {
    where?: sub_centreWhereInput
    data: XOR<sub_centreUpdateWithoutMonthly_health_dataInput, sub_centreUncheckedUpdateWithoutMonthly_health_dataInput>
  }

  export type sub_centreUpdateWithoutMonthly_health_dataInput = {
    name?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    facility_code?: NullableStringFieldUpdateOperationsInput | string | null
    nin?: NullableStringFieldUpdateOperationsInput | string | null
    facility?: FacilityUpdateOneRequiredWithoutSub_centreNestedInput
  }

  export type sub_centreUncheckedUpdateWithoutMonthly_health_dataInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    facility_id?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    facility_code?: NullableStringFieldUpdateOperationsInput | string | null
    nin?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type IndicatorUpsertWithoutMonthly_dataInput = {
    update: XOR<IndicatorUpdateWithoutMonthly_dataInput, IndicatorUncheckedUpdateWithoutMonthly_dataInput>
    create: XOR<IndicatorCreateWithoutMonthly_dataInput, IndicatorUncheckedCreateWithoutMonthly_dataInput>
    where?: IndicatorWhereInput
  }

  export type IndicatorUpdateToOneWithWhereWithoutMonthly_dataInput = {
    where?: IndicatorWhereInput
    data: XOR<IndicatorUpdateWithoutMonthly_dataInput, IndicatorUncheckedUpdateWithoutMonthly_dataInput>
  }

  export type IndicatorUpdateWithoutMonthly_dataInput = {
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    type?: StringFieldUpdateOperationsInput | string
    structure?: NullableJsonNullValueInput | InputJsonValue
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type IndicatorUncheckedUpdateWithoutMonthly_dataInput = {
    id?: IntFieldUpdateOperationsInput | number
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    type?: StringFieldUpdateOperationsInput | string
    structure?: NullableJsonNullValueInput | InputJsonValue
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUpsertWithoutUploaded_dataInput = {
    update: XOR<UserUpdateWithoutUploaded_dataInput, UserUncheckedUpdateWithoutUploaded_dataInput>
    create: XOR<UserCreateWithoutUploaded_dataInput, UserUncheckedCreateWithoutUploaded_dataInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutUploaded_dataInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutUploaded_dataInput, UserUncheckedUpdateWithoutUploaded_dataInput>
  }

  export type UserUpdateWithoutUploaded_dataInput = {
    username?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    is_active?: NullableBoolFieldUpdateOperationsInput | boolean | null
    last_login?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    upload_sessions?: DataUploadSessionUpdateManyWithoutUploaderNestedInput
    approved_data?: MonthlyHealthDataUpdateManyWithoutApproverNestedInput
  }

  export type UserUncheckedUpdateWithoutUploaded_dataInput = {
    id?: IntFieldUpdateOperationsInput | number
    username?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    is_active?: NullableBoolFieldUpdateOperationsInput | boolean | null
    last_login?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    upload_sessions?: DataUploadSessionUncheckedUpdateManyWithoutUploaderNestedInput
    approved_data?: MonthlyHealthDataUncheckedUpdateManyWithoutApproverNestedInput
  }

  export type UserCreateWithoutUpload_sessionsInput = {
    username: string
    password_hash: string
    role?: $Enums.UserRole
    is_active?: boolean | null
    last_login?: Date | string | null
    created_at?: Date | string | null
    approved_data?: MonthlyHealthDataCreateNestedManyWithoutApproverInput
    uploaded_data?: MonthlyHealthDataCreateNestedManyWithoutUploaderInput
  }

  export type UserUncheckedCreateWithoutUpload_sessionsInput = {
    id?: number
    username: string
    password_hash: string
    role?: $Enums.UserRole
    is_active?: boolean | null
    last_login?: Date | string | null
    created_at?: Date | string | null
    approved_data?: MonthlyHealthDataUncheckedCreateNestedManyWithoutApproverInput
    uploaded_data?: MonthlyHealthDataUncheckedCreateNestedManyWithoutUploaderInput
  }

  export type UserCreateOrConnectWithoutUpload_sessionsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutUpload_sessionsInput, UserUncheckedCreateWithoutUpload_sessionsInput>
  }

  export type UserUpsertWithoutUpload_sessionsInput = {
    update: XOR<UserUpdateWithoutUpload_sessionsInput, UserUncheckedUpdateWithoutUpload_sessionsInput>
    create: XOR<UserCreateWithoutUpload_sessionsInput, UserUncheckedCreateWithoutUpload_sessionsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutUpload_sessionsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutUpload_sessionsInput, UserUncheckedUpdateWithoutUpload_sessionsInput>
  }

  export type UserUpdateWithoutUpload_sessionsInput = {
    username?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    is_active?: NullableBoolFieldUpdateOperationsInput | boolean | null
    last_login?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    approved_data?: MonthlyHealthDataUpdateManyWithoutApproverNestedInput
    uploaded_data?: MonthlyHealthDataUpdateManyWithoutUploaderNestedInput
  }

  export type UserUncheckedUpdateWithoutUpload_sessionsInput = {
    id?: IntFieldUpdateOperationsInput | number
    username?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    is_active?: NullableBoolFieldUpdateOperationsInput | boolean | null
    last_login?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    approved_data?: MonthlyHealthDataUncheckedUpdateManyWithoutApproverNestedInput
    uploaded_data?: MonthlyHealthDataUncheckedUpdateManyWithoutUploaderNestedInput
  }

  export type MonthlyHealthDataCreateWithoutIndicatorInput = {
    report_month: string
    value?: Decimal | DecimalJsLike | number | string | null
    data_quality?: $Enums.DataQuality
    remarks?: string | null
    approved_at?: Date | string | null
    created_at?: Date | string
    updated_at?: Date | string
    achievement?: Decimal | DecimalJsLike | number | string | null
    denominator?: Decimal | DecimalJsLike | number | string | null
    numerator?: Decimal | DecimalJsLike | number | string | null
    target_value?: Decimal | DecimalJsLike | number | string | null
    approver?: UserCreateNestedOneWithoutApproved_dataInput
    district: DistrictCreateNestedOneWithoutMonthly_dataInput
    facility?: FacilityCreateNestedOneWithoutMonthly_dataInput
    sub_centre?: sub_centreCreateNestedOneWithoutMonthly_health_dataInput
    uploader: UserCreateNestedOneWithoutUploaded_dataInput
  }

  export type MonthlyHealthDataUncheckedCreateWithoutIndicatorInput = {
    id?: number
    facility_id?: number | null
    sub_centre_id?: number | null
    district_id: number
    report_month: string
    value?: Decimal | DecimalJsLike | number | string | null
    data_quality?: $Enums.DataQuality
    remarks?: string | null
    uploaded_by: number
    approved_by?: number | null
    approved_at?: Date | string | null
    created_at?: Date | string
    updated_at?: Date | string
    achievement?: Decimal | DecimalJsLike | number | string | null
    denominator?: Decimal | DecimalJsLike | number | string | null
    numerator?: Decimal | DecimalJsLike | number | string | null
    target_value?: Decimal | DecimalJsLike | number | string | null
  }

  export type MonthlyHealthDataCreateOrConnectWithoutIndicatorInput = {
    where: MonthlyHealthDataWhereUniqueInput
    create: XOR<MonthlyHealthDataCreateWithoutIndicatorInput, MonthlyHealthDataUncheckedCreateWithoutIndicatorInput>
  }

  export type MonthlyHealthDataCreateManyIndicatorInputEnvelope = {
    data: MonthlyHealthDataCreateManyIndicatorInput | MonthlyHealthDataCreateManyIndicatorInput[]
    skipDuplicates?: boolean
  }

  export type MonthlyHealthDataUpsertWithWhereUniqueWithoutIndicatorInput = {
    where: MonthlyHealthDataWhereUniqueInput
    update: XOR<MonthlyHealthDataUpdateWithoutIndicatorInput, MonthlyHealthDataUncheckedUpdateWithoutIndicatorInput>
    create: XOR<MonthlyHealthDataCreateWithoutIndicatorInput, MonthlyHealthDataUncheckedCreateWithoutIndicatorInput>
  }

  export type MonthlyHealthDataUpdateWithWhereUniqueWithoutIndicatorInput = {
    where: MonthlyHealthDataWhereUniqueInput
    data: XOR<MonthlyHealthDataUpdateWithoutIndicatorInput, MonthlyHealthDataUncheckedUpdateWithoutIndicatorInput>
  }

  export type MonthlyHealthDataUpdateManyWithWhereWithoutIndicatorInput = {
    where: MonthlyHealthDataScalarWhereInput
    data: XOR<MonthlyHealthDataUpdateManyMutationInput, MonthlyHealthDataUncheckedUpdateManyWithoutIndicatorInput>
  }

  export type MonthlyHealthDataCreateWithoutSub_centreInput = {
    report_month: string
    value?: Decimal | DecimalJsLike | number | string | null
    data_quality?: $Enums.DataQuality
    remarks?: string | null
    approved_at?: Date | string | null
    created_at?: Date | string
    updated_at?: Date | string
    achievement?: Decimal | DecimalJsLike | number | string | null
    denominator?: Decimal | DecimalJsLike | number | string | null
    numerator?: Decimal | DecimalJsLike | number | string | null
    target_value?: Decimal | DecimalJsLike | number | string | null
    approver?: UserCreateNestedOneWithoutApproved_dataInput
    district: DistrictCreateNestedOneWithoutMonthly_dataInput
    facility?: FacilityCreateNestedOneWithoutMonthly_dataInput
    indicator?: IndicatorCreateNestedOneWithoutMonthly_dataInput
    uploader: UserCreateNestedOneWithoutUploaded_dataInput
  }

  export type MonthlyHealthDataUncheckedCreateWithoutSub_centreInput = {
    id?: number
    facility_id?: number | null
    district_id: number
    indicator_id?: number | null
    report_month: string
    value?: Decimal | DecimalJsLike | number | string | null
    data_quality?: $Enums.DataQuality
    remarks?: string | null
    uploaded_by: number
    approved_by?: number | null
    approved_at?: Date | string | null
    created_at?: Date | string
    updated_at?: Date | string
    achievement?: Decimal | DecimalJsLike | number | string | null
    denominator?: Decimal | DecimalJsLike | number | string | null
    numerator?: Decimal | DecimalJsLike | number | string | null
    target_value?: Decimal | DecimalJsLike | number | string | null
  }

  export type MonthlyHealthDataCreateOrConnectWithoutSub_centreInput = {
    where: MonthlyHealthDataWhereUniqueInput
    create: XOR<MonthlyHealthDataCreateWithoutSub_centreInput, MonthlyHealthDataUncheckedCreateWithoutSub_centreInput>
  }

  export type MonthlyHealthDataCreateManySub_centreInputEnvelope = {
    data: MonthlyHealthDataCreateManySub_centreInput | MonthlyHealthDataCreateManySub_centreInput[]
    skipDuplicates?: boolean
  }

  export type FacilityCreateWithoutSub_centreInput = {
    name: string
    created_at?: Date | string
    updated_at?: Date | string
    facility_code?: string | null
    nin?: string | null
    district: DistrictCreateNestedOneWithoutFacilitiesInput
    facility_type: FacilityTypeCreateNestedOneWithoutFacilitiesInput
    monthly_data?: MonthlyHealthDataCreateNestedManyWithoutFacilityInput
  }

  export type FacilityUncheckedCreateWithoutSub_centreInput = {
    id?: number
    name: string
    district_id: number
    facility_type_id: number
    created_at?: Date | string
    updated_at?: Date | string
    facility_code?: string | null
    nin?: string | null
    monthly_data?: MonthlyHealthDataUncheckedCreateNestedManyWithoutFacilityInput
  }

  export type FacilityCreateOrConnectWithoutSub_centreInput = {
    where: FacilityWhereUniqueInput
    create: XOR<FacilityCreateWithoutSub_centreInput, FacilityUncheckedCreateWithoutSub_centreInput>
  }

  export type MonthlyHealthDataUpsertWithWhereUniqueWithoutSub_centreInput = {
    where: MonthlyHealthDataWhereUniqueInput
    update: XOR<MonthlyHealthDataUpdateWithoutSub_centreInput, MonthlyHealthDataUncheckedUpdateWithoutSub_centreInput>
    create: XOR<MonthlyHealthDataCreateWithoutSub_centreInput, MonthlyHealthDataUncheckedCreateWithoutSub_centreInput>
  }

  export type MonthlyHealthDataUpdateWithWhereUniqueWithoutSub_centreInput = {
    where: MonthlyHealthDataWhereUniqueInput
    data: XOR<MonthlyHealthDataUpdateWithoutSub_centreInput, MonthlyHealthDataUncheckedUpdateWithoutSub_centreInput>
  }

  export type MonthlyHealthDataUpdateManyWithWhereWithoutSub_centreInput = {
    where: MonthlyHealthDataScalarWhereInput
    data: XOR<MonthlyHealthDataUpdateManyMutationInput, MonthlyHealthDataUncheckedUpdateManyWithoutSub_centreInput>
  }

  export type FacilityUpsertWithoutSub_centreInput = {
    update: XOR<FacilityUpdateWithoutSub_centreInput, FacilityUncheckedUpdateWithoutSub_centreInput>
    create: XOR<FacilityCreateWithoutSub_centreInput, FacilityUncheckedCreateWithoutSub_centreInput>
    where?: FacilityWhereInput
  }

  export type FacilityUpdateToOneWithWhereWithoutSub_centreInput = {
    where?: FacilityWhereInput
    data: XOR<FacilityUpdateWithoutSub_centreInput, FacilityUncheckedUpdateWithoutSub_centreInput>
  }

  export type FacilityUpdateWithoutSub_centreInput = {
    name?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    facility_code?: NullableStringFieldUpdateOperationsInput | string | null
    nin?: NullableStringFieldUpdateOperationsInput | string | null
    district?: DistrictUpdateOneRequiredWithoutFacilitiesNestedInput
    facility_type?: FacilityTypeUpdateOneRequiredWithoutFacilitiesNestedInput
    monthly_data?: MonthlyHealthDataUpdateManyWithoutFacilityNestedInput
  }

  export type FacilityUncheckedUpdateWithoutSub_centreInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    district_id?: IntFieldUpdateOperationsInput | number
    facility_type_id?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    facility_code?: NullableStringFieldUpdateOperationsInput | string | null
    nin?: NullableStringFieldUpdateOperationsInput | string | null
    monthly_data?: MonthlyHealthDataUncheckedUpdateManyWithoutFacilityNestedInput
  }

  export type DataUploadSessionCreateManyUploaderInput = {
    id?: number
    file_name: string
    file_path?: string | null
    report_month: string
    total_records: number
    success_count?: number
    error_count?: number
    status?: $Enums.UploadStatus
    upload_summary?: NullableJsonNullValueInput | InputJsonValue
    created_at?: Date | string
    completed_at?: Date | string | null
  }

  export type MonthlyHealthDataCreateManyApproverInput = {
    id?: number
    facility_id?: number | null
    sub_centre_id?: number | null
    district_id: number
    indicator_id?: number | null
    report_month: string
    value?: Decimal | DecimalJsLike | number | string | null
    data_quality?: $Enums.DataQuality
    remarks?: string | null
    uploaded_by: number
    approved_at?: Date | string | null
    created_at?: Date | string
    updated_at?: Date | string
    achievement?: Decimal | DecimalJsLike | number | string | null
    denominator?: Decimal | DecimalJsLike | number | string | null
    numerator?: Decimal | DecimalJsLike | number | string | null
    target_value?: Decimal | DecimalJsLike | number | string | null
  }

  export type MonthlyHealthDataCreateManyUploaderInput = {
    id?: number
    facility_id?: number | null
    sub_centre_id?: number | null
    district_id: number
    indicator_id?: number | null
    report_month: string
    value?: Decimal | DecimalJsLike | number | string | null
    data_quality?: $Enums.DataQuality
    remarks?: string | null
    approved_by?: number | null
    approved_at?: Date | string | null
    created_at?: Date | string
    updated_at?: Date | string
    achievement?: Decimal | DecimalJsLike | number | string | null
    denominator?: Decimal | DecimalJsLike | number | string | null
    numerator?: Decimal | DecimalJsLike | number | string | null
    target_value?: Decimal | DecimalJsLike | number | string | null
  }

  export type DataUploadSessionUpdateWithoutUploaderInput = {
    file_name?: StringFieldUpdateOperationsInput | string
    file_path?: NullableStringFieldUpdateOperationsInput | string | null
    report_month?: StringFieldUpdateOperationsInput | string
    total_records?: IntFieldUpdateOperationsInput | number
    success_count?: IntFieldUpdateOperationsInput | number
    error_count?: IntFieldUpdateOperationsInput | number
    status?: EnumUploadStatusFieldUpdateOperationsInput | $Enums.UploadStatus
    upload_summary?: NullableJsonNullValueInput | InputJsonValue
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    completed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type DataUploadSessionUncheckedUpdateWithoutUploaderInput = {
    id?: IntFieldUpdateOperationsInput | number
    file_name?: StringFieldUpdateOperationsInput | string
    file_path?: NullableStringFieldUpdateOperationsInput | string | null
    report_month?: StringFieldUpdateOperationsInput | string
    total_records?: IntFieldUpdateOperationsInput | number
    success_count?: IntFieldUpdateOperationsInput | number
    error_count?: IntFieldUpdateOperationsInput | number
    status?: EnumUploadStatusFieldUpdateOperationsInput | $Enums.UploadStatus
    upload_summary?: NullableJsonNullValueInput | InputJsonValue
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    completed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type DataUploadSessionUncheckedUpdateManyWithoutUploaderInput = {
    id?: IntFieldUpdateOperationsInput | number
    file_name?: StringFieldUpdateOperationsInput | string
    file_path?: NullableStringFieldUpdateOperationsInput | string | null
    report_month?: StringFieldUpdateOperationsInput | string
    total_records?: IntFieldUpdateOperationsInput | number
    success_count?: IntFieldUpdateOperationsInput | number
    error_count?: IntFieldUpdateOperationsInput | number
    status?: EnumUploadStatusFieldUpdateOperationsInput | $Enums.UploadStatus
    upload_summary?: NullableJsonNullValueInput | InputJsonValue
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    completed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type MonthlyHealthDataUpdateWithoutApproverInput = {
    report_month?: StringFieldUpdateOperationsInput | string
    value?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    data_quality?: EnumDataQualityFieldUpdateOperationsInput | $Enums.DataQuality
    remarks?: NullableStringFieldUpdateOperationsInput | string | null
    approved_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    achievement?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    denominator?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    numerator?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    target_value?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    district?: DistrictUpdateOneRequiredWithoutMonthly_dataNestedInput
    facility?: FacilityUpdateOneWithoutMonthly_dataNestedInput
    sub_centre?: sub_centreUpdateOneWithoutMonthly_health_dataNestedInput
    indicator?: IndicatorUpdateOneWithoutMonthly_dataNestedInput
    uploader?: UserUpdateOneRequiredWithoutUploaded_dataNestedInput
  }

  export type MonthlyHealthDataUncheckedUpdateWithoutApproverInput = {
    id?: IntFieldUpdateOperationsInput | number
    facility_id?: NullableIntFieldUpdateOperationsInput | number | null
    sub_centre_id?: NullableIntFieldUpdateOperationsInput | number | null
    district_id?: IntFieldUpdateOperationsInput | number
    indicator_id?: NullableIntFieldUpdateOperationsInput | number | null
    report_month?: StringFieldUpdateOperationsInput | string
    value?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    data_quality?: EnumDataQualityFieldUpdateOperationsInput | $Enums.DataQuality
    remarks?: NullableStringFieldUpdateOperationsInput | string | null
    uploaded_by?: IntFieldUpdateOperationsInput | number
    approved_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    achievement?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    denominator?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    numerator?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    target_value?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
  }

  export type MonthlyHealthDataUncheckedUpdateManyWithoutApproverInput = {
    id?: IntFieldUpdateOperationsInput | number
    facility_id?: NullableIntFieldUpdateOperationsInput | number | null
    sub_centre_id?: NullableIntFieldUpdateOperationsInput | number | null
    district_id?: IntFieldUpdateOperationsInput | number
    indicator_id?: NullableIntFieldUpdateOperationsInput | number | null
    report_month?: StringFieldUpdateOperationsInput | string
    value?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    data_quality?: EnumDataQualityFieldUpdateOperationsInput | $Enums.DataQuality
    remarks?: NullableStringFieldUpdateOperationsInput | string | null
    uploaded_by?: IntFieldUpdateOperationsInput | number
    approved_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    achievement?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    denominator?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    numerator?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    target_value?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
  }

  export type MonthlyHealthDataUpdateWithoutUploaderInput = {
    report_month?: StringFieldUpdateOperationsInput | string
    value?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    data_quality?: EnumDataQualityFieldUpdateOperationsInput | $Enums.DataQuality
    remarks?: NullableStringFieldUpdateOperationsInput | string | null
    approved_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    achievement?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    denominator?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    numerator?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    target_value?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    approver?: UserUpdateOneWithoutApproved_dataNestedInput
    district?: DistrictUpdateOneRequiredWithoutMonthly_dataNestedInput
    facility?: FacilityUpdateOneWithoutMonthly_dataNestedInput
    sub_centre?: sub_centreUpdateOneWithoutMonthly_health_dataNestedInput
    indicator?: IndicatorUpdateOneWithoutMonthly_dataNestedInput
  }

  export type MonthlyHealthDataUncheckedUpdateWithoutUploaderInput = {
    id?: IntFieldUpdateOperationsInput | number
    facility_id?: NullableIntFieldUpdateOperationsInput | number | null
    sub_centre_id?: NullableIntFieldUpdateOperationsInput | number | null
    district_id?: IntFieldUpdateOperationsInput | number
    indicator_id?: NullableIntFieldUpdateOperationsInput | number | null
    report_month?: StringFieldUpdateOperationsInput | string
    value?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    data_quality?: EnumDataQualityFieldUpdateOperationsInput | $Enums.DataQuality
    remarks?: NullableStringFieldUpdateOperationsInput | string | null
    approved_by?: NullableIntFieldUpdateOperationsInput | number | null
    approved_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    achievement?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    denominator?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    numerator?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    target_value?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
  }

  export type MonthlyHealthDataUncheckedUpdateManyWithoutUploaderInput = {
    id?: IntFieldUpdateOperationsInput | number
    facility_id?: NullableIntFieldUpdateOperationsInput | number | null
    sub_centre_id?: NullableIntFieldUpdateOperationsInput | number | null
    district_id?: IntFieldUpdateOperationsInput | number
    indicator_id?: NullableIntFieldUpdateOperationsInput | number | null
    report_month?: StringFieldUpdateOperationsInput | string
    value?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    data_quality?: EnumDataQualityFieldUpdateOperationsInput | $Enums.DataQuality
    remarks?: NullableStringFieldUpdateOperationsInput | string | null
    approved_by?: NullableIntFieldUpdateOperationsInput | number | null
    approved_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    achievement?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    denominator?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    numerator?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    target_value?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
  }

  export type FacilityCreateManyDistrictInput = {
    id?: number
    name: string
    facility_type_id: number
    created_at?: Date | string
    updated_at?: Date | string
    facility_code?: string | null
    nin?: string | null
  }

  export type MonthlyHealthDataCreateManyDistrictInput = {
    id?: number
    facility_id?: number | null
    sub_centre_id?: number | null
    indicator_id?: number | null
    report_month: string
    value?: Decimal | DecimalJsLike | number | string | null
    data_quality?: $Enums.DataQuality
    remarks?: string | null
    uploaded_by: number
    approved_by?: number | null
    approved_at?: Date | string | null
    created_at?: Date | string
    updated_at?: Date | string
    achievement?: Decimal | DecimalJsLike | number | string | null
    denominator?: Decimal | DecimalJsLike | number | string | null
    numerator?: Decimal | DecimalJsLike | number | string | null
    target_value?: Decimal | DecimalJsLike | number | string | null
  }

  export type FacilityUpdateWithoutDistrictInput = {
    name?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    facility_code?: NullableStringFieldUpdateOperationsInput | string | null
    nin?: NullableStringFieldUpdateOperationsInput | string | null
    facility_type?: FacilityTypeUpdateOneRequiredWithoutFacilitiesNestedInput
    monthly_data?: MonthlyHealthDataUpdateManyWithoutFacilityNestedInput
    sub_centre?: sub_centreUpdateManyWithoutFacilityNestedInput
  }

  export type FacilityUncheckedUpdateWithoutDistrictInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    facility_type_id?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    facility_code?: NullableStringFieldUpdateOperationsInput | string | null
    nin?: NullableStringFieldUpdateOperationsInput | string | null
    monthly_data?: MonthlyHealthDataUncheckedUpdateManyWithoutFacilityNestedInput
    sub_centre?: sub_centreUncheckedUpdateManyWithoutFacilityNestedInput
  }

  export type FacilityUncheckedUpdateManyWithoutDistrictInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    facility_type_id?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    facility_code?: NullableStringFieldUpdateOperationsInput | string | null
    nin?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type MonthlyHealthDataUpdateWithoutDistrictInput = {
    report_month?: StringFieldUpdateOperationsInput | string
    value?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    data_quality?: EnumDataQualityFieldUpdateOperationsInput | $Enums.DataQuality
    remarks?: NullableStringFieldUpdateOperationsInput | string | null
    approved_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    achievement?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    denominator?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    numerator?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    target_value?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    approver?: UserUpdateOneWithoutApproved_dataNestedInput
    facility?: FacilityUpdateOneWithoutMonthly_dataNestedInput
    sub_centre?: sub_centreUpdateOneWithoutMonthly_health_dataNestedInput
    indicator?: IndicatorUpdateOneWithoutMonthly_dataNestedInput
    uploader?: UserUpdateOneRequiredWithoutUploaded_dataNestedInput
  }

  export type MonthlyHealthDataUncheckedUpdateWithoutDistrictInput = {
    id?: IntFieldUpdateOperationsInput | number
    facility_id?: NullableIntFieldUpdateOperationsInput | number | null
    sub_centre_id?: NullableIntFieldUpdateOperationsInput | number | null
    indicator_id?: NullableIntFieldUpdateOperationsInput | number | null
    report_month?: StringFieldUpdateOperationsInput | string
    value?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    data_quality?: EnumDataQualityFieldUpdateOperationsInput | $Enums.DataQuality
    remarks?: NullableStringFieldUpdateOperationsInput | string | null
    uploaded_by?: IntFieldUpdateOperationsInput | number
    approved_by?: NullableIntFieldUpdateOperationsInput | number | null
    approved_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    achievement?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    denominator?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    numerator?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    target_value?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
  }

  export type MonthlyHealthDataUncheckedUpdateManyWithoutDistrictInput = {
    id?: IntFieldUpdateOperationsInput | number
    facility_id?: NullableIntFieldUpdateOperationsInput | number | null
    sub_centre_id?: NullableIntFieldUpdateOperationsInput | number | null
    indicator_id?: NullableIntFieldUpdateOperationsInput | number | null
    report_month?: StringFieldUpdateOperationsInput | string
    value?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    data_quality?: EnumDataQualityFieldUpdateOperationsInput | $Enums.DataQuality
    remarks?: NullableStringFieldUpdateOperationsInput | string | null
    uploaded_by?: IntFieldUpdateOperationsInput | number
    approved_by?: NullableIntFieldUpdateOperationsInput | number | null
    approved_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    achievement?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    denominator?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    numerator?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    target_value?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
  }

  export type FacilityCreateManyFacility_typeInput = {
    id?: number
    name: string
    district_id: number
    created_at?: Date | string
    updated_at?: Date | string
    facility_code?: string | null
    nin?: string | null
  }

  export type FacilityUpdateWithoutFacility_typeInput = {
    name?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    facility_code?: NullableStringFieldUpdateOperationsInput | string | null
    nin?: NullableStringFieldUpdateOperationsInput | string | null
    district?: DistrictUpdateOneRequiredWithoutFacilitiesNestedInput
    monthly_data?: MonthlyHealthDataUpdateManyWithoutFacilityNestedInput
    sub_centre?: sub_centreUpdateManyWithoutFacilityNestedInput
  }

  export type FacilityUncheckedUpdateWithoutFacility_typeInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    district_id?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    facility_code?: NullableStringFieldUpdateOperationsInput | string | null
    nin?: NullableStringFieldUpdateOperationsInput | string | null
    monthly_data?: MonthlyHealthDataUncheckedUpdateManyWithoutFacilityNestedInput
    sub_centre?: sub_centreUncheckedUpdateManyWithoutFacilityNestedInput
  }

  export type FacilityUncheckedUpdateManyWithoutFacility_typeInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    district_id?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    facility_code?: NullableStringFieldUpdateOperationsInput | string | null
    nin?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type MonthlyHealthDataCreateManyFacilityInput = {
    id?: number
    sub_centre_id?: number | null
    district_id: number
    indicator_id?: number | null
    report_month: string
    value?: Decimal | DecimalJsLike | number | string | null
    data_quality?: $Enums.DataQuality
    remarks?: string | null
    uploaded_by: number
    approved_by?: number | null
    approved_at?: Date | string | null
    created_at?: Date | string
    updated_at?: Date | string
    achievement?: Decimal | DecimalJsLike | number | string | null
    denominator?: Decimal | DecimalJsLike | number | string | null
    numerator?: Decimal | DecimalJsLike | number | string | null
    target_value?: Decimal | DecimalJsLike | number | string | null
  }

  export type sub_centreCreateManyFacilityInput = {
    id?: number
    name: string
    created_at?: Date | string
    updated_at: Date | string
    facility_code?: string | null
    nin?: string | null
  }

  export type MonthlyHealthDataUpdateWithoutFacilityInput = {
    report_month?: StringFieldUpdateOperationsInput | string
    value?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    data_quality?: EnumDataQualityFieldUpdateOperationsInput | $Enums.DataQuality
    remarks?: NullableStringFieldUpdateOperationsInput | string | null
    approved_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    achievement?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    denominator?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    numerator?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    target_value?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    approver?: UserUpdateOneWithoutApproved_dataNestedInput
    district?: DistrictUpdateOneRequiredWithoutMonthly_dataNestedInput
    sub_centre?: sub_centreUpdateOneWithoutMonthly_health_dataNestedInput
    indicator?: IndicatorUpdateOneWithoutMonthly_dataNestedInput
    uploader?: UserUpdateOneRequiredWithoutUploaded_dataNestedInput
  }

  export type MonthlyHealthDataUncheckedUpdateWithoutFacilityInput = {
    id?: IntFieldUpdateOperationsInput | number
    sub_centre_id?: NullableIntFieldUpdateOperationsInput | number | null
    district_id?: IntFieldUpdateOperationsInput | number
    indicator_id?: NullableIntFieldUpdateOperationsInput | number | null
    report_month?: StringFieldUpdateOperationsInput | string
    value?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    data_quality?: EnumDataQualityFieldUpdateOperationsInput | $Enums.DataQuality
    remarks?: NullableStringFieldUpdateOperationsInput | string | null
    uploaded_by?: IntFieldUpdateOperationsInput | number
    approved_by?: NullableIntFieldUpdateOperationsInput | number | null
    approved_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    achievement?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    denominator?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    numerator?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    target_value?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
  }

  export type MonthlyHealthDataUncheckedUpdateManyWithoutFacilityInput = {
    id?: IntFieldUpdateOperationsInput | number
    sub_centre_id?: NullableIntFieldUpdateOperationsInput | number | null
    district_id?: IntFieldUpdateOperationsInput | number
    indicator_id?: NullableIntFieldUpdateOperationsInput | number | null
    report_month?: StringFieldUpdateOperationsInput | string
    value?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    data_quality?: EnumDataQualityFieldUpdateOperationsInput | $Enums.DataQuality
    remarks?: NullableStringFieldUpdateOperationsInput | string | null
    uploaded_by?: IntFieldUpdateOperationsInput | number
    approved_by?: NullableIntFieldUpdateOperationsInput | number | null
    approved_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    achievement?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    denominator?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    numerator?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    target_value?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
  }

  export type sub_centreUpdateWithoutFacilityInput = {
    name?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    facility_code?: NullableStringFieldUpdateOperationsInput | string | null
    nin?: NullableStringFieldUpdateOperationsInput | string | null
    monthly_health_data?: MonthlyHealthDataUpdateManyWithoutSub_centreNestedInput
  }

  export type sub_centreUncheckedUpdateWithoutFacilityInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    facility_code?: NullableStringFieldUpdateOperationsInput | string | null
    nin?: NullableStringFieldUpdateOperationsInput | string | null
    monthly_health_data?: MonthlyHealthDataUncheckedUpdateManyWithoutSub_centreNestedInput
  }

  export type sub_centreUncheckedUpdateManyWithoutFacilityInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    facility_code?: NullableStringFieldUpdateOperationsInput | string | null
    nin?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type MonthlyHealthDataCreateManyIndicatorInput = {
    id?: number
    facility_id?: number | null
    sub_centre_id?: number | null
    district_id: number
    report_month: string
    value?: Decimal | DecimalJsLike | number | string | null
    data_quality?: $Enums.DataQuality
    remarks?: string | null
    uploaded_by: number
    approved_by?: number | null
    approved_at?: Date | string | null
    created_at?: Date | string
    updated_at?: Date | string
    achievement?: Decimal | DecimalJsLike | number | string | null
    denominator?: Decimal | DecimalJsLike | number | string | null
    numerator?: Decimal | DecimalJsLike | number | string | null
    target_value?: Decimal | DecimalJsLike | number | string | null
  }

  export type MonthlyHealthDataUpdateWithoutIndicatorInput = {
    report_month?: StringFieldUpdateOperationsInput | string
    value?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    data_quality?: EnumDataQualityFieldUpdateOperationsInput | $Enums.DataQuality
    remarks?: NullableStringFieldUpdateOperationsInput | string | null
    approved_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    achievement?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    denominator?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    numerator?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    target_value?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    approver?: UserUpdateOneWithoutApproved_dataNestedInput
    district?: DistrictUpdateOneRequiredWithoutMonthly_dataNestedInput
    facility?: FacilityUpdateOneWithoutMonthly_dataNestedInput
    sub_centre?: sub_centreUpdateOneWithoutMonthly_health_dataNestedInput
    uploader?: UserUpdateOneRequiredWithoutUploaded_dataNestedInput
  }

  export type MonthlyHealthDataUncheckedUpdateWithoutIndicatorInput = {
    id?: IntFieldUpdateOperationsInput | number
    facility_id?: NullableIntFieldUpdateOperationsInput | number | null
    sub_centre_id?: NullableIntFieldUpdateOperationsInput | number | null
    district_id?: IntFieldUpdateOperationsInput | number
    report_month?: StringFieldUpdateOperationsInput | string
    value?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    data_quality?: EnumDataQualityFieldUpdateOperationsInput | $Enums.DataQuality
    remarks?: NullableStringFieldUpdateOperationsInput | string | null
    uploaded_by?: IntFieldUpdateOperationsInput | number
    approved_by?: NullableIntFieldUpdateOperationsInput | number | null
    approved_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    achievement?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    denominator?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    numerator?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    target_value?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
  }

  export type MonthlyHealthDataUncheckedUpdateManyWithoutIndicatorInput = {
    id?: IntFieldUpdateOperationsInput | number
    facility_id?: NullableIntFieldUpdateOperationsInput | number | null
    sub_centre_id?: NullableIntFieldUpdateOperationsInput | number | null
    district_id?: IntFieldUpdateOperationsInput | number
    report_month?: StringFieldUpdateOperationsInput | string
    value?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    data_quality?: EnumDataQualityFieldUpdateOperationsInput | $Enums.DataQuality
    remarks?: NullableStringFieldUpdateOperationsInput | string | null
    uploaded_by?: IntFieldUpdateOperationsInput | number
    approved_by?: NullableIntFieldUpdateOperationsInput | number | null
    approved_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    achievement?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    denominator?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    numerator?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    target_value?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
  }

  export type MonthlyHealthDataCreateManySub_centreInput = {
    id?: number
    facility_id?: number | null
    district_id: number
    indicator_id?: number | null
    report_month: string
    value?: Decimal | DecimalJsLike | number | string | null
    data_quality?: $Enums.DataQuality
    remarks?: string | null
    uploaded_by: number
    approved_by?: number | null
    approved_at?: Date | string | null
    created_at?: Date | string
    updated_at?: Date | string
    achievement?: Decimal | DecimalJsLike | number | string | null
    denominator?: Decimal | DecimalJsLike | number | string | null
    numerator?: Decimal | DecimalJsLike | number | string | null
    target_value?: Decimal | DecimalJsLike | number | string | null
  }

  export type MonthlyHealthDataUpdateWithoutSub_centreInput = {
    report_month?: StringFieldUpdateOperationsInput | string
    value?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    data_quality?: EnumDataQualityFieldUpdateOperationsInput | $Enums.DataQuality
    remarks?: NullableStringFieldUpdateOperationsInput | string | null
    approved_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    achievement?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    denominator?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    numerator?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    target_value?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    approver?: UserUpdateOneWithoutApproved_dataNestedInput
    district?: DistrictUpdateOneRequiredWithoutMonthly_dataNestedInput
    facility?: FacilityUpdateOneWithoutMonthly_dataNestedInput
    indicator?: IndicatorUpdateOneWithoutMonthly_dataNestedInput
    uploader?: UserUpdateOneRequiredWithoutUploaded_dataNestedInput
  }

  export type MonthlyHealthDataUncheckedUpdateWithoutSub_centreInput = {
    id?: IntFieldUpdateOperationsInput | number
    facility_id?: NullableIntFieldUpdateOperationsInput | number | null
    district_id?: IntFieldUpdateOperationsInput | number
    indicator_id?: NullableIntFieldUpdateOperationsInput | number | null
    report_month?: StringFieldUpdateOperationsInput | string
    value?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    data_quality?: EnumDataQualityFieldUpdateOperationsInput | $Enums.DataQuality
    remarks?: NullableStringFieldUpdateOperationsInput | string | null
    uploaded_by?: IntFieldUpdateOperationsInput | number
    approved_by?: NullableIntFieldUpdateOperationsInput | number | null
    approved_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    achievement?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    denominator?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    numerator?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    target_value?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
  }

  export type MonthlyHealthDataUncheckedUpdateManyWithoutSub_centreInput = {
    id?: IntFieldUpdateOperationsInput | number
    facility_id?: NullableIntFieldUpdateOperationsInput | number | null
    district_id?: IntFieldUpdateOperationsInput | number
    indicator_id?: NullableIntFieldUpdateOperationsInput | number | null
    report_month?: StringFieldUpdateOperationsInput | string
    value?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    data_quality?: EnumDataQualityFieldUpdateOperationsInput | $Enums.DataQuality
    remarks?: NullableStringFieldUpdateOperationsInput | string | null
    uploaded_by?: IntFieldUpdateOperationsInput | number
    approved_by?: NullableIntFieldUpdateOperationsInput | number | null
    approved_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    achievement?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    denominator?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    numerator?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    target_value?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
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