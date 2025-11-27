import { CommandInput as CommandInputPrimitive } from 'cmdk'

type CommandInputType = typeof CommandInputPrimitive
export type CommandInputRef = React.ElementRef<CommandInputType>
export interface CommandInputProps extends React.ComponentPropsWithoutRef<CommandInputType> {
  searchIcon?: boolean
}
