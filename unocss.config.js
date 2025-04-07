import presetWeapp from 'unocss-preset-weapp'
import presetIcons from '@unocss/preset-icons'
import { extractorAttributify, transformerClass } from 'unocss-preset-weapp/transformer'

const { presetWeappAttributify, transformerAttributify } = extractorAttributify()

export default {
	presets: [
		// https://github.com/MellowCo/unocss-preset-weapp
		presetWeapp(),
		// attributify autocomplete
		presetWeappAttributify(),
		presetIcons({ /* options */ }),
	],
	theme: {
		colors: {
			'primary': {
				'50': '#eafff7',
				'100': '#cdfeea',
				'200': '#a0fadb',
				'300': '#63f2c9',
				'400': '#25e2b2',
				'500': '#00ca9d',
				'600': '#00a480',
				'700': '#00836a',
				'800': '#006755',
				'900': '#005547',
				'950': '#003029',
			},
			'comet':{
				'50': '#f7f7f8',
				'100': '#efeef0',
				'200': '#d9d8df',
				'300': '#b7b6c3',
				'400': '#918fa1',
				'500': '#737186',
				'600': '#5f5d70',
				'700': '#4d4b59',
				'800': '#41404c',
				'900': '#3a3842',
				'950': '#26252c',
			}
		},
	},
	shortcuts: [
		{
			'input': 'rounded-sm bg-comet-50 p-2 shadow-sm c-comet-600 text-sm',
		},
	],

	transformers: [
		// https://github.com/MellowCo/unocss-preset-weapp/tree/main/src/transformer/transformerAttributify
		transformerAttributify(),

		// https://github.com/MellowCo/unocss-preset-weapp/tree/main/src/transformer/transformerClass
		transformerClass(),
	]
}