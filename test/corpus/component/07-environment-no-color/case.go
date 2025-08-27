package main

import (
	"fmt"

	"github.com/muesli/termenv"
)

func main() {
	fmt.Println("--- Environment Detection: NO_COLOR Test ---")
	
	// Create output with default settings
	out := termenv.NewOutput(nil)
	
	// Test EnvNoColor function
	noColor := termenv.EnvNoColor()
	fmt.Printf("EnvNoColor(): %t\n", noColor)
	
	// Test EnvColorProfile function
	envProfile := termenv.EnvColorProfile()
	fmt.Printf("EnvColorProfile(): %d\n", int(envProfile))
	
	// Test color rendering with NO_COLOR set
	red := out.String("Red Text").Foreground(termenv.RGBColor("#FF0000"))
	blue := out.String("Blue Text").Foreground(termenv.RGBColor("#0000FF"))
	bold := out.String("Bold Text").Bold()
	
	fmt.Printf("Red Text: %s\n", red)
	fmt.Printf("Blue Text: %s\n", blue)
	fmt.Printf("Bold Text: %s\n", bold)
	
	// Test with different color types
	ansiRed := out.String("ANSI Red").Foreground(termenv.ANSIColor(1))
	ansi256Red := out.String("ANSI256 Red").Foreground(termenv.ANSI256Color(196))
	
	fmt.Printf("ANSI Red: %s\n", ansiRed)
	fmt.Printf("ANSI256 Red: %s\n", ansi256Red)
	
	// Test background colors
	bgRed := out.String("Background Red").Background(termenv.RGBColor("#FF0000"))
	fmt.Printf("Background Red: %s\n", bgRed)
}