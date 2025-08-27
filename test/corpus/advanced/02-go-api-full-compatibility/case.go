package main

import (
	"fmt"

	"github.com/muesli/termenv"
)

func main() {
	fmt.Println("--- Go API Full Compatibility Test ---")
	
	// Test global convenience functions (PascalCase)
	fmt.Printf("ColorProfile: %d\n", int(termenv.ColorProfile()))
	fmt.Printf("EnvColorProfile: %d\n", int(termenv.EnvColorProfile()))
	fmt.Printf("EnvNoColor: %t\n", termenv.EnvNoColor())
	fmt.Printf("HasDarkBackground: %t\n", termenv.HasDarkBackground())
	
	// Test color creation functions
	rgbColor := termenv.RGBColor("#FF0000")
	ansiColor := termenv.ANSIColor(1)
	ansi256Color := termenv.ANSI256Color(196)
	
	fmt.Printf("RGBColor sequence: %s\n", rgbColor.Sequence(false))
	fmt.Printf("ANSIColor: %s\n", ansiColor.String())
	fmt.Printf("ANSI256Color: %s\n", ansi256Color.String())
	
	// Test String function (global convenience)
	globalString := termenv.String("Global String Test")
	fmt.Printf("Global String (plain): %s\n", globalString)
	
	globalStyled := termenv.String("Global Styled").Bold().Foreground(rgbColor)
	fmt.Printf("Global String (styled): %s\n", globalStyled)
	
	// Test NewOutput function
	out := termenv.NewOutput(nil, termenv.WithProfile(termenv.TrueColor))
	
	// Test Output methods
	outputString := out.String("Output String Test")
	fmt.Printf("Output String (plain): %s\n", outputString)
	
	outputStyled := out.String("Output Styled").Bold().Foreground(out.Color("#00FF00"))
	fmt.Printf("Output String (styled): %s\n", outputStyled)
	
	// Test String() method on Style
	style := out.String("Style String Method").Bold().Foreground(rgbColor)
	fmt.Printf("Style.String(): %s\n", style.String())
	
	// Test all style methods (PascalCase methods)
	allStyles := out.String("All Styles").
		Bold().
		Faint().
		Italic().
		Underline().
		Overline().
		Blink().
		Reverse().
		CrossOut().
		Foreground(rgbColor).
		Background(ansi256Color)
	
	fmt.Printf("All Styles: %s\n", allStyles)
	
	// Test color factory through Output.Color
	outputRgbColor := out.Color("#FF6600")
	outputColorStyled := out.String("Output Color").Foreground(outputRgbColor)
	fmt.Printf("Output Color: %s\n", outputColorStyled)
	
	// Test WithProfile, WithTTY, WithEnvironment, WithColorCache, WithUnsafe
	configuredOut := termenv.NewOutput(nil,
		termenv.WithProfile(termenv.ANSI256),
		termenv.WithTTY(true),
		termenv.WithColorCache(true),
		termenv.WithUnsafe())
	
	configuredStyled := configuredOut.String("Configured Output").Bold().Foreground(termenv.ANSI256Color(46))
	fmt.Printf("Configured Output: %s\n", configuredStyled)
}