package main

import (
	"fmt"

	"github.com/muesli/termenv"
)

func main() {
	// Force TrueColor profile for consistent testing
	out := termenv.NewOutput(nil, termenv.WithProfile(termenv.TrueColor))
	
	fmt.Println("--- Invalid Colors Edge Case Test ---")
	
	// Test invalid hex colors
	invalidHexColors := []string{"invalid", "#ZZZZZZ", "#12345", "#1234567", "", " ", "#"}
	
	for _, invalidHex := range invalidHexColors {
		rgbColor := termenv.RGBColor(invalidHex)
		styled := out.String(fmt.Sprintf("Invalid hex '%s'", invalidHex)).Foreground(rgbColor)
		fmt.Printf("Invalid hex '%s': %s\n", invalidHex, styled)
	}
	
	// Test out-of-range ANSI colors
	invalidAnsiColors := []int{-1, 16, 256, 999}
	
	for _, invalidAnsi := range invalidAnsiColors {
		ansiColor := termenv.ANSIColor(invalidAnsi)
		styled := out.String(fmt.Sprintf("Invalid ANSI %d", invalidAnsi)).Foreground(ansiColor)
		fmt.Printf("Invalid ANSI %d: %s\n", invalidAnsi, styled)
	}
	
	// Test out-of-range ANSI256 colors
	invalidAnsi256Colors := []int{-1, 256, 300, 999}
	
	for _, invalidAnsi256 := range invalidAnsi256Colors {
		ansi256Color := termenv.ANSI256Color(invalidAnsi256)
		styled := out.String(fmt.Sprintf("Invalid ANSI256 %d", invalidAnsi256)).Foreground(ansi256Color)
		fmt.Printf("Invalid ANSI256 %d: %s\n", invalidAnsi256, styled)
	}
	
	// Test empty string styling
	emptyStyled := out.String("").Bold().Foreground(termenv.RGBColor("#FF0000"))
	fmt.Printf("Empty string styled: '%s'\n", emptyStyled)
	
	// Test whitespace-only strings
	whitespaceStyled := out.String("   ").Bold().Foreground(termenv.RGBColor("#00FF00"))
	fmt.Printf("Whitespace styled: '%s'\n", whitespaceStyled)
	
	// Test null color (NoColor equivalent)
	noColor := termenv.NoColor{}
	noColorStyled := out.String("NoColor test").Foreground(noColor)
	fmt.Printf("NoColor styled: %s\n", noColorStyled)
	
	// Test chaining with invalid colors
	chainedInvalid := out.String("Chained with invalid").
		Bold().
		Foreground(termenv.RGBColor("#INVALID")).
		Background(termenv.ANSI256Color(-5)).
		Italic()
	
	fmt.Printf("Chained with invalid: %s\n", chainedInvalid)
}