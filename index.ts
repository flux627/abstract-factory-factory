import 'reflect-metadata'

type Ctor<T> = Function & { prototype: T }
type FactoryCtor<T> = { create(): T }
type RegisteredFactoryMap<T> = Map<Ctor<T>, FactoryCtor<T>>

export class AbstractFactoryFactory {
  static createAbstractFactory<B extends Object>(baseClass: Ctor<B>) {
    return class AbstractFactory {
      public static create<S extends B>(subCtor: Ctor<S>): B {
        let registeredFactoryMap: RegisteredFactoryMap<B> | undefined = Reflect.getMetadata(
          'registeredFactoryMap',
          baseClass,
        )
        if (!registeredFactoryMap) {
          registeredFactoryMap = new Map()
        }
        const factory = registeredFactoryMap.get(subCtor)
        if (!factory) {
          throw Error(`No factory was registered for class '${subCtor.name}'.`)
        }
        return factory.create()
      }
    }
  }

  static createRegisterFactoryDecorator<B extends Object>(baseClass: Ctor<B>) {
    return <S extends B>(subCtor: Ctor<S>) => {
      return (factoryCtor: FactoryCtor<S>) => {
        let registeredFactoryMap: RegisteredFactoryMap<S> | undefined = Reflect.getMetadata(
          'registeredFactoryMap',
          baseClass,
        )
        if (!registeredFactoryMap) {
          registeredFactoryMap = new Map()
        }
        registeredFactoryMap.set(subCtor, factoryCtor)
        Reflect.defineMetadata('registeredFactoryMap', registeredFactoryMap, baseClass)
      }
    }
  }
}
