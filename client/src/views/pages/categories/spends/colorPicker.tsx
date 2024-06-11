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
  const handleColorChange = (color: string) => {
    onChange(color)
  }

  return (
    <div className='picker'>
      <HexColorPicker color={color} onChange={handleColorChange} />
      <HexColorInput color={color} onChange={handleColorChange} />
      <div className='picker__swatches'>
        {presetColors.map((presetColor: any) => (
          <button
            key={presetColor}
            type='button'
            className='picker__swatch'
            style={{ background: presetColor }}
            onClick={() => handleColorChange(presetColor)}
          />
        ))}
      </div>
    </div>
  )
}
