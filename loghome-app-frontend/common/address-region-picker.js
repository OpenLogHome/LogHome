import sourceRegions from './address-regions/pca-code.json'

const municipalities = ['北京市', '天津市', '上海市', '重庆市']
const baseRegions = Object.freeze(
	sourceRegions.map((province) => {
		const groups = province.children || []
		const cities = municipalities.includes(province.name)
			? [{ name: province.name, children: groups.flatMap((city) => city.children || []) }]
			: groups
		return Object.freeze({
			name: province.name,
			children: Object.freeze(
				cities.map((city) =>
					Object.freeze({
						name: city.name,
						children: Object.freeze(
							(city.children && city.children.length ? city.children : [city]).map(
								(area) => area.name
							)
						),
					})
				)
			),
		})
	})
)

// Keep saved names selectable even when an address predates the bundled snapshot.
export function createRegionOptions(saved = []) {
	if (saved.length !== 3 || !saved.every(Boolean)) return baseRegions
	let provinceIndex = baseRegions.findIndex((row) => row.name === saved[0])
	const regions = baseRegions.slice()
	if (provinceIndex < 0) {
		regions.push({ name: saved[0], children: [{ name: saved[1], children: [saved[2]] }] })
		return regions
	}
	const province = baseRegions[provinceIndex]
	const cities = province.children.slice()
	// Old platform pickers use these grouping labels for municipalities.
	const cityName =
		municipalities.includes(saved[0]) && ['市辖区', '县'].includes(saved[1]) ? saved[0] : saved[1]
	const cityIndex = cities.findIndex((row) => row.name === cityName)
	if (cityIndex < 0) cities.push({ name: saved[1], children: [saved[2]] })
	else if (!cities[cityIndex].children.includes(saved[2])) {
		cities[cityIndex] = {
			...cities[cityIndex],
			children: cities[cityIndex].children.concat(saved[2]),
		}
	}
	regions[provinceIndex] = { ...province, children: cities }
	return regions
}

function boundedIndex(value, length) {
	const index = Number(value)
	return Number.isInteger(index) && index >= 0 && index < length ? index : 0
}

export function getRegionPickerState(regions, indices = []) {
	const provinceIndex = boundedIndex(indices[0], regions.length)
	const cities = regions[provinceIndex].children
	const cityIndex = boundedIndex(indices[1], cities.length)
	const districts = cities[cityIndex].children
	const districtIndex = boundedIndex(indices[2], districts.length)
	return {
		indices: [provinceIndex, cityIndex, districtIndex],
		columns: [regions.map((row) => row.name), cities.map((row) => row.name), districts],
		names: [regions[provinceIndex].name, cities[cityIndex].name, districts[districtIndex]],
	}
}

export function findRegionIndices(regions, names = []) {
	const provinceIndex = Math.max(
		0,
		regions.findIndex((row) => row.name === names[0])
	)
	const cities = regions[provinceIndex].children
	const cityName =
		municipalities.includes(names[0]) && ['市辖区', '县'].includes(names[1]) ? names[0] : names[1]
	const cityIndex = Math.max(
		0,
		cities.findIndex((row) => row.name === cityName)
	)
	const districtIndex = Math.max(0, cities[cityIndex].children.indexOf(names[2]))
	return [provinceIndex, cityIndex, districtIndex]
}
