## Lección 1: Introducción a la Programación Orientada a Objetos (POO)

¡Hola! Bienvenido a tu primera lección de Programación Orientada a Objetos, o POO. Imagina que la programación es como construir cosas. Antes, construíamos pieza por pieza, como un castillo de arena. Con POO, es como usar bloques de LEGO: cada bloque ya tiene una forma y una función, y podemos unirlos para crear algo más grande y complejo.

**¿Qué es POO?**
POO es una forma de organizar tu código para que se parezca más al mundo real. En lugar de pensar en "acciones" que el programa debe hacer, pensamos en "cosas" (objetos) que tienen características y pueden hacer cosas.

**Analogía Visual: Un Coche**
Piensa en un coche. Un coche tiene características (color, marca, modelo, velocidad) y puede hacer acciones (acelerar, frenar, girar). En POO, el "coche" sería un **objeto**.

**Beneficios de POO:**
1.  **Organización:** Tu código es más fácil de entender y mantener.
2.  **Reutilización:** Puedes usar los mismos "bloques" (objetos) en diferentes partes de tu programa.
3.  **Flexibilidad:** Es más fácil añadir nuevas características o cambiar las existentes.

**Próxima Lección:** Aprenderemos cómo crear estos "bloques" llamados Clases y Objetos.

---

## Lección 2: Clases y Objetos

En la lección anterior, hablamos de los "bloques de LEGO" de la POO. Ahora, vamos a ver cómo se crean: con **Clases** y **Objetos**.

**Analogía Visual: Un Molde de Galletas y las Galletas**
Imagina que quieres hacer muchas galletas iguales. No haces cada galleta desde cero, ¿verdad? Usas un **molde de galletas**. El molde es la **Clase**. Todas las galletas que haces con ese molde son los **Objetos**.

*   **Clase:** Es el **plano, el molde, la plantilla** para crear objetos. Define las características (propiedades) y las acciones (métodos) que tendrán todos los objetos de ese tipo.
*   **Objeto:** Es una **instancia real** de una clase. Es la galleta hecha con el molde. Cada objeto tiene sus propios valores para las características definidas por la clase.

**Ejemplo en JavaScript:**
```javascript
// La Clase 'Coche' (el molde)
class Coche {
  constructor(marca, modelo, color) {
    this.marca = marca; // Característica: marca
    this.modelo = modelo; // Característica: modelo
    this.color = color;   // Característica: color
  }

  // Acción: mostrar información
  mostrarInfo() {
    console.log(`Este es un ${this.color} ${this.marca} ${this.modelo}.`);
  }

  // Acción: acelerar
  acelerar() {
    console.log("El coche está acelerando.");
  }
}

// Creamos Objetos 'miCoche' y 'otroCoche' (las galletas)
const miCoche = new Coche("Toyota", "Corolla", "rojo");
const otroCoche = new Coche("Honda", "Civic", "azul");

miCoche.mostrarInfo(); // Salida: Este es un rojo Toyota Corolla.
otroCoche.acelerar(); // Salida: El coche está acelerando.
```

En este ejemplo, `Coche` es la clase, y `miCoche` y `otroCoche` son objetos creados a partir de esa clase. Cada uno tiene sus propios valores de `marca`, `modelo` y `color`, pero ambos pueden `mostrarInfo()` y `acelerar()`.

**Próxima Lección:** Veremos cómo las clases pueden "heredar" características de otras clases.

---

## Lección 3: Herencia

¡Imagina que tienes una familia! Tú heredas características de tus padres, ¿verdad? En POO, la **Herencia** funciona de manera similar: una clase puede heredar características y acciones de otra clase.

**Analogía Visual: Padres e Hijos**
*   **Clase Padre (Superclase):** Es como el padre. Define características y acciones generales.
*   **Clase Hija (Subclase):** Es como el hijo. Hereda todo del padre y, además, puede tener sus propias características y acciones especiales.

**Beneficios de la Herencia:**
*   **Reutilización de Código:** No tienes que escribir las mismas características y acciones una y otra vez.
*   **Organización:** Ayuda a crear una jerarquía lógica en tu código.

**Ejemplo en JavaScript:**
```javascript
// Clase Padre: Vehiculo
class Vehiculo {
  constructor(ruedas, velocidadMaxima) {
    this.ruedas = ruedas;
    this.velocidadMaxima = velocidadMaxima;
  }

  arrancar() {
    console.log("El vehículo ha arrancado.");
  }

  detener() {
    console.log("El vehículo se ha detenido.");
  }
}

// Clase Hija: Coche (hereda de Vehiculo)
class Coche extends Vehiculo {
  constructor(marca, modelo, ruedas, velocidadMaxima) {
    super(ruedas, velocidadMaxima); // Llama al constructor del padre
    this.marca = marca;
    this.modelo = modelo;
  }

  tocarBocina() {
    console.log("¡Piiip, piiip!");
  }

  // Podemos redefinir un método del padre (esto se llama Polimorfismo, ¡lo veremos después!)
  arrancar() {
    console.log(`El coche ${this.marca} ha arrancado suavemente.`);
  }
}

const miCoche = new Coche("Tesla", "Model 3", 4, 250);
miCoche.arrancar();    // Salida: El coche Tesla ha arrancado suavemente.
miCoche.tocarBocina(); // Salida: ¡Piiip, piiip!
miCoche.detener();     // Salida: El vehículo se ha detenido.
```

