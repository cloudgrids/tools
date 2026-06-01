import * as React from 'react';

import { Input } from '@/components/ui/input';
import { Box, Boxes, Grid3x3, Layers3, LucideIcon, Palette, RotateCcw, Wand2, Zap } from 'lucide-react';
import { GeometryBackground, GeometryLineStyle, GeometryNodeStyle, GeometryPaletteType, GeometryProps, GeometryShape } from './contracts';

type BaseInput = {
	label: string;
	Icon: LucideIcon;
};

type ButtonInput = BaseInput & {
	type: 'button';
	value: string;
	onClick: () => void;
};

type ToggleInput = BaseInput & {
	type: 'toggle';
	value: string;
	onClick: () => void;
};

type RangeInput = BaseInput & {
	type: 'range';
	value: number;
	min?: number;
	max?: number;
	step?: number;
	onClick: (value: number) => void;
};

type SelectInput<T extends string = string> = BaseInput & {
	type: 'select';
	value: T;
	options: readonly {
		label: string;
		value: T;
	}[];
	onClick: (value: T) => void;
};

type RadioInput<T extends string = string> = BaseInput & {
	type: 'radio';
	value: T;
	options: readonly {
		label: string;
		value: T;
	}[];
	onClick: (value: T) => void;
};

type GeometryInput = ButtonInput | ToggleInput | RangeInput | SelectInput | RadioInput;

interface GeometryOptionsProps {
	geometryState: GeometryProps;
	setGeometryState: React.Dispatch<React.SetStateAction<GeometryProps>>;
	generate: boolean;
	setGenerate: React.Dispatch<React.SetStateAction<boolean>>;
	renderMode: '2d' | '3d';
	setRenderMode: React.Dispatch<React.SetStateAction<'2d' | '3d'>>;
}

