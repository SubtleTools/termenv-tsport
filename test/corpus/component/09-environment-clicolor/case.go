package main

import (
	"fmt"

	"github.com/muesli/termenv"
)

func main() {
	fmt.Println("--- Environment Detection: CLICOLOR Test ---")
	
	// Create output with default settings
	out := termenv.NewOutput(nil)
	
	// Test color profile detection with CLICOLOR
	colorProfile := termenv.ColorProfile()
	fmt.Printf("ColorProfile(): %d\n", int(colorProfile))
	
	// Test environment-based color profile
	envProfile := termenv.EnvColorProfile()
	fmt.Printf("EnvColorProfile(): %d\n", int(envProfile))
	
	// Test EnvNoColor with CLICOLOR
	noColor := termenv.EnvNoColor()
	fmt.Printf("EnvNoColor(): %t\n", noColor)
	
	// Test color rendering with CLICOLOR=0 (should disable colors)
	red := out.String("Red Text").Foreground(termenv.RGBColor("#FF0000"))
	blue := out.String("Blue Text").Foreground(termenv.RGBColor("#0000FF"))
	green := out.String("Green Text").Foreground(termenv.RGBColor("#00FF00"))
	
	fmt.Printf("Red Text: %s\n", red)
	fmt.Printf("Blue Text: %s\n", blue)
	fmt.Printf("Green Text: %s\n", green)
	
	// Test with ANSI colors
	ansiRed := out.String("ANSI Red").Foreground(termenv.ANSIColor(1))
	ansiBlue := out.String("ANSI Blue").Foreground(termenv.ANSIColor(4))
	
	fmt.Printf("ANSI Red: %s\n", ansiRed)
	fmt.Printf("ANSI Blue: %s\n", ansiBlue)
	
	// Test styling (should also be disabled)
	bold := out.String("Bold Text").Bold()
	italic := out.String("Italic Text").Italic()
	underline := out.String("Underlined Text").Underline()
	
	fmt.Printf("Bold Text: %s\n", bold)
	fmt.Printf("Italic Text: %s\n", italic)
	fmt.Printf("Underlined Text: %s\n", underline)
	
	// Test background colors
	bgRed := out.String("Background Red").Background(termenv.RGBColor("#FF0000"))
	fmt.Printf("Background Red: %s\n", bgRed)
}