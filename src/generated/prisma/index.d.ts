
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
 * Model SubCentre
 * 
 */
export type SubCentre = $Result.DefaultSelection<Prisma.$SubCentrePayload>

/**
 * Enums
 */
export namespace $Enums {
  export const UserRole: {
  admin: 'admin',
  staff: 'staff'
};

export type UserRole = (typeof UserRole)[keyof typeof UserRole]

}

export type UserRole = $Enums.UserRole

export const UserRole: typeof $Enums.UserRole

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
   * `prisma.subCentre`: Exposes CRUD operations for the **SubCentre** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more SubCentres
    * const subCentres = await prisma.subCentre.findMany()
    * ```
    */
  get subCentre(): Prisma.SubCentreDelegate<ExtArgs, ClientOptions>;
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
    SubCentre: 'SubCentre'
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
      modelProps: "user" | "district" | "facilityType" | "facility" | "subCentre"
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
      SubCentre: {
        payload: Prisma.$SubCentrePayload<ExtArgs>
        fields: Prisma.SubCentreFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SubCentreFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubCentrePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SubCentreFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubCentrePayload>
          }
          findFirst: {
            args: Prisma.SubCentreFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubCentrePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SubCentreFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubCentrePayload>
          }
          findMany: {
            args: Prisma.SubCentreFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubCentrePayload>[]
          }
          create: {
            args: Prisma.SubCentreCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubCentrePayload>
          }
          createMany: {
            args: Prisma.SubCentreCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SubCentreCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubCentrePayload>[]
          }
          delete: {
            args: Prisma.SubCentreDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubCentrePayload>
          }
          update: {
            args: Prisma.SubCentreUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubCentrePayload>
          }
          deleteMany: {
            args: Prisma.SubCentreDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SubCentreUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SubCentreUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubCentrePayload>[]
          }
          upsert: {
            args: Prisma.SubCentreUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubCentrePayload>
          }
          aggregate: {
            args: Prisma.SubCentreAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSubCentre>
          }
          groupBy: {
            args: Prisma.SubCentreGroupByArgs<ExtArgs>
            result: $Utils.Optional<SubCentreGroupByOutputType>[]
          }
          count: {
            args: Prisma.SubCentreCountArgs<ExtArgs>
            result: $Utils.Optional<SubCentreCountAggregateOutputType> | number
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
    subCentre?: SubCentreOmit
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
   * Count Type DistrictCountOutputType
   */

  export type DistrictCountOutputType = {
    facilities: number
  }

  export type DistrictCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    facilities?: boolean | DistrictCountOutputTypeCountFacilitiesArgs
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
    sub_centres: number
  }

  export type FacilityCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    sub_centres?: boolean | FacilityCountOutputTypeCountSub_centresArgs
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
  export type FacilityCountOutputTypeCountSub_centresArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SubCentreWhereInput
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

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {}
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
    _count?: boolean | DistrictCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type DistrictIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type DistrictIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $DistrictPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "District"
    objects: {
      facilities: Prisma.$FacilityPayload<ExtArgs>[]
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
    facility_code: string | null
    nin: string | null
    district_id: number | null
    facility_type_id: number | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type FacilityMaxAggregateOutputType = {
    id: number | null
    name: string | null
    facility_code: string | null
    nin: string | null
    district_id: number | null
    facility_type_id: number | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type FacilityCountAggregateOutputType = {
    id: number
    name: number
    facility_code: number
    nin: number
    district_id: number
    facility_type_id: number
    created_at: number
    updated_at: number
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
    facility_code?: true
    nin?: true
    district_id?: true
    facility_type_id?: true
    created_at?: true
    updated_at?: true
  }

  export type FacilityMaxAggregateInputType = {
    id?: true
    name?: true
    facility_code?: true
    nin?: true
    district_id?: true
    facility_type_id?: true
    created_at?: true
    updated_at?: true
  }

  export type FacilityCountAggregateInputType = {
    id?: true
    name?: true
    facility_code?: true
    nin?: true
    district_id?: true
    facility_type_id?: true
    created_at?: true
    updated_at?: true
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
    facility_code: string | null
    nin: string | null
    district_id: number
    facility_type_id: number
    created_at: Date
    updated_at: Date
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
    facility_code?: boolean
    nin?: boolean
    district_id?: boolean
    facility_type_id?: boolean
    created_at?: boolean
    updated_at?: boolean
    district?: boolean | DistrictDefaultArgs<ExtArgs>
    facility_type?: boolean | FacilityTypeDefaultArgs<ExtArgs>
    sub_centres?: boolean | Facility$sub_centresArgs<ExtArgs>
    _count?: boolean | FacilityCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["facility"]>

  export type FacilitySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    facility_code?: boolean
    nin?: boolean
    district_id?: boolean
    facility_type_id?: boolean
    created_at?: boolean
    updated_at?: boolean
    district?: boolean | DistrictDefaultArgs<ExtArgs>
    facility_type?: boolean | FacilityTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["facility"]>

  export type FacilitySelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    facility_code?: boolean
    nin?: boolean
    district_id?: boolean
    facility_type_id?: boolean
    created_at?: boolean
    updated_at?: boolean
    district?: boolean | DistrictDefaultArgs<ExtArgs>
    facility_type?: boolean | FacilityTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["facility"]>

  export type FacilitySelectScalar = {
    id?: boolean
    name?: boolean
    facility_code?: boolean
    nin?: boolean
    district_id?: boolean
    facility_type_id?: boolean
    created_at?: boolean
    updated_at?: boolean
  }

  export type FacilityOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "facility_code" | "nin" | "district_id" | "facility_type_id" | "created_at" | "updated_at", ExtArgs["result"]["facility"]>
  export type FacilityInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    district?: boolean | DistrictDefaultArgs<ExtArgs>
    facility_type?: boolean | FacilityTypeDefaultArgs<ExtArgs>
    sub_centres?: boolean | Facility$sub_centresArgs<ExtArgs>
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
      sub_centres: Prisma.$SubCentrePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      name: string
      facility_code: string | null
      nin: string | null
      district_id: number
      facility_type_id: number
      created_at: Date
      updated_at: Date
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
    sub_centres<T extends Facility$sub_centresArgs<ExtArgs> = {}>(args?: Subset<T, Facility$sub_centresArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SubCentrePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
    readonly facility_code: FieldRef<"Facility", 'String'>
    readonly nin: FieldRef<"Facility", 'String'>
    readonly district_id: FieldRef<"Facility", 'Int'>
    readonly facility_type_id: FieldRef<"Facility", 'Int'>
    readonly created_at: FieldRef<"Facility", 'DateTime'>
    readonly updated_at: FieldRef<"Facility", 'DateTime'>
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
   * Facility.sub_centres
   */
  export type Facility$sub_centresArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubCentre
     */
    select?: SubCentreSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SubCentre
     */
    omit?: SubCentreOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubCentreInclude<ExtArgs> | null
    where?: SubCentreWhereInput
    orderBy?: SubCentreOrderByWithRelationInput | SubCentreOrderByWithRelationInput[]
    cursor?: SubCentreWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SubCentreScalarFieldEnum | SubCentreScalarFieldEnum[]
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
   * Model SubCentre
   */

  export type AggregateSubCentre = {
    _count: SubCentreCountAggregateOutputType | null
    _avg: SubCentreAvgAggregateOutputType | null
    _sum: SubCentreSumAggregateOutputType | null
    _min: SubCentreMinAggregateOutputType | null
    _max: SubCentreMaxAggregateOutputType | null
  }

  export type SubCentreAvgAggregateOutputType = {
    id: number | null
    facility_id: number | null
  }

  export type SubCentreSumAggregateOutputType = {
    id: number | null
    facility_id: number | null
  }

  export type SubCentreMinAggregateOutputType = {
    id: number | null
    name: string | null
    facility_code: string | null
    nin: string | null
    facility_id: number | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type SubCentreMaxAggregateOutputType = {
    id: number | null
    name: string | null
    facility_code: string | null
    nin: string | null
    facility_id: number | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type SubCentreCountAggregateOutputType = {
    id: number
    name: number
    facility_code: number
    nin: number
    facility_id: number
    created_at: number
    updated_at: number
    _all: number
  }


  export type SubCentreAvgAggregateInputType = {
    id?: true
    facility_id?: true
  }

  export type SubCentreSumAggregateInputType = {
    id?: true
    facility_id?: true
  }

  export type SubCentreMinAggregateInputType = {
    id?: true
    name?: true
    facility_code?: true
    nin?: true
    facility_id?: true
    created_at?: true
    updated_at?: true
  }

  export type SubCentreMaxAggregateInputType = {
    id?: true
    name?: true
    facility_code?: true
    nin?: true
    facility_id?: true
    created_at?: true
    updated_at?: true
  }

  export type SubCentreCountAggregateInputType = {
    id?: true
    name?: true
    facility_code?: true
    nin?: true
    facility_id?: true
    created_at?: true
    updated_at?: true
    _all?: true
  }

  export type SubCentreAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SubCentre to aggregate.
     */
    where?: SubCentreWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SubCentres to fetch.
     */
    orderBy?: SubCentreOrderByWithRelationInput | SubCentreOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SubCentreWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SubCentres from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SubCentres.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned SubCentres
    **/
    _count?: true | SubCentreCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: SubCentreAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: SubCentreSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SubCentreMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SubCentreMaxAggregateInputType
  }

  export type GetSubCentreAggregateType<T extends SubCentreAggregateArgs> = {
        [P in keyof T & keyof AggregateSubCentre]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSubCentre[P]>
      : GetScalarType<T[P], AggregateSubCentre[P]>
  }




  export type SubCentreGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SubCentreWhereInput
    orderBy?: SubCentreOrderByWithAggregationInput | SubCentreOrderByWithAggregationInput[]
    by: SubCentreScalarFieldEnum[] | SubCentreScalarFieldEnum
    having?: SubCentreScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SubCentreCountAggregateInputType | true
    _avg?: SubCentreAvgAggregateInputType
    _sum?: SubCentreSumAggregateInputType
    _min?: SubCentreMinAggregateInputType
    _max?: SubCentreMaxAggregateInputType
  }

  export type SubCentreGroupByOutputType = {
    id: number
    name: string
    facility_code: string | null
    nin: string | null
    facility_id: number
    created_at: Date
    updated_at: Date
    _count: SubCentreCountAggregateOutputType | null
    _avg: SubCentreAvgAggregateOutputType | null
    _sum: SubCentreSumAggregateOutputType | null
    _min: SubCentreMinAggregateOutputType | null
    _max: SubCentreMaxAggregateOutputType | null
  }

  type GetSubCentreGroupByPayload<T extends SubCentreGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SubCentreGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SubCentreGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SubCentreGroupByOutputType[P]>
            : GetScalarType<T[P], SubCentreGroupByOutputType[P]>
        }
      >
    >


  export type SubCentreSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    facility_code?: boolean
    nin?: boolean
    facility_id?: boolean
    created_at?: boolean
    updated_at?: boolean
    facility?: boolean | FacilityDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["subCentre"]>

  export type SubCentreSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    facility_code?: boolean
    nin?: boolean
    facility_id?: boolean
    created_at?: boolean
    updated_at?: boolean
    facility?: boolean | FacilityDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["subCentre"]>

  export type SubCentreSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    facility_code?: boolean
    nin?: boolean
    facility_id?: boolean
    created_at?: boolean
    updated_at?: boolean
    facility?: boolean | FacilityDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["subCentre"]>

  export type SubCentreSelectScalar = {
    id?: boolean
    name?: boolean
    facility_code?: boolean
    nin?: boolean
    facility_id?: boolean
    created_at?: boolean
    updated_at?: boolean
  }

  export type SubCentreOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "facility_code" | "nin" | "facility_id" | "created_at" | "updated_at", ExtArgs["result"]["subCentre"]>
  export type SubCentreInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    facility?: boolean | FacilityDefaultArgs<ExtArgs>
  }
  export type SubCentreIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    facility?: boolean | FacilityDefaultArgs<ExtArgs>
  }
  export type SubCentreIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    facility?: boolean | FacilityDefaultArgs<ExtArgs>
  }

  export type $SubCentrePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "SubCentre"
    objects: {
      facility: Prisma.$FacilityPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      name: string
      facility_code: string | null
      nin: string | null
      facility_id: number
      created_at: Date
      updated_at: Date
    }, ExtArgs["result"]["subCentre"]>
    composites: {}
  }

  type SubCentreGetPayload<S extends boolean | null | undefined | SubCentreDefaultArgs> = $Result.GetResult<Prisma.$SubCentrePayload, S>

  type SubCentreCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SubCentreFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SubCentreCountAggregateInputType | true
    }

  export interface SubCentreDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['SubCentre'], meta: { name: 'SubCentre' } }
    /**
     * Find zero or one SubCentre that matches the filter.
     * @param {SubCentreFindUniqueArgs} args - Arguments to find a SubCentre
     * @example
     * // Get one SubCentre
     * const subCentre = await prisma.subCentre.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SubCentreFindUniqueArgs>(args: SelectSubset<T, SubCentreFindUniqueArgs<ExtArgs>>): Prisma__SubCentreClient<$Result.GetResult<Prisma.$SubCentrePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one SubCentre that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SubCentreFindUniqueOrThrowArgs} args - Arguments to find a SubCentre
     * @example
     * // Get one SubCentre
     * const subCentre = await prisma.subCentre.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SubCentreFindUniqueOrThrowArgs>(args: SelectSubset<T, SubCentreFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SubCentreClient<$Result.GetResult<Prisma.$SubCentrePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SubCentre that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubCentreFindFirstArgs} args - Arguments to find a SubCentre
     * @example
     * // Get one SubCentre
     * const subCentre = await prisma.subCentre.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SubCentreFindFirstArgs>(args?: SelectSubset<T, SubCentreFindFirstArgs<ExtArgs>>): Prisma__SubCentreClient<$Result.GetResult<Prisma.$SubCentrePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SubCentre that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubCentreFindFirstOrThrowArgs} args - Arguments to find a SubCentre
     * @example
     * // Get one SubCentre
     * const subCentre = await prisma.subCentre.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SubCentreFindFirstOrThrowArgs>(args?: SelectSubset<T, SubCentreFindFirstOrThrowArgs<ExtArgs>>): Prisma__SubCentreClient<$Result.GetResult<Prisma.$SubCentrePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more SubCentres that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubCentreFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SubCentres
     * const subCentres = await prisma.subCentre.findMany()
     * 
     * // Get first 10 SubCentres
     * const subCentres = await prisma.subCentre.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const subCentreWithIdOnly = await prisma.subCentre.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SubCentreFindManyArgs>(args?: SelectSubset<T, SubCentreFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SubCentrePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a SubCentre.
     * @param {SubCentreCreateArgs} args - Arguments to create a SubCentre.
     * @example
     * // Create one SubCentre
     * const SubCentre = await prisma.subCentre.create({
     *   data: {
     *     // ... data to create a SubCentre
     *   }
     * })
     * 
     */
    create<T extends SubCentreCreateArgs>(args: SelectSubset<T, SubCentreCreateArgs<ExtArgs>>): Prisma__SubCentreClient<$Result.GetResult<Prisma.$SubCentrePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many SubCentres.
     * @param {SubCentreCreateManyArgs} args - Arguments to create many SubCentres.
     * @example
     * // Create many SubCentres
     * const subCentre = await prisma.subCentre.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SubCentreCreateManyArgs>(args?: SelectSubset<T, SubCentreCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many SubCentres and returns the data saved in the database.
     * @param {SubCentreCreateManyAndReturnArgs} args - Arguments to create many SubCentres.
     * @example
     * // Create many SubCentres
     * const subCentre = await prisma.subCentre.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many SubCentres and only return the `id`
     * const subCentreWithIdOnly = await prisma.subCentre.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SubCentreCreateManyAndReturnArgs>(args?: SelectSubset<T, SubCentreCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SubCentrePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a SubCentre.
     * @param {SubCentreDeleteArgs} args - Arguments to delete one SubCentre.
     * @example
     * // Delete one SubCentre
     * const SubCentre = await prisma.subCentre.delete({
     *   where: {
     *     // ... filter to delete one SubCentre
     *   }
     * })
     * 
     */
    delete<T extends SubCentreDeleteArgs>(args: SelectSubset<T, SubCentreDeleteArgs<ExtArgs>>): Prisma__SubCentreClient<$Result.GetResult<Prisma.$SubCentrePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one SubCentre.
     * @param {SubCentreUpdateArgs} args - Arguments to update one SubCentre.
     * @example
     * // Update one SubCentre
     * const subCentre = await prisma.subCentre.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SubCentreUpdateArgs>(args: SelectSubset<T, SubCentreUpdateArgs<ExtArgs>>): Prisma__SubCentreClient<$Result.GetResult<Prisma.$SubCentrePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more SubCentres.
     * @param {SubCentreDeleteManyArgs} args - Arguments to filter SubCentres to delete.
     * @example
     * // Delete a few SubCentres
     * const { count } = await prisma.subCentre.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SubCentreDeleteManyArgs>(args?: SelectSubset<T, SubCentreDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SubCentres.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubCentreUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SubCentres
     * const subCentre = await prisma.subCentre.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SubCentreUpdateManyArgs>(args: SelectSubset<T, SubCentreUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SubCentres and returns the data updated in the database.
     * @param {SubCentreUpdateManyAndReturnArgs} args - Arguments to update many SubCentres.
     * @example
     * // Update many SubCentres
     * const subCentre = await prisma.subCentre.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more SubCentres and only return the `id`
     * const subCentreWithIdOnly = await prisma.subCentre.updateManyAndReturn({
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
    updateManyAndReturn<T extends SubCentreUpdateManyAndReturnArgs>(args: SelectSubset<T, SubCentreUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SubCentrePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one SubCentre.
     * @param {SubCentreUpsertArgs} args - Arguments to update or create a SubCentre.
     * @example
     * // Update or create a SubCentre
     * const subCentre = await prisma.subCentre.upsert({
     *   create: {
     *     // ... data to create a SubCentre
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SubCentre we want to update
     *   }
     * })
     */
    upsert<T extends SubCentreUpsertArgs>(args: SelectSubset<T, SubCentreUpsertArgs<ExtArgs>>): Prisma__SubCentreClient<$Result.GetResult<Prisma.$SubCentrePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of SubCentres.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubCentreCountArgs} args - Arguments to filter SubCentres to count.
     * @example
     * // Count the number of SubCentres
     * const count = await prisma.subCentre.count({
     *   where: {
     *     // ... the filter for the SubCentres we want to count
     *   }
     * })
    **/
    count<T extends SubCentreCountArgs>(
      args?: Subset<T, SubCentreCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SubCentreCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SubCentre.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubCentreAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends SubCentreAggregateArgs>(args: Subset<T, SubCentreAggregateArgs>): Prisma.PrismaPromise<GetSubCentreAggregateType<T>>

    /**
     * Group by SubCentre.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubCentreGroupByArgs} args - Group by arguments.
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
      T extends SubCentreGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SubCentreGroupByArgs['orderBy'] }
        : { orderBy?: SubCentreGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, SubCentreGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSubCentreGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the SubCentre model
   */
  readonly fields: SubCentreFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for SubCentre.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SubCentreClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
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
   * Fields of the SubCentre model
   */
  interface SubCentreFieldRefs {
    readonly id: FieldRef<"SubCentre", 'Int'>
    readonly name: FieldRef<"SubCentre", 'String'>
    readonly facility_code: FieldRef<"SubCentre", 'String'>
    readonly nin: FieldRef<"SubCentre", 'String'>
    readonly facility_id: FieldRef<"SubCentre", 'Int'>
    readonly created_at: FieldRef<"SubCentre", 'DateTime'>
    readonly updated_at: FieldRef<"SubCentre", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * SubCentre findUnique
   */
  export type SubCentreFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubCentre
     */
    select?: SubCentreSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SubCentre
     */
    omit?: SubCentreOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubCentreInclude<ExtArgs> | null
    /**
     * Filter, which SubCentre to fetch.
     */
    where: SubCentreWhereUniqueInput
  }

  /**
   * SubCentre findUniqueOrThrow
   */
  export type SubCentreFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubCentre
     */
    select?: SubCentreSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SubCentre
     */
    omit?: SubCentreOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubCentreInclude<ExtArgs> | null
    /**
     * Filter, which SubCentre to fetch.
     */
    where: SubCentreWhereUniqueInput
  }

  /**
   * SubCentre findFirst
   */
  export type SubCentreFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubCentre
     */
    select?: SubCentreSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SubCentre
     */
    omit?: SubCentreOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubCentreInclude<ExtArgs> | null
    /**
     * Filter, which SubCentre to fetch.
     */
    where?: SubCentreWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SubCentres to fetch.
     */
    orderBy?: SubCentreOrderByWithRelationInput | SubCentreOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SubCentres.
     */
    cursor?: SubCentreWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SubCentres from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SubCentres.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SubCentres.
     */
    distinct?: SubCentreScalarFieldEnum | SubCentreScalarFieldEnum[]
  }

  /**
   * SubCentre findFirstOrThrow
   */
  export type SubCentreFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubCentre
     */
    select?: SubCentreSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SubCentre
     */
    omit?: SubCentreOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubCentreInclude<ExtArgs> | null
    /**
     * Filter, which SubCentre to fetch.
     */
    where?: SubCentreWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SubCentres to fetch.
     */
    orderBy?: SubCentreOrderByWithRelationInput | SubCentreOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SubCentres.
     */
    cursor?: SubCentreWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SubCentres from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SubCentres.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SubCentres.
     */
    distinct?: SubCentreScalarFieldEnum | SubCentreScalarFieldEnum[]
  }

  /**
   * SubCentre findMany
   */
  export type SubCentreFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubCentre
     */
    select?: SubCentreSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SubCentre
     */
    omit?: SubCentreOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubCentreInclude<ExtArgs> | null
    /**
     * Filter, which SubCentres to fetch.
     */
    where?: SubCentreWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SubCentres to fetch.
     */
    orderBy?: SubCentreOrderByWithRelationInput | SubCentreOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing SubCentres.
     */
    cursor?: SubCentreWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SubCentres from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SubCentres.
     */
    skip?: number
    distinct?: SubCentreScalarFieldEnum | SubCentreScalarFieldEnum[]
  }

  /**
   * SubCentre create
   */
  export type SubCentreCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubCentre
     */
    select?: SubCentreSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SubCentre
     */
    omit?: SubCentreOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubCentreInclude<ExtArgs> | null
    /**
     * The data needed to create a SubCentre.
     */
    data: XOR<SubCentreCreateInput, SubCentreUncheckedCreateInput>
  }

  /**
   * SubCentre createMany
   */
  export type SubCentreCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many SubCentres.
     */
    data: SubCentreCreateManyInput | SubCentreCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SubCentre createManyAndReturn
   */
  export type SubCentreCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubCentre
     */
    select?: SubCentreSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SubCentre
     */
    omit?: SubCentreOmit<ExtArgs> | null
    /**
     * The data used to create many SubCentres.
     */
    data: SubCentreCreateManyInput | SubCentreCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubCentreIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * SubCentre update
   */
  export type SubCentreUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubCentre
     */
    select?: SubCentreSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SubCentre
     */
    omit?: SubCentreOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubCentreInclude<ExtArgs> | null
    /**
     * The data needed to update a SubCentre.
     */
    data: XOR<SubCentreUpdateInput, SubCentreUncheckedUpdateInput>
    /**
     * Choose, which SubCentre to update.
     */
    where: SubCentreWhereUniqueInput
  }

  /**
   * SubCentre updateMany
   */
  export type SubCentreUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update SubCentres.
     */
    data: XOR<SubCentreUpdateManyMutationInput, SubCentreUncheckedUpdateManyInput>
    /**
     * Filter which SubCentres to update
     */
    where?: SubCentreWhereInput
    /**
     * Limit how many SubCentres to update.
     */
    limit?: number
  }

  /**
   * SubCentre updateManyAndReturn
   */
  export type SubCentreUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubCentre
     */
    select?: SubCentreSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SubCentre
     */
    omit?: SubCentreOmit<ExtArgs> | null
    /**
     * The data used to update SubCentres.
     */
    data: XOR<SubCentreUpdateManyMutationInput, SubCentreUncheckedUpdateManyInput>
    /**
     * Filter which SubCentres to update
     */
    where?: SubCentreWhereInput
    /**
     * Limit how many SubCentres to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubCentreIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * SubCentre upsert
   */
  export type SubCentreUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubCentre
     */
    select?: SubCentreSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SubCentre
     */
    omit?: SubCentreOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubCentreInclude<ExtArgs> | null
    /**
     * The filter to search for the SubCentre to update in case it exists.
     */
    where: SubCentreWhereUniqueInput
    /**
     * In case the SubCentre found by the `where` argument doesn't exist, create a new SubCentre with this data.
     */
    create: XOR<SubCentreCreateInput, SubCentreUncheckedCreateInput>
    /**
     * In case the SubCentre was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SubCentreUpdateInput, SubCentreUncheckedUpdateInput>
  }

  /**
   * SubCentre delete
   */
  export type SubCentreDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubCentre
     */
    select?: SubCentreSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SubCentre
     */
    omit?: SubCentreOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubCentreInclude<ExtArgs> | null
    /**
     * Filter which SubCentre to delete.
     */
    where: SubCentreWhereUniqueInput
  }

  /**
   * SubCentre deleteMany
   */
  export type SubCentreDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SubCentres to delete
     */
    where?: SubCentreWhereInput
    /**
     * Limit how many SubCentres to delete.
     */
    limit?: number
  }

  /**
   * SubCentre without action
   */
  export type SubCentreDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubCentre
     */
    select?: SubCentreSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SubCentre
     */
    omit?: SubCentreOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubCentreInclude<ExtArgs> | null
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
    facility_code: 'facility_code',
    nin: 'nin',
    district_id: 'district_id',
    facility_type_id: 'facility_type_id',
    created_at: 'created_at',
    updated_at: 'updated_at'
  };

  export type FacilityScalarFieldEnum = (typeof FacilityScalarFieldEnum)[keyof typeof FacilityScalarFieldEnum]


  export const SubCentreScalarFieldEnum: {
    id: 'id',
    name: 'name',
    facility_code: 'facility_code',
    nin: 'nin',
    facility_id: 'facility_id',
    created_at: 'created_at',
    updated_at: 'updated_at'
  };

  export type SubCentreScalarFieldEnum = (typeof SubCentreScalarFieldEnum)[keyof typeof SubCentreScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


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
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    username?: SortOrder
    password_hash?: SortOrder
    role?: SortOrder
    is_active?: SortOrderInput | SortOrder
    last_login?: SortOrderInput | SortOrder
    created_at?: SortOrderInput | SortOrder
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
  }

  export type DistrictOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    facilities?: FacilityOrderByRelationAggregateInput
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
    facility_code?: StringNullableFilter<"Facility"> | string | null
    nin?: StringNullableFilter<"Facility"> | string | null
    district_id?: IntFilter<"Facility"> | number
    facility_type_id?: IntFilter<"Facility"> | number
    created_at?: DateTimeFilter<"Facility"> | Date | string
    updated_at?: DateTimeFilter<"Facility"> | Date | string
    district?: XOR<DistrictScalarRelationFilter, DistrictWhereInput>
    facility_type?: XOR<FacilityTypeScalarRelationFilter, FacilityTypeWhereInput>
    sub_centres?: SubCentreListRelationFilter
  }

  export type FacilityOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    facility_code?: SortOrderInput | SortOrder
    nin?: SortOrderInput | SortOrder
    district_id?: SortOrder
    facility_type_id?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    district?: DistrictOrderByWithRelationInput
    facility_type?: FacilityTypeOrderByWithRelationInput
    sub_centres?: SubCentreOrderByRelationAggregateInput
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
    sub_centres?: SubCentreListRelationFilter
  }, "id" | "facility_code" | "nin">

  export type FacilityOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    facility_code?: SortOrderInput | SortOrder
    nin?: SortOrderInput | SortOrder
    district_id?: SortOrder
    facility_type_id?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
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
    facility_code?: StringNullableWithAggregatesFilter<"Facility"> | string | null
    nin?: StringNullableWithAggregatesFilter<"Facility"> | string | null
    district_id?: IntWithAggregatesFilter<"Facility"> | number
    facility_type_id?: IntWithAggregatesFilter<"Facility"> | number
    created_at?: DateTimeWithAggregatesFilter<"Facility"> | Date | string
    updated_at?: DateTimeWithAggregatesFilter<"Facility"> | Date | string
  }

  export type SubCentreWhereInput = {
    AND?: SubCentreWhereInput | SubCentreWhereInput[]
    OR?: SubCentreWhereInput[]
    NOT?: SubCentreWhereInput | SubCentreWhereInput[]
    id?: IntFilter<"SubCentre"> | number
    name?: StringFilter<"SubCentre"> | string
    facility_code?: StringNullableFilter<"SubCentre"> | string | null
    nin?: StringNullableFilter<"SubCentre"> | string | null
    facility_id?: IntFilter<"SubCentre"> | number
    created_at?: DateTimeFilter<"SubCentre"> | Date | string
    updated_at?: DateTimeFilter<"SubCentre"> | Date | string
    facility?: XOR<FacilityScalarRelationFilter, FacilityWhereInput>
  }

  export type SubCentreOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    facility_code?: SortOrderInput | SortOrder
    nin?: SortOrderInput | SortOrder
    facility_id?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    facility?: FacilityOrderByWithRelationInput
  }

  export type SubCentreWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    facility_code?: string
    nin?: string
    AND?: SubCentreWhereInput | SubCentreWhereInput[]
    OR?: SubCentreWhereInput[]
    NOT?: SubCentreWhereInput | SubCentreWhereInput[]
    name?: StringFilter<"SubCentre"> | string
    facility_id?: IntFilter<"SubCentre"> | number
    created_at?: DateTimeFilter<"SubCentre"> | Date | string
    updated_at?: DateTimeFilter<"SubCentre"> | Date | string
    facility?: XOR<FacilityScalarRelationFilter, FacilityWhereInput>
  }, "id" | "facility_code" | "nin">

  export type SubCentreOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    facility_code?: SortOrderInput | SortOrder
    nin?: SortOrderInput | SortOrder
    facility_id?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    _count?: SubCentreCountOrderByAggregateInput
    _avg?: SubCentreAvgOrderByAggregateInput
    _max?: SubCentreMaxOrderByAggregateInput
    _min?: SubCentreMinOrderByAggregateInput
    _sum?: SubCentreSumOrderByAggregateInput
  }

  export type SubCentreScalarWhereWithAggregatesInput = {
    AND?: SubCentreScalarWhereWithAggregatesInput | SubCentreScalarWhereWithAggregatesInput[]
    OR?: SubCentreScalarWhereWithAggregatesInput[]
    NOT?: SubCentreScalarWhereWithAggregatesInput | SubCentreScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"SubCentre"> | number
    name?: StringWithAggregatesFilter<"SubCentre"> | string
    facility_code?: StringNullableWithAggregatesFilter<"SubCentre"> | string | null
    nin?: StringNullableWithAggregatesFilter<"SubCentre"> | string | null
    facility_id?: IntWithAggregatesFilter<"SubCentre"> | number
    created_at?: DateTimeWithAggregatesFilter<"SubCentre"> | Date | string
    updated_at?: DateTimeWithAggregatesFilter<"SubCentre"> | Date | string
  }

  export type UserCreateInput = {
    username: string
    password_hash: string
    role?: $Enums.UserRole
    is_active?: boolean | null
    last_login?: Date | string | null
    created_at?: Date | string | null
  }

  export type UserUncheckedCreateInput = {
    id?: number
    username: string
    password_hash: string
    role?: $Enums.UserRole
    is_active?: boolean | null
    last_login?: Date | string | null
    created_at?: Date | string | null
  }

  export type UserUpdateInput = {
    username?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    is_active?: NullableBoolFieldUpdateOperationsInput | boolean | null
    last_login?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type UserUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    username?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    is_active?: NullableBoolFieldUpdateOperationsInput | boolean | null
    last_login?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
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
  }

  export type DistrictUncheckedCreateInput = {
    id?: number
    name: string
    created_at?: Date | string
    updated_at?: Date | string
    facilities?: FacilityUncheckedCreateNestedManyWithoutDistrictInput
  }

  export type DistrictUpdateInput = {
    name?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    facilities?: FacilityUpdateManyWithoutDistrictNestedInput
  }

  export type DistrictUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    facilities?: FacilityUncheckedUpdateManyWithoutDistrictNestedInput
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
    facility_code?: string | null
    nin?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    district: DistrictCreateNestedOneWithoutFacilitiesInput
    facility_type: FacilityTypeCreateNestedOneWithoutFacilitiesInput
    sub_centres?: SubCentreCreateNestedManyWithoutFacilityInput
  }

  export type FacilityUncheckedCreateInput = {
    id?: number
    name: string
    facility_code?: string | null
    nin?: string | null
    district_id: number
    facility_type_id: number
    created_at?: Date | string
    updated_at?: Date | string
    sub_centres?: SubCentreUncheckedCreateNestedManyWithoutFacilityInput
  }

  export type FacilityUpdateInput = {
    name?: StringFieldUpdateOperationsInput | string
    facility_code?: NullableStringFieldUpdateOperationsInput | string | null
    nin?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    district?: DistrictUpdateOneRequiredWithoutFacilitiesNestedInput
    facility_type?: FacilityTypeUpdateOneRequiredWithoutFacilitiesNestedInput
    sub_centres?: SubCentreUpdateManyWithoutFacilityNestedInput
  }

  export type FacilityUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    facility_code?: NullableStringFieldUpdateOperationsInput | string | null
    nin?: NullableStringFieldUpdateOperationsInput | string | null
    district_id?: IntFieldUpdateOperationsInput | number
    facility_type_id?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    sub_centres?: SubCentreUncheckedUpdateManyWithoutFacilityNestedInput
  }

  export type FacilityCreateManyInput = {
    id?: number
    name: string
    facility_code?: string | null
    nin?: string | null
    district_id: number
    facility_type_id: number
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type FacilityUpdateManyMutationInput = {
    name?: StringFieldUpdateOperationsInput | string
    facility_code?: NullableStringFieldUpdateOperationsInput | string | null
    nin?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FacilityUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    facility_code?: NullableStringFieldUpdateOperationsInput | string | null
    nin?: NullableStringFieldUpdateOperationsInput | string | null
    district_id?: IntFieldUpdateOperationsInput | number
    facility_type_id?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SubCentreCreateInput = {
    name: string
    facility_code?: string | null
    nin?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    facility: FacilityCreateNestedOneWithoutSub_centresInput
  }

  export type SubCentreUncheckedCreateInput = {
    id?: number
    name: string
    facility_code?: string | null
    nin?: string | null
    facility_id: number
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type SubCentreUpdateInput = {
    name?: StringFieldUpdateOperationsInput | string
    facility_code?: NullableStringFieldUpdateOperationsInput | string | null
    nin?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    facility?: FacilityUpdateOneRequiredWithoutSub_centresNestedInput
  }

  export type SubCentreUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    facility_code?: NullableStringFieldUpdateOperationsInput | string | null
    nin?: NullableStringFieldUpdateOperationsInput | string | null
    facility_id?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SubCentreCreateManyInput = {
    id?: number
    name: string
    facility_code?: string | null
    nin?: string | null
    facility_id: number
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type SubCentreUpdateManyMutationInput = {
    name?: StringFieldUpdateOperationsInput | string
    facility_code?: NullableStringFieldUpdateOperationsInput | string | null
    nin?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SubCentreUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    facility_code?: NullableStringFieldUpdateOperationsInput | string | null
    nin?: NullableStringFieldUpdateOperationsInput | string | null
    facility_id?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
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

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
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

  export type SubCentreListRelationFilter = {
    every?: SubCentreWhereInput
    some?: SubCentreWhereInput
    none?: SubCentreWhereInput
  }

  export type SubCentreOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type FacilityCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    facility_code?: SortOrder
    nin?: SortOrder
    district_id?: SortOrder
    facility_type_id?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type FacilityAvgOrderByAggregateInput = {
    id?: SortOrder
    district_id?: SortOrder
    facility_type_id?: SortOrder
  }

  export type FacilityMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    facility_code?: SortOrder
    nin?: SortOrder
    district_id?: SortOrder
    facility_type_id?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type FacilityMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    facility_code?: SortOrder
    nin?: SortOrder
    district_id?: SortOrder
    facility_type_id?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
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

  export type FacilityScalarRelationFilter = {
    is?: FacilityWhereInput
    isNot?: FacilityWhereInput
  }

  export type SubCentreCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    facility_code?: SortOrder
    nin?: SortOrder
    facility_id?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type SubCentreAvgOrderByAggregateInput = {
    id?: SortOrder
    facility_id?: SortOrder
  }

  export type SubCentreMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    facility_code?: SortOrder
    nin?: SortOrder
    facility_id?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type SubCentreMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    facility_code?: SortOrder
    nin?: SortOrder
    facility_id?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type SubCentreSumOrderByAggregateInput = {
    id?: SortOrder
    facility_id?: SortOrder
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

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type FacilityCreateNestedManyWithoutDistrictInput = {
    create?: XOR<FacilityCreateWithoutDistrictInput, FacilityUncheckedCreateWithoutDistrictInput> | FacilityCreateWithoutDistrictInput[] | FacilityUncheckedCreateWithoutDistrictInput[]
    connectOrCreate?: FacilityCreateOrConnectWithoutDistrictInput | FacilityCreateOrConnectWithoutDistrictInput[]
    createMany?: FacilityCreateManyDistrictInputEnvelope
    connect?: FacilityWhereUniqueInput | FacilityWhereUniqueInput[]
  }

  export type FacilityUncheckedCreateNestedManyWithoutDistrictInput = {
    create?: XOR<FacilityCreateWithoutDistrictInput, FacilityUncheckedCreateWithoutDistrictInput> | FacilityCreateWithoutDistrictInput[] | FacilityUncheckedCreateWithoutDistrictInput[]
    connectOrCreate?: FacilityCreateOrConnectWithoutDistrictInput | FacilityCreateOrConnectWithoutDistrictInput[]
    createMany?: FacilityCreateManyDistrictInputEnvelope
    connect?: FacilityWhereUniqueInput | FacilityWhereUniqueInput[]
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

  export type SubCentreCreateNestedManyWithoutFacilityInput = {
    create?: XOR<SubCentreCreateWithoutFacilityInput, SubCentreUncheckedCreateWithoutFacilityInput> | SubCentreCreateWithoutFacilityInput[] | SubCentreUncheckedCreateWithoutFacilityInput[]
    connectOrCreate?: SubCentreCreateOrConnectWithoutFacilityInput | SubCentreCreateOrConnectWithoutFacilityInput[]
    createMany?: SubCentreCreateManyFacilityInputEnvelope
    connect?: SubCentreWhereUniqueInput | SubCentreWhereUniqueInput[]
  }

  export type SubCentreUncheckedCreateNestedManyWithoutFacilityInput = {
    create?: XOR<SubCentreCreateWithoutFacilityInput, SubCentreUncheckedCreateWithoutFacilityInput> | SubCentreCreateWithoutFacilityInput[] | SubCentreUncheckedCreateWithoutFacilityInput[]
    connectOrCreate?: SubCentreCreateOrConnectWithoutFacilityInput | SubCentreCreateOrConnectWithoutFacilityInput[]
    createMany?: SubCentreCreateManyFacilityInputEnvelope
    connect?: SubCentreWhereUniqueInput | SubCentreWhereUniqueInput[]
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

  export type SubCentreUpdateManyWithoutFacilityNestedInput = {
    create?: XOR<SubCentreCreateWithoutFacilityInput, SubCentreUncheckedCreateWithoutFacilityInput> | SubCentreCreateWithoutFacilityInput[] | SubCentreUncheckedCreateWithoutFacilityInput[]
    connectOrCreate?: SubCentreCreateOrConnectWithoutFacilityInput | SubCentreCreateOrConnectWithoutFacilityInput[]
    upsert?: SubCentreUpsertWithWhereUniqueWithoutFacilityInput | SubCentreUpsertWithWhereUniqueWithoutFacilityInput[]
    createMany?: SubCentreCreateManyFacilityInputEnvelope
    set?: SubCentreWhereUniqueInput | SubCentreWhereUniqueInput[]
    disconnect?: SubCentreWhereUniqueInput | SubCentreWhereUniqueInput[]
    delete?: SubCentreWhereUniqueInput | SubCentreWhereUniqueInput[]
    connect?: SubCentreWhereUniqueInput | SubCentreWhereUniqueInput[]
    update?: SubCentreUpdateWithWhereUniqueWithoutFacilityInput | SubCentreUpdateWithWhereUniqueWithoutFacilityInput[]
    updateMany?: SubCentreUpdateManyWithWhereWithoutFacilityInput | SubCentreUpdateManyWithWhereWithoutFacilityInput[]
    deleteMany?: SubCentreScalarWhereInput | SubCentreScalarWhereInput[]
  }

  export type SubCentreUncheckedUpdateManyWithoutFacilityNestedInput = {
    create?: XOR<SubCentreCreateWithoutFacilityInput, SubCentreUncheckedCreateWithoutFacilityInput> | SubCentreCreateWithoutFacilityInput[] | SubCentreUncheckedCreateWithoutFacilityInput[]
    connectOrCreate?: SubCentreCreateOrConnectWithoutFacilityInput | SubCentreCreateOrConnectWithoutFacilityInput[]
    upsert?: SubCentreUpsertWithWhereUniqueWithoutFacilityInput | SubCentreUpsertWithWhereUniqueWithoutFacilityInput[]
    createMany?: SubCentreCreateManyFacilityInputEnvelope
    set?: SubCentreWhereUniqueInput | SubCentreWhereUniqueInput[]
    disconnect?: SubCentreWhereUniqueInput | SubCentreWhereUniqueInput[]
    delete?: SubCentreWhereUniqueInput | SubCentreWhereUniqueInput[]
    connect?: SubCentreWhereUniqueInput | SubCentreWhereUniqueInput[]
    update?: SubCentreUpdateWithWhereUniqueWithoutFacilityInput | SubCentreUpdateWithWhereUniqueWithoutFacilityInput[]
    updateMany?: SubCentreUpdateManyWithWhereWithoutFacilityInput | SubCentreUpdateManyWithWhereWithoutFacilityInput[]
    deleteMany?: SubCentreScalarWhereInput | SubCentreScalarWhereInput[]
  }

  export type FacilityCreateNestedOneWithoutSub_centresInput = {
    create?: XOR<FacilityCreateWithoutSub_centresInput, FacilityUncheckedCreateWithoutSub_centresInput>
    connectOrCreate?: FacilityCreateOrConnectWithoutSub_centresInput
    connect?: FacilityWhereUniqueInput
  }

  export type FacilityUpdateOneRequiredWithoutSub_centresNestedInput = {
    create?: XOR<FacilityCreateWithoutSub_centresInput, FacilityUncheckedCreateWithoutSub_centresInput>
    connectOrCreate?: FacilityCreateOrConnectWithoutSub_centresInput
    upsert?: FacilityUpsertWithoutSub_centresInput
    connect?: FacilityWhereUniqueInput
    update?: XOR<XOR<FacilityUpdateToOneWithWhereWithoutSub_centresInput, FacilityUpdateWithoutSub_centresInput>, FacilityUncheckedUpdateWithoutSub_centresInput>
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

  export type FacilityCreateWithoutDistrictInput = {
    name: string
    facility_code?: string | null
    nin?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    facility_type: FacilityTypeCreateNestedOneWithoutFacilitiesInput
    sub_centres?: SubCentreCreateNestedManyWithoutFacilityInput
  }

  export type FacilityUncheckedCreateWithoutDistrictInput = {
    id?: number
    name: string
    facility_code?: string | null
    nin?: string | null
    facility_type_id: number
    created_at?: Date | string
    updated_at?: Date | string
    sub_centres?: SubCentreUncheckedCreateNestedManyWithoutFacilityInput
  }

  export type FacilityCreateOrConnectWithoutDistrictInput = {
    where: FacilityWhereUniqueInput
    create: XOR<FacilityCreateWithoutDistrictInput, FacilityUncheckedCreateWithoutDistrictInput>
  }

  export type FacilityCreateManyDistrictInputEnvelope = {
    data: FacilityCreateManyDistrictInput | FacilityCreateManyDistrictInput[]
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
    facility_code?: StringNullableFilter<"Facility"> | string | null
    nin?: StringNullableFilter<"Facility"> | string | null
    district_id?: IntFilter<"Facility"> | number
    facility_type_id?: IntFilter<"Facility"> | number
    created_at?: DateTimeFilter<"Facility"> | Date | string
    updated_at?: DateTimeFilter<"Facility"> | Date | string
  }

  export type FacilityCreateWithoutFacility_typeInput = {
    name: string
    facility_code?: string | null
    nin?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    district: DistrictCreateNestedOneWithoutFacilitiesInput
    sub_centres?: SubCentreCreateNestedManyWithoutFacilityInput
  }

  export type FacilityUncheckedCreateWithoutFacility_typeInput = {
    id?: number
    name: string
    facility_code?: string | null
    nin?: string | null
    district_id: number
    created_at?: Date | string
    updated_at?: Date | string
    sub_centres?: SubCentreUncheckedCreateNestedManyWithoutFacilityInput
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
  }

  export type DistrictUncheckedCreateWithoutFacilitiesInput = {
    id?: number
    name: string
    created_at?: Date | string
    updated_at?: Date | string
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

  export type SubCentreCreateWithoutFacilityInput = {
    name: string
    facility_code?: string | null
    nin?: string | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type SubCentreUncheckedCreateWithoutFacilityInput = {
    id?: number
    name: string
    facility_code?: string | null
    nin?: string | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type SubCentreCreateOrConnectWithoutFacilityInput = {
    where: SubCentreWhereUniqueInput
    create: XOR<SubCentreCreateWithoutFacilityInput, SubCentreUncheckedCreateWithoutFacilityInput>
  }

  export type SubCentreCreateManyFacilityInputEnvelope = {
    data: SubCentreCreateManyFacilityInput | SubCentreCreateManyFacilityInput[]
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
  }

  export type DistrictUncheckedUpdateWithoutFacilitiesInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
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

  export type SubCentreUpsertWithWhereUniqueWithoutFacilityInput = {
    where: SubCentreWhereUniqueInput
    update: XOR<SubCentreUpdateWithoutFacilityInput, SubCentreUncheckedUpdateWithoutFacilityInput>
    create: XOR<SubCentreCreateWithoutFacilityInput, SubCentreUncheckedCreateWithoutFacilityInput>
  }

  export type SubCentreUpdateWithWhereUniqueWithoutFacilityInput = {
    where: SubCentreWhereUniqueInput
    data: XOR<SubCentreUpdateWithoutFacilityInput, SubCentreUncheckedUpdateWithoutFacilityInput>
  }

  export type SubCentreUpdateManyWithWhereWithoutFacilityInput = {
    where: SubCentreScalarWhereInput
    data: XOR<SubCentreUpdateManyMutationInput, SubCentreUncheckedUpdateManyWithoutFacilityInput>
  }

  export type SubCentreScalarWhereInput = {
    AND?: SubCentreScalarWhereInput | SubCentreScalarWhereInput[]
    OR?: SubCentreScalarWhereInput[]
    NOT?: SubCentreScalarWhereInput | SubCentreScalarWhereInput[]
    id?: IntFilter<"SubCentre"> | number
    name?: StringFilter<"SubCentre"> | string
    facility_code?: StringNullableFilter<"SubCentre"> | string | null
    nin?: StringNullableFilter<"SubCentre"> | string | null
    facility_id?: IntFilter<"SubCentre"> | number
    created_at?: DateTimeFilter<"SubCentre"> | Date | string
    updated_at?: DateTimeFilter<"SubCentre"> | Date | string
  }

  export type FacilityCreateWithoutSub_centresInput = {
    name: string
    facility_code?: string | null
    nin?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    district: DistrictCreateNestedOneWithoutFacilitiesInput
    facility_type: FacilityTypeCreateNestedOneWithoutFacilitiesInput
  }

  export type FacilityUncheckedCreateWithoutSub_centresInput = {
    id?: number
    name: string
    facility_code?: string | null
    nin?: string | null
    district_id: number
    facility_type_id: number
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type FacilityCreateOrConnectWithoutSub_centresInput = {
    where: FacilityWhereUniqueInput
    create: XOR<FacilityCreateWithoutSub_centresInput, FacilityUncheckedCreateWithoutSub_centresInput>
  }

  export type FacilityUpsertWithoutSub_centresInput = {
    update: XOR<FacilityUpdateWithoutSub_centresInput, FacilityUncheckedUpdateWithoutSub_centresInput>
    create: XOR<FacilityCreateWithoutSub_centresInput, FacilityUncheckedCreateWithoutSub_centresInput>
    where?: FacilityWhereInput
  }

  export type FacilityUpdateToOneWithWhereWithoutSub_centresInput = {
    where?: FacilityWhereInput
    data: XOR<FacilityUpdateWithoutSub_centresInput, FacilityUncheckedUpdateWithoutSub_centresInput>
  }

  export type FacilityUpdateWithoutSub_centresInput = {
    name?: StringFieldUpdateOperationsInput | string
    facility_code?: NullableStringFieldUpdateOperationsInput | string | null
    nin?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    district?: DistrictUpdateOneRequiredWithoutFacilitiesNestedInput
    facility_type?: FacilityTypeUpdateOneRequiredWithoutFacilitiesNestedInput
  }

  export type FacilityUncheckedUpdateWithoutSub_centresInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    facility_code?: NullableStringFieldUpdateOperationsInput | string | null
    nin?: NullableStringFieldUpdateOperationsInput | string | null
    district_id?: IntFieldUpdateOperationsInput | number
    facility_type_id?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FacilityCreateManyDistrictInput = {
    id?: number
    name: string
    facility_code?: string | null
    nin?: string | null
    facility_type_id: number
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type FacilityUpdateWithoutDistrictInput = {
    name?: StringFieldUpdateOperationsInput | string
    facility_code?: NullableStringFieldUpdateOperationsInput | string | null
    nin?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    facility_type?: FacilityTypeUpdateOneRequiredWithoutFacilitiesNestedInput
    sub_centres?: SubCentreUpdateManyWithoutFacilityNestedInput
  }

  export type FacilityUncheckedUpdateWithoutDistrictInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    facility_code?: NullableStringFieldUpdateOperationsInput | string | null
    nin?: NullableStringFieldUpdateOperationsInput | string | null
    facility_type_id?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    sub_centres?: SubCentreUncheckedUpdateManyWithoutFacilityNestedInput
  }

  export type FacilityUncheckedUpdateManyWithoutDistrictInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    facility_code?: NullableStringFieldUpdateOperationsInput | string | null
    nin?: NullableStringFieldUpdateOperationsInput | string | null
    facility_type_id?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FacilityCreateManyFacility_typeInput = {
    id?: number
    name: string
    facility_code?: string | null
    nin?: string | null
    district_id: number
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type FacilityUpdateWithoutFacility_typeInput = {
    name?: StringFieldUpdateOperationsInput | string
    facility_code?: NullableStringFieldUpdateOperationsInput | string | null
    nin?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    district?: DistrictUpdateOneRequiredWithoutFacilitiesNestedInput
    sub_centres?: SubCentreUpdateManyWithoutFacilityNestedInput
  }

  export type FacilityUncheckedUpdateWithoutFacility_typeInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    facility_code?: NullableStringFieldUpdateOperationsInput | string | null
    nin?: NullableStringFieldUpdateOperationsInput | string | null
    district_id?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    sub_centres?: SubCentreUncheckedUpdateManyWithoutFacilityNestedInput
  }

  export type FacilityUncheckedUpdateManyWithoutFacility_typeInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    facility_code?: NullableStringFieldUpdateOperationsInput | string | null
    nin?: NullableStringFieldUpdateOperationsInput | string | null
    district_id?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SubCentreCreateManyFacilityInput = {
    id?: number
    name: string
    facility_code?: string | null
    nin?: string | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type SubCentreUpdateWithoutFacilityInput = {
    name?: StringFieldUpdateOperationsInput | string
    facility_code?: NullableStringFieldUpdateOperationsInput | string | null
    nin?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SubCentreUncheckedUpdateWithoutFacilityInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    facility_code?: NullableStringFieldUpdateOperationsInput | string | null
    nin?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SubCentreUncheckedUpdateManyWithoutFacilityInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    facility_code?: NullableStringFieldUpdateOperationsInput | string | null
    nin?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
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