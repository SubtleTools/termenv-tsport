package main

import (
	"fmt"

	"github.com/muesli/termenv"
)

func main() {
	fmt.Println("--- Environment Detection: FORCE_COLOR Test ---")
	
	// Create output with default settings
	out := termenv.NewOutput(nil)
	
	// Test color profile detection with FORCE_COLOR
	colorProfile := termenv.ColorProfile()
	fmt.Printf("ColorProfile(): %d\n", int(colorProfile))
	
	// Test environment-based color profile
	envProfile := termenv.EnvColorProfile()
	fmt.Printf("EnvColorProfile(): %d\n", int(envProfile))
	
	// Test EnvNoColor (should be false with FORCE_COLOR)
	noColor := termenv.EnvNoColor()
	fmt.Printf("EnvNoColor(): %t\n", noColor)
	
	// Test color rendering with FORCE_COLOR set
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
	
	// Test with ANSI256 colors
	ansi256Red := out.String("ANSI256 Red").Foreground(termenv.ANSI256Color(196))
	ansi256Blue := out.String("ANSI256 Blue").Foreground(termenv.ANSI256Color(21))
	
	fmt.Printf("ANSI256 Red: %s\n", ansi256Red)
	fmt.Printf("ANSI256 Blue: %s\n", ansi256Blue)
	
	// Test styling
	bold := out.String("Bold Text").Bold()
	italic := out.String("Italic Text").Italic()
	
	fmt.Printf("Bold Text: %s\n", bold)
	fmt.Printf("Italic Text: %s\n", italic)
}