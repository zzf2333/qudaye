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
				'950': '#003029'
			},
			block: '#F6F6F9',
			'block-active': '#5F5D70',
			title: "#9B99A9"
		},
	},
	shortcuts: [
		{
			'border-base': 'border border-gray-500_10',
			'center': 'flex justify-center items-center',
		},
	],

	transformers: [
		// https://github.com/MellowCo/unocss-preset-weapp/tree/main/src/transformer/transformerAttributify
		transformerAttributify(),

		// https://github.com/MellowCo/unocss-preset-weapp/tree/main/src/transformer/transformerClass
		transformerClass(),
	]
}