export const GeometryOptions: React.FC<GeometryOptionsProps> = ({
	geometryState,
	setGeometryState,
	generate,
	setGenerate,
	renderMode,
	setRenderMode
}) => {
	const inputs: GeometryInput[] = [
		{
			label: 'Generate',
			Icon: RotateCcw,
			type: 'button',
			value: generate ? 'Remake' : 'Generate',
			onClick: () => {
				if (!generate) {
					setGenerate(true);
					return;
				}

				setGeometryState((prev) => ({
					...prev,
					_remakeCount: prev._remakeCount + 1
				}));
			}
		},

		{
			label: 'Render Mode',
			Icon: Box,
			type: 'radio',
			value: renderMode,
			options: [
				{ label: '2D', value: '2d' },
				{ label: '3D', value: '3d' }
			] as const,
			onClick: (value) => setRenderMode(value as '2d' | '3d')
		},

		{
			label: 'Symmetry',
			Icon: Layers3,
			type: 'toggle',
			value: geometryState.symmetry ? 'Enabled' : 'Disabled',
			onClick: () =>
				setGeometryState((prev) => ({
					...prev,
					symmetry: !prev.symmetry
				}))
		},

		{
			label: 'Max Height',
			Icon: Boxes,
			type: 'range',
			value: geometryState.maxHeight,
			min: 1,
			max: 100,
			step: 1,
			onClick: (value) =>
				setGeometryState((prev) => ({
					...prev,
					maxHeight: value
				}))
		},

		{
			label: 'Padding',
			Icon: Grid3x3,
			type: 'range',
			value: geometryState.padding,
			min: 0,
			max: 100,
			step: 1,
			onClick: (value) =>
				setGeometryState((prev) => ({
					...prev,
					padding: value
				}))
		},

		{
			label: 'Voxel Count',
			Icon: Boxes,
			type: 'range',
			value: geometryState.voxelCount,
			min: 5,
			max: 1000,
			step: 1,
			onClick: (value) =>
				setGeometryState((prev) => ({
					...prev,
					voxelCount: value
				}))
		},

		{
			label: 'Shape',
			Icon: Grid3x3,
			type: 'select',
			value: geometryState.shape,
			options: Object.values(GeometryShape).map((shape) => ({ label: shape, value: shape })),
			onClick: (value) =>
				setGeometryState((prev) => ({
					...prev,
					shape: value as GeometryShape
				}))
		},

		{
			label: 'Palette',
			Icon: Palette,
			type: 'select',
			value: geometryState.paletteType,
			options: Object.values(GeometryPaletteType).map((palette) => ({ label: palette, value: palette })),
			onClick: (value) =>
				setGeometryState((prev) => ({
					...prev,
					paletteType: value as GeometryPaletteType
				}))
		},

		{
			label: 'Line Style',
			Icon: Zap,
			type: 'select',
			value: geometryState.lineStyle,
			options: Object.values(GeometryLineStyle).map((style) => ({ label: style, value: style })),
			onClick: (value) =>
				setGeometryState((prev) => ({
					...prev,
					lineStyle: value as GeometryLineStyle
				}))
		},

		{
			label: 'Node Style',
			Icon: Wand2,
			type: 'select',
			value: geometryState.nodeStyle,
			options: Object.values(GeometryNodeStyle).map((style) => ({ label: style, value: style })),
			onClick: (value) =>
				setGeometryState((prev) => ({
					...prev,
					nodeStyle: value as GeometryNodeStyle
				}))
		},

		{
			label: 'Rotation',
			Icon: RotateCcw,
			type: 'range',
			value: geometryState.rotation,
			min: 6,
			max: 360,
			step: 1,
			onClick: (value) =>
				setGeometryState((prev) => ({
					...prev,
					rotation: value
				}))
		},

		{
			label: 'Background',
			Icon: Palette,
			type: 'select',
			value: geometryState.background,
			options: Object.values(GeometryBackground).map((bg) => ({ label: bg, value: bg })),
			onClick: (value) =>
				setGeometryState((prev) => ({
					...prev,
					background: value as GeometryBackground
				}))
		}
	];

	return (
		<div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
			{inputs.map((input, i) => {
				const { label, Icon } = input;

				return (
					<div key={i} className="rounded-xl border bg-muted/30 p-3">
						<div className="mb-2 flex items-center gap-2 text-xs font-medium text-muted-foreground">
							<Icon className="size-3.5" />
							{label}
						</div>

						<div className="flex flex-wrap gap-2">
							{input.type === 'button' && (
								<button onClick={input.onClick} className="rounded-md border px-3 py-2 text-sm transition hover:bg-muted">
									{input.value}
								</button>
							)}

							{input.type === 'toggle' && (
								<button onClick={input.onClick} className="rounded-md border px-3 py-2 text-sm transition hover:bg-muted">
									{input.value}
								</button>
							)}

							{input.type === 'range' && (
								<div className="flex w-full items-center gap-3">
									<Input
										type="range"
										min={input.min}
										max={input.max}
										step={input.step}
										value={input.value}
										onChange={(e) => input.onClick(Number(e.target.value))}
									/>

									<span className="min-w-10 text-xs text-muted-foreground">{input.value}</span>
								</div>
							)}

							{input.type === 'select' && (
								<select
									value={input.value}
									onChange={(e) => input.onClick(e.target.value as never)}
									className="w-full rounded-md border bg-background px-3 py-2 text-sm"
								>
									{input.options.map((option) => (
										<option key={option.value} value={option.value}>
											{option.label}
										</option>
									))}
								</select>
							)}

							{input.type === 'radio' && (
								<div className="flex gap-2">
									{input.options.map((option) => {
										const active = option.value === input.value;

										return (
											<button
												key={option.value}
												onClick={() => input.onClick(option.value)}
												className={`rounded-md border px-3 py-2 text-sm transition ${
													active ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
												}`}
											>
												{option.label}
											</button>
										);
									})}
								</div>
							)}
						</div>
					</div>
				);
			})}
		</div>
	);
};
