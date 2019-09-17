# abstract-factory-factory

Inspired by [this blog post](https://khalilstemmler.com/wiki/abstract-factory/), this utilizes `reflect-metadata` + decorators to get factory-created instances of a base class from factories that you register with a decorator.

## Example

```typescript
import { AbstractFactoryFactory } from 'abstract-factory-factory'

interface IPokemonProps {
  name: string
  color: string
}

abstract class Pokemon implements IPokemonProps {
  public name: string
  public color: string

  constructor (props: IPokemonProps) {
    this.name = props.name
    this.color = props.color
  }

  abstract attack(): string
}

// Create Abstract Factory and decorator to register factories
const PokemonFactory = AbstractFactoryFactory.createAbstractFactory(Pokemon)
const registerPokemonFactory = AbstractFactoryFactory.createRegisterFactoryDecorator(Pokemon)

class Pikachu extends Pokemon {
  private isElectricCat: boolean

  constructor (isElectricCat: boolean) {
    super({ name: 'Pikachu', color: 'yellow' })
    this.isElectricCat = isElectricCat
  }

  attack(): string {
    if (this.isElectricCat) {
      return 'Zap attack!'
    }
    return 'Scratch!'
  }
}

@registerPokemonFactory(Pikachu)
class PikachuFactory {
  public static create() {
    return new Pikachu(true)
  }
}

class Snorlax extends Pokemon {
  private asleep: boolean

  constructor(asleep: boolean) {
    super({ name: 'Snorlax', color: 'blue'})
    this.asleep = asleep
  }

  attack(): string {
    if (!this.asleep) {
      return 'Body slam!'
    }
    return 'Snorlax is still asleep...'
  }
}

@registerPokemonFactory(Snorlax)
class SnorlaxFactory {
  public static create() {
    return new Snorlax(true)
  }
}

const electricCat = PokemonFactory.create(Pikachu)
const sleepingSnorlax = PokemonFactory.create(Snorlax)

console.log(electricCat.attack())
console.log(sleepingSnorlax.attack())

// Output:
//   Zap attack!
//   Snorlax is still asleep...
```
