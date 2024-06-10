import React from 'react'
import { HexColorPicker, HexColorInput } from 'react-colorful'

export const ColorPicker = ({
  color,
  onChange,
  presetColors
}: {
  color: string
  onChange: (color: string) => void
  presetColors: string[]
}) => {
  return (
    <div className='picker'>
      <HexColorPicker color={color} onChange={onChange} />
      <HexColorInput color={color} onChange={onChange} />

      <div className='picker__swatches'>
        {presetColors.map((presetColor: any) => (
          <button
            key={presetColor}
            className='picker__swatch'
            style={{ background: presetColor }}
            onClick={() => onChange(presetColor)}
          />
        ))}
      </div>
    </div>
  )
}