Aquí, `Coche` hereda `ruedas`, `velocidadMaxima`, `arrancar()` y `detener()` de `Vehiculo`. Además, `Coche` tiene su propia `marca`, `modelo` y `tocarBocina()`.

**Próxima Lección:** Descubriremos cómo proteger la información de nuestros objetos.

---

## Lección 4: Encapsulamiento

Imagina que tienes una caja fuerte. Dentro guardas tus cosas más valiosas y solo tú tienes la llave. El **Encapsulamiento** en POO es muy parecido: se trata de **proteger la información** dentro de un objeto y controlar cómo se accede a ella o se modifica.

**Analogía Visual: Una Caja Fuerte**
*   **Caja Fuerte (Objeto):** Contiene datos y métodos.
*   **Contenido (Datos Privados):** Solo se puede acceder a ellos de forma controlada.
*   **Llave/Mecanismo (Métodos Públicos):** Son las únicas formas de interactuar con el contenido de la caja fuerte.

**Beneficios del Encapsulamiento:**
*   **Seguridad:** Evita que otros programadores (o tú mismo por error) cambien datos importantes de forma incorrecta.
*   **Mantenibilidad:** Si cambias cómo funciona algo dentro del objeto, no afectará a otras partes del programa que lo usan, siempre y cuando la "llave" (el método público) siga funcionando igual.

**Ejemplo en JavaScript (usando convenciones y propiedades privadas con `#`):**
```javascript
class CuentaBancaria {
  #saldo; // Propiedad privada, no se puede acceder directamente desde fuera

  constructor(saldoInicial) {
    this.#saldo = saldoInicial; // Inicializamos el saldo
  }

  // Método público para depositar dinero
  depositar(cantidad) {
    if (cantidad > 0) {
      this.#saldo += cantidad;
      console.log(`Depósito de ${cantidad}. Nuevo saldo: ${this.#saldo}`);
    } else {
      console.log("La cantidad a depositar debe ser positiva.");
    }
  }

  // Método público para retirar dinero
  retirar(cantidad) {
    if (cantidad > 0 && cantidad <= this.#saldo) {
      this.#saldo -= cantidad;
      console.log(`Retiro de ${cantidad}. Nuevo saldo: ${this.#saldo}`);
    } else {
      console.log("Cantidad inválida o saldo insuficiente.");
    }
  }

  // Método público para ver el saldo (solo lectura)
  verSaldo() {
    return this.#saldo;
  }
}

const miCuenta = new CuentaBancaria(100);
miCuenta.depositar(50); // Salida: Depósito de 50. Nuevo saldo: 150
miCuenta.retirar(30);  // Salida: Retiro de 30. Nuevo saldo: 120
// console.log(miCuenta.#saldo); // ¡Esto daría un error! El saldo es privado.
console.log("Saldo actual: " + miCuenta.verSaldo()); // Salida: Saldo actual: 120
```

En este ejemplo, `#saldo` es privado. Solo puedes cambiarlo o verlo a través de los métodos `depositar`, `retirar` y `verSaldo`. Esto asegura que el saldo nunca se manipule de forma incorrecta.

**Próxima Lección:** Exploraremos cómo un mismo método puede comportarse de diferentes maneras.

---

## Lección 5: Polimorfismo

La palabra **Polimorfismo** viene del griego y significa "muchas formas". En POO, se refiere a la capacidad de un objeto de tomar **muchas formas** o, más precisamente, la capacidad de un método de comportarse de **diferentes maneras** según el objeto que lo llama.

**Analogía Visual: Un Botón de "Reproducir"**
Imagina un botón de "Reproducir" (▶️). Si lo pulsas en un reproductor de música, reproduce una canción. Si lo pulsas en un reproductor de video, reproduce una película. El botón es el mismo, pero la acción que realiza es diferente según el tipo de reproductor. ¡Eso es polimorfismo!

**Tipos de Polimorfismo (simplificado):**
1.  **Por Sobreescritura (Override):** Una clase hija redefine un método que ya existía en su clase padre. Vimos un ejemplo con `arrancar()` en la lección de Herencia.
2.  **Por Sobrecarga (Overload - no nativo en JS, pero el concepto existe):** Aunque JavaScript no lo soporta directamente como otros lenguajes, la idea es tener varios métodos con el mismo nombre pero con diferentes parámetros.

**Ejemplo en JavaScript (Polimorfismo por Sobreescritura):**
```javascript
// Clase Padre
class Animal {
  hacerSonido() {
    console.log("El animal hace un sonido.");
  }
}

// Clase Hija: Perro
class Perro extends Animal {
  hacerSonido() { // Sobreescribe el método del padre
    console.log("El perro ladra: ¡Guau, guau!");
  }
}

// Clase Hija: Gato
class Gato extends Animal {
  hacerSonido() { // Sobreescribe el método del padre
    console.log("El gato maúlla: ¡Miau, miau!");
  }
}

const miAnimal = new Animal();
const miPerro = new Perro();
const miGato = new Gato();

miAnimal.hacerSonido(); // Salida: El animal hace un sonido.
miPerro.hacerSonido();  // Salida: El perro ladra: ¡Guau, guau!
miGato.hacerSonido();   // Salida: El gato maúlla: ¡Miau, miau!
```

Aquí, cada animal tiene un método `hacerSonido()`, pero cada uno lo implementa de una manera diferente. El mismo nombre de método (`hacerSonido`) tiene "muchas formas" de ejecutarse.

¡Felicidades! Has completado las lecciones fundamentales de POO. Ahora tienes una base sólida para construir programas más complejos y organizados. ¡Sigue practicando y explorando!
