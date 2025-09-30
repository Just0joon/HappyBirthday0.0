function isTouchDevice() {
	return 'ontouchstart' in window || navigator.maxTouchPoints > 0
}

$(document).ready(() => {
	let selectAttack = false
	let mobile = isTouchDevice()
	console.log(`mobile: ${mobile}`)

	let isItTimeParadox = false
	let isPacifist = true

	let abilityUsed = false
	let attack1Used = false
	let attack2Used = false
	let attack3Used = false

	let attack1Img = document.getElementById('attack1')
	let attack2Img = document.getElementById('attack2')
	let attack3Img = document.getElementById('attack3')
	let ability = document.getElementById('ability')

	function randomNumber(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min
	}

	class Character {
		constructor(name, isEnemy) {
			this.name = name
			this.isEnemy = isEnemy

			this.isOn = null

			this.abilityUsed = false

			// Основные характеристики
			this.maxHp = 100
			this.hp = 100
			this.maxArmor = 40
			this.armor = 40
			this.maxMana = 10
			this.mana = 0

			// Атакующие параметры
			this.attack1Mana = 2
			this.attack2Mana = 4
			this.attack3Mana = 6

			// Флаги доступности атак
			this.canUseAttack1 = true
			this.canUseAttack2 = true
			this.canUseAttack3 = true

			this.updateUI()
		}

		setHover() {
			$(attack1Img).on('mouseover', () => {
				$('#attackInfo').html(this.atk1Html)
			})

			$(attack2Img).on('mouseover', () => {
				$('#attackInfo').html(this.atk2Html)
			})

			$(attack3Img).on('mouseover', () => {
				$('#attackInfo').html(this.atk3Html)
			})

			$(ability).on('mouseover', () => {
				$('#attackInfo').html(this.abilityHtml)
			})
		}

		// Установка противника
		setEnemy(enemy) {
			this.enemy = enemy
		}

		// Обновление интерфейса
		updateUI() {
			const prefix = this.isEnemy ? 'enemy' : 'your'
			$(`#${prefix}Hp`).text(`ОЗ: ${this.hp}/${this.maxHp}`)
			$(`#${prefix}Armor`).text(`Броня: ${this.armor}/${this.maxArmor}`)
			$(`#${prefix}Mana`).text(`Мана: ${this.mana}/${this.maxMana}`)
		}

		updateEnemyUI() {
			const prefix = this.isEnemy ? 'your' : 'enemy'
			$(`#${prefix}Hp`).text(`ОЗ: ${this.enemy.hp}/${this.enemy.maxHp}`)
			$(`#${prefix}Armor`).text(
				`Броня: ${this.enemy.armor}/${this.enemy.maxArmor}`
			)
			$(`#${prefix}Mana`).text(`Мана: ${this.enemy.mana}/${this.enemy.maxMana}`)
		}

		// Базовая атака
		attack(damage) {
			if (!this.enemy) return

			const prefix = this.isEnemy ? 'your' : 'enemy'

			// Анимация атаки
			this.animateEffect(`#${prefix}Hp`, {
				startColor: 'rgb(255, 0, 0)',
				endColor: 'rgb(255, 255, 255)',
				duration: 250,
			})

			// Расчет урона с учетом брони
			const finalDamage = Math.floor(
				Math.max(damage - Math.min(this.enemy.armor, damage * 0.33), 1)
			)
			this.enemy.takeDamage(finalDamage)
		}

		// Получение урона
		takeDamage(damage) {
			this.hp = Math.max(this.hp - damage, 0)
			this.updateUI()
		}

		heal(amount) {
			const prefix = this.isEnemy ? 'enemy' : 'your'

			this.hp = Math.min(this.hp + amount, this.maxHp)
			this.updateUI()

			// Анимация лечения
			this.animateEffect(`#${prefix}Hp`, {
				startColor: 'rgb(0, 255, 0)',
				endColor: 'rgb(255, 255, 255)',
				duration: 250,
			})
		}

		breakEnemyArmor(amount) {
			if (!this.enemy) return

			this.enemy.armor = Math.max(this.enemy.armor - amount, 0)
			this.updateEnemyUI()
		}

		breakYourArmor(amount) {
			this.armor = Math.max(this.armor - amount, 0)
			this.updateUI()
		}

		repairArmor(amount) {
			this.armor = Math.min(this.armor + amount, this.maxArmor)
			this.updateUI()
		}

		restoreMana(amount) {
			const prefix = this.isEnemy ? 'enemy' : 'your'

			this.mana = Math.min(this.mana + amount, this.maxMana)
			this.updateUI()

			// Анимация восстановления маны
			this.animateEffect(`#${prefix}Mana`, {
				startColor: 'rgb(0, 0, 255)',
				endColor: 'rgb(255, 255, 255)',
				duration: 250,
			})
		}

		animateEffect(selector, options) {
			let color = options.startColor
			const endColor = options.endColor
			const duration = options.duration
			const interval = duration / 50 // 50 шагов анимации

			let step = 0
			const stepSize = 1 / 50

			const animate = () => {
				if (step >= 1) {
					$(selector).css('color', endColor)
					return
				}

				const r = Math.round(
					this.lerp(this.getR(color), this.getR(endColor), step)
				)
				const g = Math.round(
					this.lerp(this.getG(color), this.getG(endColor), step)
				)
				const b = Math.round(
					this.lerp(this.getB(color), this.getB(endColor), step)
				)

				$(selector).css('color', `rgb(${r}, ${g}, ${b})`)

				step += stepSize
				setTimeout(animate, interval)
			}

			animate()
		}

		getR(color) {
			return parseInt(color.match(/\d+/g)[0])
		}

		getG(color) {
			return parseInt(color.match(/\d+/g)[1])
		}

		getB(color) {
			return parseInt(color.match(/\d+/g)[2])
		}

		lerp(a, b, t) {
			return a + (b - a) * t
		}

		specialAttack1() {}

		specialAttack2() {}

		specialAttack3() {}

		specialAbility() {}

		pasteAttacksSrc() {
			attack1Img.src = this.attack1Src
			attack2Img.src = this.attack2Src
			attack3Img.src = this.attack3Src
			ability.src = this.abilitySrc
		}

		BotAttack() {
			if (!this.enemy) return

			if (this.mana >= this.attack1Mana) {
				this.canUseAttack1 = true
			}
			if (this.mana >= this.attack2Mana) {
				this.canUseAttack2 = true
			}
			if (this.mana >= this.attack3Mana) {
				this.canUseAttack3 = true
			}

			this.useRandomAttack()
		}

		useRandomAttack() {
			this.hpPercent = this.hp / this.maxHp
			this.armorPercent = this.armor / this.maxArmor
			this.manaPercent = this.armor / this.maxArmor
			if (this.mana < this.attack1Mana) {
				this.specialAbility()
				console.log('specialAttack')
				return
			} else if (this.mana < this.attack3Mana) {
				if (this.hp < this.maxHp || this.enemy.armorPercent > 0.5) {
					this.random = randomNumber(1, 2)
					console.log('random: ' + this.random)
					if (this.random == 1) {
						this.specialAbility()
						console.log('specialAttack')
						this.WantUseAttack3 = true
						return
					}
				}
			}
			let canUseAttacks = []
			if (this.canUseAttack1 && this.hpPercent > 0.5) {
				canUseAttacks.push(1)
			}
			if (this.canUseAttack2 && this.hpPercent > 0.5) {
				canUseAttacks.push(2)
			}
			if (this.canUseAttack3) {
				if (this.hp < this.maxHp || this.armor != this.maxArmor) {
					canUseAttacks.push(3)
				}
			}

			if (this.WantUseAttack3) {
				this.specialAttack3()
				console.log('attack3')
				return
			}

			if (canUseAttacks.length == 1) {
				if (this.canUseAttack1) {
					this.randomFunction = 1
				} else if (this.canUseAttack2) {
					this.randomFunction = 2
				} else if (this.canUseAttack3) {
					this.randomFunction = 3
				}
			}
			if (this.canUseAttack2) {
				this.randomFunction = randomNumber(
					Math.min(...canUseAttacks),
					Math.max(...canUseAttacks)
				)
			} else {
				this.random = randomNumber(1, 2)
				if (this.random == 1) {
					this.randomFunction = 1
				} else {
					this.randomFunction = 3
				}
			}

			console.log(`attack${this.randomFunction}`)
			switch (this.randomFunction) {
				case 1:
					this.specialAttack1()
					break
				case 2:
					this.specialAttack2()
					break
				case 3:
					this.specialAttack3()
					break
			}
		}
	}

	class Gravity extends Character {
		constructor(name, isEnemy) {
			super(name, isEnemy)

			this.r = 0
			this.g = 0
			this.b = 0

			this.atk1Html = `<b>атака1 - в тему:</b><p>наносит 20 урона и исцеляет 3 оз. Требует маны: 3</p>`
			this.atk2Html = `<b>атака2 - угадай че выкину:</b><p>Наносит от 15 до 35 урона. Требует маны: 3</p>`
			this.atk3Html = `<b>атака3 - нарушение гравитации:</b><p>Исцеляет от 10 до 20 оз, ломает от 5 до 10 щита соперника и наносит от 10 до 20 урона. Требует маны: 4</p>`
			this.abilityHtml = `<b>способность - земной подарок:</b><p>либо дает 1 ману, либо исцеляет 5 оз, либо чинит 2 щита</p>`

			this.attack1Mana = 3
			this.attack2Mana = 3
			this.attack3Mana = 4

			// Основные характеристики
			this.maxHp = randomNumber(40, 100)
			this.hp = this.maxHp
			this.maxArmor = 20
			this.armor = 20
			this.maxMana = 4
			this.mana = 4

			this.hpPercent = this.hp / this.maxHp
			this.armorPercent = this.armor / this.maxArmor
			this.manaPercent = this.armor / this.maxArmor

			this.attack1Src = 'Cards/Gravity atk1 card.png'
			this.attack2Src = 'Cards/Gravity atk2 card.png'
			this.attack3Src = 'Cards/Gravity atk3 card.png'
			this.abilitySrc = 'Abilities/Gravity Ability.png'

			this.random = null
			this.randomFunction = null

			// Ссылка на противника
			this.enemy = null

			// Обновляем интерфейс
			this.updateUI()

			if (!this.IsEnemy) {
				this.pasteAttacksSrc()
			}
		}

		specialAttack1() {
			if (this.mana >= this.attack1Mana) {
				this.attack(20)
				this.heal(3)
				this.mana -= this.attack1Mana
				this.updateEnemyUI()
				this.updateUI()

				gravityAtk1.currentTime = 0
				gravityAtk1.play()
			}
		}

		specialAttack2() {
			if (this.mana >= this.attack2Mana) {
				this.attack(randomNumber(15, 35))
				this.mana -= this.attack2Mana
				this.updateEnemyUI()
				this.updateUI()

				gravityAtk2.currentTime = 0
				gravityAtk2.play()
			}
		}

		specialAttack3() {
			const who = this.isEnemy ? 'enemy' : 'you'
			if (this.mana >= this.attack3Mana) {
				console.log(
					`${who}:\nТвои ОЗ: ${this.hp};\nБроня противника: ${this.enemy.armor};\n ОЗ противника: ${this.enemy.hp}`
				)
				this.heal(randomNumber(10, 20))
				this.breakEnemyArmor(randomNumber(5, 10))
				this.attack(randomNumber(10, 20))
				this.mana -= this.attack3Mana
				console.log(
					`${who}:\nТвои ОЗ: ${this.hp};\nБроня противника: ${this.enemy.armor};\n ОЗ противника: ${this.enemy.hp}`
				)
				this.updateEnemyUI()
				this.updateUI()

				gravityAtk3.volume = 0.1
				gravityAtk3.currentTime = 0
				gravityAtk3.play()
			}
		}

		specialAbility() {
			gravityAbility.volume = 0.2
			gravityAbility.currentTime = 0
			gravityAbility.play()
			const randomEffect = randomNumber(1, 3)
			if (randomEffect == 1) {
				this.restoreMana(1)
			} else if (randomEffect == 2) {
				this.heal(5)
			} else {
				this.repairArmor(2)
			}
		}

		BotAttack() {
			if (!this.enemy) return

			if (this.mana >= this.attack1Mana) {
				this.canUseAttack1 = true
			}
			if (this.mana >= this.attack2Mana) {
				this.canUseAttack2 = true
			}
			if (this.mana >= this.attack3Mana) {
				this.canUseAttack3 = true
			}

			this.useRandomAttack()
		}

		useRandomAttack() {
			this.hpPercent = this.hp / this.maxHp
			this.armorPercent = this.armor / this.maxArmor
			this.manaPercent = this.armor / this.maxArmor
			if (this.mana < this.attack1Mana) {
				this.specialAbility()
				console.log('specialAttack')
				return
			} else if (this.mana < this.attack3Mana) {
				if (this.hp < this.maxHp || this.enemy.armorPercent > 0.5) {
					this.random = randomNumber(1, 2)
					console.log('random: ' + this.random)
					if (this.random == 1) {
						this.specialAbility()
						console.log('specialAttack')
						this.WantUseAttack3 = true
						return
					}
				}
			}
			let canUseAttacks = []
			if (this.canUseAttack1 && this.hpPercent > 0.5) {
				canUseAttacks.push(1)
			}
			if (this.canUseAttack2 && this.hpPercent > 0.5) {
				canUseAttacks.push(2)
			}
			if (this.canUseAttack3) {
				if (this.hp < this.maxHp || this.armor != this.maxArmor) {
					canUseAttacks.push(3)
				}
			}

			if (this.WantUseAttack3) {
				this.specialAttack3()
				console.log('attack3')
				return
			}

			if (canUseAttacks.length == 1) {
				if (this.canUseAttack1) {
					this.randomFunction = 1
				} else if (this.canUseAttack2) {
					this.randomFunction = 2
				} else if (this.canUseAttack3) {
					this.randomFunction = 3
				}
			}
			if (this.canUseAttack2) {
				this.randomFunction = randomNumber(
					Math.min(...canUseAttacks),
					Math.max(...canUseAttacks)
				)
			} else {
				this.random = randomNumber(1, 2)
				if (this.random == 1) {
					this.randomFunction = 1
				} else {
					this.randomFunction = 3
				}
			}

			console.log(`attack${this.randomFunction}`)
			switch (this.randomFunction) {
				case 1:
					this.specialAttack1()
					break
				case 2:
					this.specialAttack2()
					break
				case 3:
					this.specialAttack3()
					break
			}
		}
	}

	class Shelly extends Character {
		constructor(name, isEnemy) {
			super(name, isEnemy)

			this.abilityMana = 1

			this.r = 0
			this.g = 0
			this.b = 0

			this.attack1Mana = 2
			this.attack2Mana = 5
			this.attack3Mana = 6

			this.atk1Html = `<b>атака1 - веселая поддержка:</b><p>Исцеляет себе 8 оз и наносит сопернику 6 урона. Требует маны: 2</p>`
			this.atk2Html = `<b>атака2 - zip zip zip:</b><p>Ломает противнику 10 брони и наносит 10 урона. Требует маны: 5</p>`
			this.atk3Html = `<b>атака3 - смайл фэйс:</b><p>Ослепляет своим позитивом. сносит сопернику 12 брони и наносит 35 урона. После этого исцеляет себе 5 оз.Требует маны: 6</p>`
			this.abilityHtml = `<b>способность - свежий раф:</b><p>Восстанавливает 1 ману, 1 оз и 1 броню</p>`

			this.maxArmor = 10
			this.armor = 10
			this.maxHp = 60
			this.hp = 60
			this.maxMana = 8
			this.mana = 8

			this.isOn = false

			this.hpPercent = this.hp / this.maxHp
			this.armorPercent = this.armor / this.maxArmor
			this.manaPercent = this.armor / this.maxArmor

			this.enemy = null

			this.random = null
			this.randomFunction = null

			this.attack1Src = 'Cards/Shelly atk1 card.png'
			this.attack2Src = 'Cards/Shelly atk2 card.png'
			this.attack3Src = 'Cards/Shelly atk3 card.png'
			this.abilitySrc = 'Abilities/Shelly Ability.png'

			this.canUseAttack1 = null
			this.canUseAttack2 = null
			this.canUseAttack3 = null

			this.WantUseAttack3 = null

			this.updateUI()

			if (!this.isEnemy) {
				this.pasteAttacksSrc()
			}
		}

		specialAttack1() {
			if (this.mana >= this.attack1Mana) {
				this.mana -= this.attack1Mana
				this.heal(8)
				this.attack(6)

				this.updateEnemyUI()
				this.updateUI()
			}
		}

		specialAttack2() {
			if (this.mana >= this.attack2Mana) {
				this.mana -= this.attack2Mana
				this.breakEnemyArmor(10)
				this.attack(10)

				this.updateEnemyUI()
				this.updateUI()

				shellyAtk2.currentTime = 0
				shellyAtk2.play()
			}
		}

		specialAttack3() {
			if (this.mana >= this.attack3Mana) {
				this.mana -= this.attack3Mana
				this.breakEnemyArmor(12)
				this.attack(35)
				this.heal(5)

				this.updateEnemyUI()
				this.updateUI()

				shellyAtk3.currentTime = 0
				shellyAtk3.play()
			}
		}

		specialAbility() {
			this.restoreMana(1)
			this.repairArmor(1)
			this.heal(1)

			this.updateUI()

			shellyAbility.currentTime = 0
			shellyAbility.play()
		}

		useRandomAttack() {
			this.hpPercent = this.hp / this.maxHp
			this.armorPercent = this.armor / this.maxArmor
			this.enemy.armorPercent = this.enemy.armor / this.enemy.maxArmor

			if (this.mana >= this.attack3Mana) {
				this.specialAttack3()
				console.log('attack3')
				return
			}

			if (this.hpPercent < 0.2 && this.mana >= this.attack1Mana) {
				this.specialAttack1()
				console.log('attack1')
				return
			} else if (
				this.enemy.armorPercent > 0.5 &&
				this.mana >= this.attack2Mana
			) {
				this.random = randomNumber(1, 2)
				if (this.random == 1) {
					this.specialAttack2()
					console.log('attack2')
					return
				}
			} else {
				this.random = randomNumber(1, 2)
				if (this.random == 1) {
					if (this.mana >= this.attack3Mana) {
						this.specialAttack3()
						console.log('attack3')
						return
					} else {
						this.WantUseAttack3 = true
						this.specialAbility()
						console.log('ability')
						return
					}
				}
			}

			const availableAttacks = []

			if (this.mana >= this.attack1Mana) availableAttacks.push(1)
			if (this.mana >= this.attack2Mana) availableAttacks.push(2)
			if (this.mana >= this.attack3Mana) availableAttacks.push(3)

			if (availableAttacks.length === 0) {
				this.specialAbility()
				return
			}

			const randomAttack =
				availableAttacks[Math.floor(Math.random() * availableAttacks.length)]

			switch (randomAttack) {
				case 1:
					this.specialAttack1()
					console.log('attack1')
					break
				case 2:
					this.specialAttack2()
					console.log('attack2')
					break
				case 3:
					this.specialAttack3()
					console.log('attack3')
					break
			}
		}
	}

	class Pumpkin extends Character {
		constructor(name, isEnemy) {
			super(name, isEnemy)

			this.abilityMana = 1

			this.r = 0
			this.g = 0
			this.b = 0

			this.attack1Mana = 2
			this.attack2Mana = 4
			this.attack3Mana = 0

			this.atk1Html = `<b>атака1 - сверкающий глаз:</b><p>Чинит 7 брони и исцеляет 7 оз. Требует маны: 2</p>`
			this.atk2Html = `<b>атака2 - сияние морской волны:</b><p>Смывает 10 брони сопернику, а после наносит 10 урона. Требует маны: 4</p>`
			this.atk3Html = `<b>атака3 - восстановление:</b><p>Восполняет ману до 10, но увеличивает трату энергии со способности на 1. Требует оз: 10</p>`
			this.abilityHtml = `<b>способность - раскат молнии:</b><p>Если макс энергии больше чем 3, то уменьшает макс на 1 и сносит сопернику 5 брони, наносит 15 урона и восстанавливает 1 оз</p>`

			this.maxArmor = 30
			this.armor = 30
			this.maxHp = 80
			this.hp = 80
			this.maxMana = 10
			this.mana = 10

			this.isOn = false

			this.hpPercent = this.hp / this.maxHp
			this.armorPercent = this.armor / this.maxArmor
			this.manaPercent = this.armor / this.maxArmor

			this.enemy = null

			this.random = null
			this.randomFunction = null

			this.attack1Src = 'Cards/Pumpkin atk1 card.png'
			this.attack2Src = 'Cards/Pumpkin atk2 card.png'
			this.attack3Src = 'Cards/Pumpkin atk3 card.png'
			this.abilitySrc = 'Abilities/Pumpkin Ability.png'

			this.canUseAttack1 = null
			this.canUseAttack2 = null
			this.canUseAttack3 = null

			this.WantUseAttack3 = null

			this.updateUI()

			if (!this.IsEnemy) {
				this.pasteAttacksSrc()
			}
		}

		specialAttack1() {
			if (this.mana >= this.attack1Mana) {
				this.repairArmor(7)
				this.heal(7)
				this.mana -= this.attack1Mana
				this.updateUI()
				this.updateEnemyUI()

				pumpkinAtk1.currentTime = 0
				pumpkinAtk1.play()
			}
		}

		specialAttack2() {
			if (this.mana >= this.attack2Mana) {
				this.breakEnemyArmor(10)
				this.attack(10)
				this.mana -= this.attack2Mana
				this.updateUI()
				this.updateEnemyUI()

				pumpkinAtk2.volume = 0.8
				pumpkinAtk2.currentTime = 0
				pumpkinAtk2.play()
			}
		}

		specialAttack3() {
			if (this.mana >= this.attack3Mana) {
				this.takeDamage(10)
				this.abilityMana += 1
				this.maxMana = 10
				this.mana = 10
				this.updateUI()

				pumpkinAtk3.currentTime = 0
				pumpkinAtk3.play()
			}
		}

		specialAbility() {
			if (this.maxMana > 3) {
				this.maxMana -= this.abilityMana
				if (this.mana > this.maxMana) {
					this.mana = this.maxMana
				}
				this.breakEnemyArmor(5)
				this.attack(15)
				this.heal(1)
				this.updateUI()
				this.updateEnemyUI()

				pumpkinAbility.volume = 0.7
				pumpkinAbility.currentTime = 0
				pumpkinAbility.play()
			}
		}

		useRandomAttack() {
			this.hpPercent = this.hp / this.maxHp
			this.enemy.armorPercent = this.enemy.armor / this.enemy.maxArmor

			if (this.maxMana > 3) {
				this.random = randomNumber(1, 2)
				if (this.random == 1) {
					this.specialAbility()
					console.log('ability')
					return
				}
			}

			if (this.hpPercent < 0.4 && this.mana >= this.attack1Mana) {
				this.specialAttack1()
				console.log('attack1')
				return
			} else if (
				this.enemy.armorPercent == 1 &&
				this.mana >= this.attack2Mana
			) {
				this.specialAttack2()
				console.log('attack2')
				return
			} else if (this.enemy.armorPercent > 0.5) {
				this.random = randomNumber(1, 2)
				if (this.random == 1) {
					this.specialAttack2()
					console.log('attack2')
					return
				}
			} else if (this.maxMana <= 3 && this.hp > 10 && this.abilityMana < 5) {
				this.specialAttack3()
				console.log('attack3')
				return
			}

			const availableAttacks = []

			if (this.mana >= this.attack1Mana) availableAttacks.push(1)
			if (this.mana >= this.attack2Mana) availableAttacks.push(2)
			if (this.mana >= this.attack3Mana && this.hp > 10)
				availableAttacks.push(3)

			if (availableAttacks.length === 0) {
				this.specialAbility()
				return
			}

			const randomAttack =
				availableAttacks[Math.floor(Math.random() * availableAttacks.length)]

			switch (randomAttack) {
				case 1:
					this.specialAttack1()
					console.log('attack1')
					break
				case 2:
					this.specialAttack2()
					console.log('attack2')
					break
				case 3:
					this.specialAttack3()
					console.log('attack3')
					break
			}
		}
	}

	class Chara extends Character {
		constructor(name, isEnemy) {
			super(name, isEnemy)

			this.r = 0
			this.g = 0
			this.b = 0

			this.attack1Mana = 0
			this.attack2Mana = 3
			this.attack3Mana = 4

			this.atk1Html = `<b>атака1 - удар ножом:</b><p>Наносит 30 урона с шансом 10%. Требует маны: 0</p>`
			this.atk2Html = `<b>атака2 - внезапный удар:</b><p>Наносит 20 урона. Требует маны: 3</p>`
			this.atk3Html = `<b>атака3 - пробуждение силы:</b><p>Следующий удар ножом наносит 40 урона и ломает 10 брони сопернику с шансом 60%. Требует маны: 4</p>`
			this.abilityHtml = `<b>способность - шоколад:</b><p>Дает 1 ману и если она равна максимуму, то повышает его</p>`

			this.maxArmor = 30
			this.armor = 30
			this.maxHp = 100
			this.hp = 100
			this.maxMana = 3
			this.mana = 3

			this.isOn = false

			this.hpPercent = this.hp / this.maxHp
			this.armorPercent = this.armor / this.maxArmor
			this.manaPercent = this.armor / this.maxArmor

			this.enemy = null

			this.random = null
			this.randomFunction = null

			this.attack1Src = 'Cards/Chara atk1 card.png'
			this.attack2Src = 'Cards/Chara atk2 card.png'
			this.attack3Src = 'Cards/Chara atk3 card.png'
			this.abilitySrc = 'Abilities/Chara Ability.png'

			this.canUseAttack1 = null
			this.canUseAttack2 = null
			this.canUseAttack3 = null

			this.WantUseAttack3 = null

			this.updateUI()

			if (!this.IsEnemy) {
				this.pasteAttacksSrc()
			}
		}

		specialAttack1() {
			this.random = randomNumber(1, 10)
			if (this.isOn) {
				this.isOn = false
				$(attack1Img).css('filter', 'brightness(0.8)')
				if (this.random < 7) {
					this.breakEnemyArmor(10)
					this.attack(40)
					this.updateEnemyUI()
					charaAtk1.currentTime = 0
					charaAtk1.play()
				} else {
					charaAtk1Miss.currentTime = 0
					charaAtk1Miss.play()
				}
			} else {
				if (this.random == 1) {
					this.attack(30)
					this.updateEnemyUI()
					charaAtk1.currentTime = 0
					charaAtk1.play()
				} else {
					charaAtk1Miss.currentTime = 0
					charaAtk1Miss.play()
				}
			}
		}

		specialAttack2() {
			if (this.mana >= this.attack2Mana) {
				this.mana -= this.attack2Mana
				this.attack(20)
				this.updateEnemyUI()
				this.updateUI()
				charaAtk2.currentTime = 0
				charaAtk2.play()
			}
		}

		specialAttack3() {
			if (this.mana >= this.attack3Mana) {
				if (!this.isEnemy) {
					$(attack1Img).css('filter', 'brightness(1.5)')
				}
				this.mana -= this.attack3Mana
				this.isOn = true
				this.updateUI()
				charaAtk3.currentTime = 0
				charaAtk3.play()
			}
		}

		specialAbility() {
			if (this.mana == this.maxMana) {
				this.heal(3)
				this.maxMana = this.mana + 1
				this.restoreMana(1)
				this.updateUI()
			} else {
				this.heal(3)
				this.restoreMana(1)
				this.updateUI()
			}
			charaAbility.currentTime = 0
			charaAbility.play()
		}

		useRandomAttack() {
			if (this.mana < 1 || this.maxMana < this.attack3Mana) {
				this.random = randomNumber(1, 2)
				if (this.random == 1) {
					this.specialAbility()
					this.abilityUsed = true
					return
				}
			}
			if (
				this.enemy.armor / this.enemy.maxArmor > 0.5 &&
				!this.WantUseAttack3
			) {
				this.random = randomNumber(1, 3)
				if (this.random > 1) {
					if (this.mana < this.attack3Mana) {
						this.WantUseAttack3 = true
					} else {
						this.specialAttack3()
						console.log('attack3')
					}
				}
			}

			if (this.WantUseAttack3 && !this.isOn) {
				if (this.mana < this.attack3Mana) {
					this.specialAbility()
					console.log('ability')
					return
				} else {
					this.WantUseAttack3 = false
					this.specialAttack3()
					console.log('attack3')
					return
				}
			} else if (this.isOn) {
				this.specialAttack1()
				console.log('attack1')
				return
			}
			const availableAttacks = []

			if (this.mana >= this.attack1Mana) availableAttacks.push(1)
			if (this.mana >= this.attack2Mana) availableAttacks.push(2)
			if (this.mana >= this.attack3Mana) availableAttacks.push(3)

			if (availableAttacks.length === 0) {
				this.specialAbility()
				return
			}

			const randomAttack =
				availableAttacks[Math.floor(Math.random() * availableAttacks.length)]

			switch (randomAttack) {
				case 1:
					this.specialAttack1()
					console.log('attack1')
					break
				case 2:
					this.specialAttack2()
					console.log('attack2')
					break
				case 3:
					this.specialAttack3()
					console.log('attack3')
					break
			}
		}
	}

	const characters = [
		document.getElementById('chara') || null,
		document.getElementById('gravity') || null,
		document.getElementById('pumpkin') || null,
		document.getElementById('shelly') || null,
	]

	const characterClasses = {
		'Characters and Skins/Chara.png': Chara,
		'Characters and Skins/Chara (skin - aggressive).gif': Chara,
		'Characters and Skins/Chara (skin - Frisk).png': Chara,
		'Characters and Skins/Gravity.png': Gravity,
		'Characters and Skins/Gravity (skin - Noli).png': Gravity,
		'Characters and Skins/Gravity (skin - Mini Mushroom).webp': Gravity,
		'Characters and Skins/Pumpkin.png': Pumpkin,
		'Characters and Skins/Pumpkin (skin - glitch).gif': Pumpkin,
		'Characters and Skins/Pumpkin (skin - grayscale).png': Pumpkin,
		'Characters and Skins/Shelly.png': Shelly,
		'Characters and Skins/Shelly (skin - Gnurpi).png': Shelly,
		'Characters and Skins/Shelly (skin - Raffa).png': Shelly,
	}

	function getCharacterClass(src) {
		return characterClasses[src] || Gravity // по умолчанию базовый класс
	}

	let player, enemy

	function createCharacter(src, isEnemy) {
		const CharacterClass = getCharacterClass(src)
		return new CharacterClass('Character', isEnemy)
	}

	let achHappyBirthday = localStorage.getItem('happyBirthday1235') === 'true'
	let achTimeParadox = localStorage.getItem('timeParadox1235') === 'true'
	let achGravityHasGoneTooFar =
		localStorage.getItem('gravityHasGoneTooFar1235') === 'true'
	let achFirstWin = localStorage.getItem('firstWin1235') === 'true'
	let achPvP = localStorage.getItem('PvP1235') === 'true'
	let achGlitchMeeting = localStorage.getItem('glitchMeeting1235') === 'true'
	let achHowDareYou = localStorage.getItem('howDareYou1235') === 'true'
	let achPacifist = localStorage.getItem('pacifist1235') === 'true'
	let achLastBreath = localStorage.getItem('lastBreath1235') === 'true'
	let achSuicide = localStorage.getItem('suicide1235') === 'true'
	let achNoMoreDeals = localStorage.getItem('noMoreDeals1235') === 'true'
	let achWhat = localStorage.getItem('what1235') === 'true'

	function addAchievement(src) {
		lookAchievement = document.getElementById('lookAchievement')
		lookAchievement.src = src
		$(lookAchievement).fadeIn(1000)
		setTimeout(() => {
			$(lookAchievement).fadeOut(1000)
		}, 2000)
	}

	function addAchievement2(src) {
		lookAchievement2 = document.getElementById('lookAchievement2')
		lookAchievement2.src = src
		$(lookAchievement2).fadeIn(1000)
		setTimeout(() => {
			$(lookAchievement2).fadeOut(1000)
		}, 2000)
	}

	function addAchievement3(src) {
		lookAchievement3 = document.getElementById('lookAchievement3')
		lookAchievement3.src = src
		$(lookAchievement3).fadeIn(1000)
		setTimeout(() => {
			$(lookAchievement3).fadeOut(1000)
		}, 2000)
	}

	function addAchievement4(src) {
		lookAchievement4 = document.getElementById('lookAchievement4')
		lookAchievement4.src = src
		$(lookAchievement4).fadeIn(1000)
		setTimeout(() => {
			$(lookAchievement4).fadeOut(1000)
		}, 2000)
	}

	function setSrcAch() {
		if (achHappyBirthday) {
			let happyBirthdaySrc = document.getElementById('happyBirthday')
			happyBirthdaySrc.src =
				'Achievements/Achievement (happy birthday).png'
		}
		if (achTimeParadox) {
			let timeParadoxSrc = document.getElementById('timeParadox')
			timeParadoxSrc.src = 'Achievements/Achievement (time paradox).png'
		}
		if (achGravityHasGoneTooFar) {
			let gravityHasGoneTooFarSrc = document.getElementById(
				'gravityHasGoneTooFar'
			)
			gravityHasGoneTooFarSrc.src =
				'Achievements/Achievement (gravity has gone too far).png'
		}
		if (achFirstWin) {
			let firstWinSrc = document.getElementById('firstWin')
			firstWinSrc.src = 'Achievements/Achievement (first win).png'
		}
		if (achPvP) {
			let PvPSrc = document.getElementById('plants')
			PvPSrc.src = 'Achievements/Achievement (pvp).png'
		}
		if (achGlitchMeeting) {
			let glitchMeetingSrc = document.getElementById('glitchMeeting')
			glitchMeetingSrc.src = 'Achievements/Achievement (glitch meeting).webp'
		}
		if (achHowDareYou) {
			let howDareYouSrc = document.getElementById('howDareYou')
			howDareYouSrc.src = 'Achievements/Achievement (How dare you).png'
		}
		if (achPacifist) {
			let pacifistSrc = document.getElementById('pacifist')
			pacifistSrc.src = 'Achievements/Achievement (pacifist).png'
		}
		if (achLastBreath) {
			let lastBreathSrc = document.getElementById('lastBreath')
			lastBreathSrc.src = 'Achievements/Achievement (last breath).png'
		}
		if (achSuicide) {
			let suicideSrc = document.getElementById('suicide')
			suicideSrc.src = 'Achievements/Achievement (suicide).png'
		}
		if (achNoMoreDeals) {
			let noMoreDealsSrc = document.getElementById('noMoreDeals')
			noMoreDealsSrc.src = 'Achievements/Achievement (no more deals).png'
		}
		if (achWhat) {
			let whatSrc = document.getElementById('what')
			whatSrc.src = 'Achievements/Achievement (what).png'
		}
	}

	if (!achHappyBirthday) {
		achHappyBirthday = true
		localStorage.setItem('happyBirthday1235', true)
		addAchievement('Achievements/Achievement (happy birthday).png')
	}

	$('#happyBirthday').hover(() => {
		if (achHappyBirthday) {
			$('#achievementsInfo').html(
				`<b class="achHeading">С днем рождения:</b>
                <p class="achDescription">С днем рождения, ... , с днем рождения тебяяя!</p>
                <p class="achInfo">Впервые зайди в игру</p>`
			)
		} else {
			$('#achievementsInfo').html(
				`<b class="achHeading">???</b>
                <p class="achDescription">???</p>
                <p class="achInfo">???</p>`
			)
		}
	})

	$('#timeParadox').hover(() => {
		if (achTimeParadox) {
			$('#achievementsInfo').html(
				`<b class="achHeading">Временной парадокс:</b>
                <p class="achDescription">Что.. неужели.. это же я!!</p>
                <p class="achInfo">Сразись против самого себя</p>`
			)
		} else {
			$('#achievementsInfo').html(
				`<b class="achHeading">???</b>
                <p class="achDescription">???</p>
                <p class="achInfo">???</p>`
			)
		}
	})

	$('#gravityHasGoneTooFar').hover(() => {
		if (achGravityHasGoneTooFar) {
			$('#achievementsInfo').html(
				`<b class="achHeading">Гравити зашел слишком далеко:</b>
                <p class="achDescription">*вот и встретились два брата*<br><br> КАК ЖЕ ТЫ МЕНЯ ДОСТАЛ!! ТИМОФЕЙ, #####, УБЕРИ УЖЕ СВОЙ НОСОК!!</p>
                <p class="achInfo">Поставь битву между двумя братьями: gravity и pumpkin</p>`
			)
		} else {
			$('#achievementsInfo').html(
				`<b class="achHeading">???</b>
                <p class="achDescription">???</p>
                <p class="achInfo">???</p>`
			)
		}
	})

	$('#firstWin').hover(() => {
		if (achFirstWin) {
			$('#achievementsInfo').html(
				`<b class="achHeading">Первая победа:</b>
                <p class="achDescription">Тудааа егоооо</p>
                <p class="achInfo">Победи своего первого соперника</p>`
			)
		} else {
			$('#achievementsInfo').html(
				`<b class="achHeading">???</b>
                <p class="achDescription">???</p>
                <p class="achInfo">???</p>`
			)
		}
	})

	$('#plants').hover(() => {
		if (achPvP) {
			$('#achievementsInfo').html(
				`<b class="achHeading">Растения против растений:</b>
                <p class="achDescription">Вот оно, истинное pvp<br>Plants<br>Vs<br>Plants</p>
                <p class="achInfo">Поставь в битве тыкву против мини гриба или наоборот.</p>`
			)
		} else {
			$('#achievementsInfo').html(
				`<b class="achHeading">???</b>
                <p class="achDescription">???</p>
                <p class="achInfo">???</p>`
			)
		}
	})

	$('#glitchMeeting').hover(() => {
		if (achGlitchMeeting) {
			$('#achievementsInfo').html(
				`<b class="achHeading">Встреча двух сбоев:</b>
                <p class="achDescription">Боже мой, они крушат все на своем пути.. какая эпичная битва.</p>
                <p class="achInfo">Поставь в битве агрессивную Чару и glitch pumpkin.</p>`
			)
		} else {
			$('#achievementsInfo').html(
				`<b class="achHeading">???</b>
                <p class="achDescription">???</p>
                <p class="achInfo">???</p>`
			)
		}
	})

	$('#howDareYou').hover(() => {
		if (achHowDareYou) {
			$('#achievementsInfo').html(
				`<b class="achHeading">ДА КАК ТЫ ПОСМЕЛ:</b>
                <p class="achDescription">ДА ТЫ ЧТО?! СОВСЕМ СТРАХ ПОТЕРЯЛ?!?!</p>
                <p class="achInfo">Победи разработчика игры /: (пхахаха, это буквально разработчик написал)</p>`
			)
		} else {
			$('#achievementsInfo').html(
				`<b class="achHeading">???</b>
                <p class="achDescription">???</p>
                <p class="achInfo">???</p>`
			)
		}
	})

	$('#pacifist').hover(() => {
		if (achPacifist) {
			$('#achievementsInfo').html(
				`<b class="achHeading">Пацифист:</b>
                <p class="achDescription">Не все можно решить разговором.. но ведь попытаться стоит. Верно?</p>
                <p class="achInfo">Проиграйте сопернику, не нанеся ему урона</p>`
			)
		} else {
			$('#achievementsInfo').html(
				`<b class="achHeading">???</b>
                <p class="achDescription">???</p>
                <p class="achInfo">???</p>`
			)
		}
	})

	$('#lastBreath').hover(() => {
		if (achLastBreath) {
			$('#achievementsInfo').html(
				`<b class="achHeading">Последнее дыхание:</b>
                <p class="achDescription">Ухх, это было близко</p>
                <p class="achInfo">Победите врага с 10 оз или меньше</p>`
			)
		} else {
			$('#achievementsInfo').html(
				`<b class="achHeading">???</b>
                <p class="achDescription">???</p>
                <p class="achInfo">???</p>`
			)
		}
	})

	$('#suicide').hover(() => {
		if (achSuicide) {
			$('#achievementsInfo').html(
				`<b class="achHeading">Самоубийство:</b>
                <p class="achDescription">Стоп, я же буквально только что убил себя... это самоубийство?</p>
                <p class="achInfo">Победите сражение со своей копией</p>`
			)
		} else {
			$('#achievementsInfo').html(
				`<b class="achHeading">???</b>
                <p class="achDescription">???</p>
                <p class="achInfo">???</p>`
			)
		}
	})

	$('#noMoreDeals').hover(() => {
		if (achNoMoreDeals) {
			$('#achievementsInfo').html(
				`<b class="achHeading">Никаких больше сделок:</b>
                <p class="achDescription">Что ж.. Я думала мы союзники, но ты думаешь иначе =)</p>
                <p class="achInfo">Поставь битву между агрессивной чары и Фриском</p>`
			)
		} else {
			$('#achievementsInfo').html(
				`<b class="achHeading">???</b>
                <p class="achDescription">???</p>
                <p class="achInfo">???</p>`
			)
		}
	})

	$('#what').hover(() => {
		if (achWhat) {
			$('#achievementsInfo').html(
				`<b class="achHeading">Эээээ.. Что это?:</b>
                <p class="achDescription">Что за бред, откуда взялся этот пес?</p>
                <p class="achInfo">Поставь битву между Гнарпи и собакой (Гравити)</p>`
			)
		} else {
			$('#achievementsInfo').html(
				`<b class="achHeading">???</b>
                <p class="achDescription">???</p>
                <p class="achInfo">???</p>`
			)
		}
	})

	let charaAtk1Miss = new Audio('SFX/Chara atk1 miss.wav')
	let charaAtk1 = new Audio('SFX/Chara atk1.wav')
	let charaAtk2 = new Audio('SFX/Chara atk2.mp3')
	let charaAtk3 = new Audio('SFX/Chara atk3.wav')
	let charaAbility = new Audio('SFX/Chara Ability.wav')

	let pumpkinAbility = new Audio('SFX/Pumpkin ability.mp3')
	let pumpkinAtk1 = new Audio('SFX/Pumpkin atk1.wav')
	let pumpkinAtk2 = new Audio('SFX/Pumpkin atk2.wav')
	let pumpkinAtk3 = new Audio('SFX/Pumpkin atk3.mp3')

	let shellyAbility = new Audio('SFX/Shelly ability.wav')
	let shellyAtk2 = new Audio('SFX/Shelly atk2.wav')
	let shellyAtk3 = new Audio('SFX/Shelly atk3.mp3')

	let gravityAbility = new Audio('SFX/Gravity ability.wav')
	let gravityAtk1 = new Audio('SFX/Gravity atk1.wav')
	let gravityAtk2 = new Audio('SFX/Gravity atk2.wav')
	let gravityAtk3 = new Audio('SFX/Gravity atk3.wav')

	let timeParadox = new Audio('Music/Time paradox.mp3')
	let gravityHasGoneTooFar = new Audio('Music/GravityHasGoneTooFar.mp3')
	let noMoreDeals = new Audio('Music/No more deals.mp3')
	let glitchFight = new Audio('Music/Glitch meeting.mp3')
	let wateryGraves = new Audio('Music/Watery Graves.mp3')
	let dogSong = new Audio('Music/Dogsong.mp3')

	timeParadox.loop = true
	gravityHasGoneTooFar.loop = true
	noMoreDeals.loop = true
	glitchFight.loop = true
	wateryGraves.loop = true
	dogSong.loop = true

	const skinsContainer = $('#charactersSkins')

	let yourImg = document.getElementById('yourCharacterImg')
	let enemyImg = document.getElementById('enemyCharacterImg')

	whatSelect = 'character'

	let gameMode = null
	characterMenu = 'info'

	cardSrc = null
	cSrc = null

	eCardSrc = null
	eSrc = null

	characterCardSrc = null
	characterSrc = null

	let currentSkin = null
	let originalSkin = null

	const htmlGravity = `
        <p>Самый эффектный и позитивный персонаж. Но никогда не знаешь что от него ожидать... </p><br>
        <b>Статистика:</b><br><p>Броня: 20<br>Оз: от 40 до 100<br>Мана: 4</p><br><b>Атака 1 - в тему:</b><br>
        <p>Очень точно попадает в тему разговора (нет) и наносит персонажу 20 урона. После этого исцеляет 3 оз. Требует маны: 3</p>
        <br><b>Атака 2 - угадай че выкину:</b><br><p>Наносит случайный урон (от 15 до 35). Требует маны: 3</p>
        <br><b>Атака 3 - нарушение гравитации:</b><br><p>Ломает противнику от 5 до 10 брони, наносит от 10 до 20 урона и лечит от 10 до 20хп. Требует маны: 4</p>
        <br><b>Способность - земной подарок:</b><br><p>дает либо +1 ману, либо +5 хп, либо +2 брони</p>
    `

	const htmlShelly = `
        <p>Персонаж - все в одном. Не может определиться со своим обликом, способностями и параметрами. Она может быть и доброй поддержкой, и кровожадной убийцей, и даже... даже инопланетянином!</p><br>
        <b>Статистика:</b><br><p>Броня: 10<br>Оз: 60<br>Мана: 8</p><br><b>Атака 1 - Веселая поддержка!</b><br>
        <p>Исцеляет себя на 8 оз и наносит сопернику 6 урона. Требует маны: 2</p>
        <br><b>Атака 2 - zip zip zip:</b><br><p>Раскрывает возможности вселенского масштаба и ломает противнику 10 брони и наносит 10 урона. Требует маны: 5</p>
        <br><b>Атака 3 - смайл фэйс:</b><br><p>Ослепляет своим позитивом соперника, наносит ему 35 урона и сносит 12 брони, а после этого исцеляет себе 5 оз. Требует маны: 6</p>
        <br><b>Способность - свежий раф:</b><br><p>Восстанавливает 1 ману, 1 оз и 1 броню</p>
    `

	const htmlChara = `
        <p>На первый взгляд злой и кровожадный персонаж, но в душе добрый ребенок.</p><br>
        <b>Статистика:</b><br><p>Броня: 30<br>Оз: 100<br>Мана: 3</p>
        <br><b>Атака 1 - удар ножом:</b><br><p>Может попасть с шансом 10%, нанеся 30 урона. Требует маны: 0</p>
        <br><b>Атака 2 - внезапный удар:</b><br><p>Наносит 20хп. Требует маны: 3</p>
        <br><b>Атака 3 - пробуждение силы:</b><br><p>Следующий удар ножом сносит 10 брони и наносит 50 урона с шансом 60%.Требует маны: 4</p>
        <br><b>Способность - шоколад:</b><br><p>Восстанавливают 1 ману и если мана заполнена до максимума, то повышает максимум. Исцеляет 3 оз</p>
    `

	const htmlPumpkin = `
        <p>Довольно занятой с плотными графиками человек, о не смотря на это продолжает радовать и радоваться (пхахах, это буквально я писал).</p><br>
        <b>Статистика:</b><br><p>Броня: 30<br>Оз: 80<br>Мана: 10</p>
        <br><b>Атака 1 - сверкающий глаз:</b><br><p>Чинит 7 брони и исцеляет 7 оз. Требует маны: 2</p>
        <br><b>Атака 2 - сияние морской волны:</b><br><p>Смывает 10 брони у врага, а после наносит 10 урона. Требует маны: 4</p>
        <br><b>Атака 3 - восстановление:</b><br><p>Восполняет ману до 10, но увеличивает трату макс. энергии со способности на 1.Требует оз: 10</p>
        <br><b>Способность - Раскат молнии:</b><br><p>Если макс. энергии больше, чем 3, то уменьшает макс. на 1 энергию и сносит 5 брони сопернику, а после этого наносит 15 урона. Так же восполняет 1 оз</p>
    `

	const shellySkins = `
        <img src="Cards/Shelly card.png" class="skin" data-model="Characters and Skins/Shelly.png">
        <img src="Cards/Shelly card (skin - Gnurpi).png" class="skin" data-model="Characters and Skins/Shelly (skin - Gnurpi).png">
        <img src="Cards/Shelly card (skin - Raffa).png" class="skin" data-model="Characters and Skins/Shelly (skin - Raffa).png">
    `

	const GravitySkins = `
        <img src="Cards/Gravity card.png" class="skin" data-model="Characters and Skins/Gravity.png">
        <img src="Cards/Gravity card (skin - Noli).png" class="skin" data-model="Characters and Skins/Gravity (skin - Noli).png">
        <img src="Cards/Gravity card (skin - Mini Mushroom).gif" class="skin" data-model="Characters and Skins/Gravity (skin - Mini Mushroom).webp">
    `

	const charaSkins = `
        <img src="Cards/Chara card.png" class="skin" data-model="Characters and Skins/Chara.png">
        <img src="Cards/Chara card (skin - aggressive).gif" class="skin" data-model="Characters and Skins/Chara (skin - aggressive).gif">
        <img src="Cards/Chara card (skin - Frisk).png" class="skin" data-model="Characters and Skins/Chara (skin - Frisk).png">
    `

	const pumpkinSkins = `
        <img src="Cards/Pumpkin card.png" class="skin" data-model="Characters and Skins/Pumpkin.png">
        <img src="Cards/Pumpkin card (skin - glitch).gif" class="skin" data-model="Characters and Skins/Pumpkin (skin - glitch).gif">
        <img src="Cards/Pumpkin card (skin - grayscale).png" class="skin" data-model="Characters and Skins/Pumpkin (skin - grayscale).png">
    `

	function hoverImg(img, newSrc, html, skins, col, model) {
		img.addEventListener('click', () => {
			$('#charactersInfo').html(html)
			$('#charactersInfo').css('background', col)

			$('#charactersSkins').html(skins)
			$('#charactersSkins').css('background', col)
			if (whatSelect == 'character') {
				$('.character').css('filter', 'brightness(0.5)')
				shelly = document.getElementById('shelly')
				gravity = document.getElementById('gravity')
				pumpkin = document.getElementById('pumpkin')
				chara = document.getElementById('chara')

				shelly.src = 'Cards/Shelly card.png'
				gravity.src = 'Cards/Gravity Card.png'
				pumpkin.src = 'Cards/Pumpkin card.png'
				chara.src = 'Cards/Chara card.png'

				$(img).css('filter', 'brightness(1.0)')

				originalSrc = img.src
				cardSrc = originalSrc
				img.src = newSrc
				cSrc = model
			} else if (whatSelect == 'enemy') {
				originalSrc = img.src
				eCardSrc = originalSrc
				img.src = newSrc
				eSrc = model
			}
		})

		skinsContainer.html(skins)

		skinsContainer.on('click', '.skin', function () {
			const skinModel = $(this).data('model')
			const skinCard = this.src

			if (skinModel) {
				if (whatSelect === 'character') {
					characterCardSrc = skinCard
					characterSrc = skinModel
					console.log(characterSrc)

					$('#heading').text('Выбери своего врага')
					yourImg.src = skinModel

					setTimeout(() => {
						whatSelect = 'enemy'
					}, 1)
				} else if (whatSelect === 'enemy') {
					eSrc = skinModel
					eCardSrc = skinCard

					enemyImg.src = skinModel

					if (cSrc && eSrc) {
						// Создаем player и enemy с соответствующими классами
						player = createCharacter(cSrc, false)
						enemy = createCharacter(eSrc, true)

						// Связываем персонажей
						player.setEnemy(enemy)
						enemy.setEnemy(player)

						player.setHover()

						// Запускаем игру
						startGame()
					}

					if (yourImg.src == enemyImg.src) {
						isItTimeParadox = true
						console.log('time')
						timeParadox.volume = 0.5
						timeParadox.play()
						if (!achTimeParadox) {
							achHappyBirthday = true
							localStorage.setItem('timeParadox1235', true)
							addAchievement('Achievements/Achievement (time paradox).png')
						}
					} else if (
						characterSrc == 'Characters and Skins/Gravity.png' &&
						eSrc == 'Characters and Skins/Pumpkin.png'
					) {
						gravityHasGoneTooFar.volume = 0.5
						gravityHasGoneTooFar.play()
						$(yourImg).css('filter', 'hue-rotate(80deg)')
						if (!achGravityHasGoneTooFar) {
							gravityHasGoneTooFar = true
							localStorage.setItem('gravityHasGoneTooFar1235', true)
							addAchievement('Achievements/Achievement (gravity has gone too far).png')
						}
					} else if (
						characterSrc == 'Characters and Skins/Pumpkin.png' &&
						eSrc == 'Characters and Skins/Gravity.png'
					) {
						gravityHasGoneTooFar.volume = 0.5
						gravityHasGoneTooFar.play()
						$(enemyImg).css('filter', 'hue-rotate(80deg)')
						if (!achGravityHasGoneTooFar) {
							gravityHasGoneTooFar = true
							localStorage.setItem('gravityHasGoneTooFar1235', true)
							addAchievement('Achievements/Achievement (gravity has gone too far).png')
						}
					} else if (characterSrc == 'Characters and Skins/Chara (skin - aggressive).gif' && eSrc == 'Characters and Skins/Chara (skin - Frisk).png'
					) {
						noMoreDeals.volume = 0.5
						noMoreDeals.play()
						if (!achNoMoreDeals) {
							achNoMoreDeals = true
							localStorage.setItem('noMoreDeals1235', true)
							addAchievement('Achievements/Achievement (no more deals).png')
						}
					} else if (
						characterSrc == 'Characters and Skins/Chara (skin - Frisk).png' &&
						eSrc == 'Characters and Skins/Chara (skin - aggressive).gif'
					) {
						noMoreDeals.volume = 0.5
						noMoreDeals.play()
						if (!achNoMoreDeals) {
							achNoMoreDeals = true
							localStorage.setItem('noMoreDeals1235', true)
							addAchievement('Achievements/Achievement (no more deals).png')
						}
					} else if (
						characterSrc == 'Characters and Skins/Chara (skin - aggressive).gif' &&
						eSrc == 'Characters and Skins/Pumpkin (skin - glitch).gif'
					) {
						glitchFight.volume = 0.5
						glitchFight.play()
						if (!achGlitchMeeting) {
							achGlitchMeeting = true
							localStorage.setItem('glitchMeeting1235', true)
							addAchievement('Achievements/Achievement (glitch meeting).webp')
						}
					} else if (
						characterSrc == 'Characters and Skins/Pumpkin (skin - glitch).gif' &&
						eSrc == 'Characters and Skins/Chara (skin - aggressive).gif'
					) {
						glitchFight.volume = 0.5
						glitchFight.play()
						if (!achGlitchMeeting) {
							achGlitchMeeting = true
							localStorage.setItem('glitchMeeting1235', true)
							addAchievement('Achievements/Achievement (glitch meeting).webp')
						}
					} else if (
						characterSrc == 'Characters and Skins/Pumpkin.png' &&
						eSrc == 'Characters and Skins/Gravity (skin - Mini Mushroom).webp'
					) {
						wateryGraves.volume = 0.5
						wateryGraves.play()
						yourImg.src = 'Characters and Skins/Pumpkin (pvz).png'
						if (!achPvP) {
							achPvP = true
							localStorage.setItem('PvP1235', true)
							addAchievement('Achievements/Achievement (pvp).png')
						}
					} else if (
						characterSrc == 'Characters and Skins/Gravity (skin - Mini Mushroom).webp' &&
						eSrc == 'Characters and Skins/Pumpkin.png'
					) {
						wateryGraves.volume = 0.5
						wateryGraves.play()
						enemyImg.src = 'Characters and Skins/Pumpkin (pvz).png'
						if (!achPvP) {
							achPvP = true
							localStorage.setItem('PvP1235', true)
							addAchievement('Achievements/Achievement (pvp).png')
						}
					} else if (
							characterSrc == 'Characters and Skins/Gravity.png' &&
							eSrc == 'Characters and Skins/Shelly (skin - Gnurpi).png'
					) {
						console.log(characterSrc)
						dogSong.volume = 0.5
						dogSong.play()
						yourImg.src = 'Characters and Skins/Gravity (dog).png'
						if (!achWhat) {
							achWhat = true
							localStorage.setItem('what1235', true)
							addAchievement('Achievements/Achievement (what).png')
						}
					} else if (
							characterSrc == 'Characters and Skins/Shelly (skin - Gnurpi).png' &&
							eSrc == 'Characters and Skins/Gravity.png'
					) {
						dogSong.volume = 0.5
						dogSong.play()
						enemyImg.src = 'Characters and Skins/Gravity (dog).png'
						if (!achWhat) {
							achWhat = true
							localStorage.setItem('what1235', true)
							addAchievement('Achievements/Achievement (what).png')
						}
					}
					$('#selectCharacterMenu').css('display', 'none')
					$('#scene').css('display', 'block')
				}
			}
		})
	}

	hoverImg(
		characters[0],
		'Cards/GIFs/Chara card gif.gif',
		htmlChara,
		charaSkins,
		'#443333',
		'Characters and Skins/Chara.png'
	)
	hoverImg(
		characters[1],
		'Cards/GIFs/Gravity card gif.gif',
		htmlGravity,
		GravitySkins,
		'#443344',
		'Characters and Skins/Gravity.png'
	)
	hoverImg(
		characters[2],
		'Cards/GIFs/Pumpkin card gif.gif',
		htmlPumpkin,
		pumpkinSkins,
		'#243531',
		'Characters and Skins/Pumpkin.png'
	)
	hoverImg(
		characters[3],
		'Cards/GIFs/Shelly card gif.gif',
		htmlShelly,
		shellySkins,
		'#352e24ff',
		'Characters and Skins/Shelly.png'
	)

	$('#play').click(() => {
		$('#startMenu').css('display', 'none')
		$('#gameModeMenu').css('display', 'grid')
	})

	$('#PvE').click(() => {
		gameMode = 'pve'
		$('#gameModeInfo').text(
			'Самый классический режим. Сразись с ботом и отвлекись от всего (это приказ)'
		)
		$('#start').css('display', 'block')
	})

	$('#PvP').click(() => {
		gameMode = 'pvp'
		$('#gameModeInfo').text('Скоро...')
		$('#start').css('display', 'none')
	})

	$('#start').click(() => {
		$('#gameModeMenu').css('display', 'none')
		$('#selectCharacterMenu').css('display', 'grid')
	})

	$('#skinsButton').click(() => {
		$('#skinsButton').css('filter', 'brightness(1.0) blur(0)')
		$('#charactersInfoButton').css('filter', 'brightness(0.7) blur(1px)')
		$('#charactersInfo').css('display', 'none')
		$('#charactersSkins').css('display', 'grid')
	})

	$('#charactersInfoButton').click(() => {
		if (originalSkin) {
			yourImg.src = originalSkin
			currentSkin = null

			$('.skin').css('filter', 'brightness(0.8)')
		}

		$('#skinsButton').css('filter', 'brightness(0.7) blur(1px)')
		$('#charactersInfoButton').css('filter', 'brightness(1) blur(0)')
		$('#charactersInfo').css('display', 'block')
		$('#charactersSkins').css('display', 'none')
	})

	$('#achievements').click(() => {
		$('#startMenu').css('display', 'none')
		$('#achievementsMenu').css('display', 'grid')
		setSrcAch()
	})

	$('#exit').click(() => {
		$('#startMenu').css('display', 'grid')
		$('#achievementsMenu').css('display', 'none')
	})

	skinsContainer.find('.skin').click(event => {
		const skinImg = event.target
		const skinModel = skinImg.dataset.model

		if (skinModel) {
			yourImg.src = skinModel
			currentSkin = skinModel
		}
	})

	// Начало игры

	// Пример создания персонажей

	async function yourTurn() {
		return new Promise(resolve => {
			$('#turn').text('Твой ход')

			// Восстановление маны
			if (player.mana != player.maxMana) {
				player.restoreMana(1)
			}

			player.updateUI()
			player.pasteAttacksSrc()

			// Обработчики кликов

			if (!mobile) {
				$(attack1Img).on('click', () => {
					if (player.mana >= player.attack1Mana) {
						if (!attack1Used) {
							player.specialAttack1()
							attack1Used = true
							enemyTurn()
						}
					}
				})

				$(attack2Img).on('click', () => {
					if (player.mana >= player.attack2Mana) {
						if (!attack2Used) {
							player.specialAttack2()
							attack2Used = true
							enemyTurn()
						}
					}
				})

				$(attack3Img).on('click', () => {
					if (player.mana >= player.attack3Mana) {
						if (!attack3Used) {
							player.specialAttack3()
							attack3Used = true
							enemyTurn()
						}
					}
				})

				$(ability).on('click', () => {
					if (!abilityUsed) {
						player.specialAbility()
						abilityUsed = true
						enemyTurn()
					}
				})
			} else {
				$(attack1Img).on('click', () => {
					$('#attackInfo').html(player.atk1Html)
					selectAttack = 1
				})

				$(attack2Img).on('click', () => {
					$('#attackInfo').html(player.atk2Html)
					selectAttack = 2
				})

				$(attack3Img).on('click', () => {
					$('#attackInfo').html(player.atk3Html)
					selectAttack = 3
				})

				$(ability).on('click', () => {
					$('#attackInfo').html(player.abilityHtml)
					selectAttack = 'ability'
				})

				$('#useButton').on('click', () => {
					if (selectAttack) {
						switch (selectAttack) {
							case 1:
								if (player.mana >= player.attack1Mana) {
									if (!attack1Used) {
										player.specialAttack1()
										attack1Used = true
										enemyTurn()
									}
								}
								break
							case 2:
								if (player.mana >= player.attack2Mana) {
									if (!attack2Used) {
										player.specialAttack2()
										attack2Used = true
										enemyTurn()
									}
								}
								break
							case 3:
								if (player.mana >= player.attack3Mana) {
									if (!attack3Used) {
										player.specialAttack3()
										attack3Used = true
										enemyTurn()
									}
								}
								break
							case 'ability':
								if (!abilityUsed) {
									player.specialAbility()
									abilityUsed = true
									enemyTurn()
								}
								break
						}
					}
				})
			}
		})
	}

	async function enemyTurn() {
		$('#turn').text('Ход соперника')
		$(attack1Img).off('click')
		$(attack2Img).off('click')
		$(attack3Img).off('click')
		$(ability).off('click')
		$('#useButton').off('click')
		selectAttack = false
		return new Promise(async resolve => {
			setTimeout(() => {
				if (enemy.hp != enemy.maxHp) {
					isPacifist = false
				}
				// Восстановление маны
				if (enemy.mana != enemy.maxMana) {
					enemy.restoreMana(1)
				}

				if (enemy.hp > 0) {
					enemy.BotAttack()
					enemy.updateUI()

					if (player.hp < 1) {
						alert('Ты проиграл!')
						if (!achPacifist && isPacifist) {
							addAchievement('Achievements/Achievement (pacifist).png')
							achPacifist = true
							localStorage.setItem('pacifist1235', true)
						}

						$('#scene').fadeOut(3500)
						setTimeout(() => {
							location.reload()
						}, 3500)
					}

					abilityUsed = false
					attack1Used = false
					attack2Used = false
					attack3Used = false
					resolve()
					yourTurn()
				} else {
					alert('Ты выиграл!')
					if (!achFirstWin) {
						addAchievement('Achievements/Achievement (first win).png')
						achFirstWin = true
						localStorage.setItem('firstWin1235', true)
						if (
							eSrc == 'Characters and Skins/Pumpkin.png' &&
							!achHowDareYou
						) {
							addAchievement2(
								'Achievements/Achievement (How dare you).png'
							)
							achHowDareYou = true
							localStorage.setItem('howDareYou1235', true)
							if (player.hp <= 10 && !achLastBreath) {
								addAchievement3(
									'Achievements/Achievement (last breath).png'
								)
								achLastBreath = true
								localStorage.setItem('lastBreath1235', true)
								if (isItTimeParadox && !achSuicide) {
									addAchievement4('Achievements/Achievement (suicide).png')
									achSuicide = true
									localStorage.setItem('suicide1235', true)
								}
							} else if (isItTimeParadox && !achSuicide) {
								addAchievement3('Achievements/Achievement (suicide).png')
								achSuicide = true
								localStorage.setItem('suicide1235', true)
							}
						} else if (player.hp <= 10 && !achLastBreath) {
							addAchievement2('Achievements/Achievement (last breath).png')
							achLastBreath = true
							localStorage.setItem('lastBreath1235', true)
							if (isItTimeParadox && !achSuicide) {
								addAchievement3('Achievements/Achievement (suicide).png')
								achSuicide = true
								localStorage.setItem('suicide1235', true)
							}
						} else if (isItTimeParadox && !achSuicide) {
							addAchievement2('Achievements/Achievement (suicide).png')
							achSuicide = true
							localStorage.setItem('suicide1235', true)
						}
					} else if (
						eSrc == 'Characters and Skins/Pumpkin.png' &&
						!achHowDareYou
					) {
						addAchievement('Achievements/Achievement (How dare you).png')
						achHowDareYou = true
						localStorage.setItem('howDareYou1235', true)
						if (player.hp <= 10 && !achLastBreath) {
							addAchievement2('Achievements/Achievement (last breath).png')
							achLastBreath = true
							localStorage.setItem('lastBreath1235', true)
							if (isItTimeParadox && !achSuicide) {
								addAchievement3('Achievements/Achievement (suicide).png')
								achSuicide = true
								localStorage.setItem('suicide1235', true)
							}
						} else if (isItTimeParadox && !achSuicide) {
							addAchievement2('Achievements/Achievement (suicide).png')
							achSuicide = true
							localStorage.setItem('suicide1235', true)
						}
					} else if (player.hp <= 10 && !achLastBreath) {
						addAchievement('Achievements/Achievement (last breath).png')
						achLastBreath = true
						localStorage.setItem('lastBreath1235', true)
						if (isItTimeParadox && !achSuicide) {
							addAchievement2('Achievements/Achievement (suicide).png')
							achSuicide = true
							localStorage.setItem('suicide1235', true)
						}
					} else if (isItTimeParadox && !achSuicide) {
						addAchievement('Achievements/Achievement (suicide).png')
						achSuicide = true
						localStorage.setItem('suicide1235', true)
					}

					$('#scene').fadeOut(3500)
					setTimeout(() => {
						location.reload()
					}, 3500)
				}
			}, 500)
		})
	}

	// Запуск игры с использованием async/await
	async function startGame() {
		while (player.hp > 0 && enemy.hp > 0) {
			await yourTurn()
			await enemyTurn()
		}
	}
})

