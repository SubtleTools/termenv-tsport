package main

import (
	"fmt"

	"github.com/muesli/termenv"
)

func main() {
	// Force TrueColor profile for consistent testing
	out := termenv.NewOutput(nil, termenv.WithProfile(termenv.TrueColor))
	
	fmt.Println("--- All Style Methods Test ---")
	
	// Test basic text styling methods
	bold := out.String("Bold Text").Bold()
	faint := out.String("Faint Text").Faint()
	italic := out.String("Italic Text").Italic()
	underline := out.String("Underlined Text").Underline()
	overline := out.String("Overlined Text").Overline()
	
	fmt.Printf("Bold: %s\n", bold)
	fmt.Printf("Faint: %s\n", faint)
	fmt.Printf("Italic: %s\n", italic)
	fmt.Printf("Underline: %s\n", underline)
	fmt.Printf("Overline: %s\n", overline)
	
	// Test special effects
	blink := out.String("Blinking Text").Blink()
	reverse := out.String("Reversed Text").Reverse()
	crossOut := out.String("Crossed Out Text").CrossOut()
	
	fmt.Printf("Blink: %s\n", blink)
	fmt.Printf("Reverse: %s\n", reverse)
	fmt.Printf("CrossOut: %s\n", crossOut)
	
	// Test color combinations with styles
	styledColor := out.String("Bold Red Text").Bold().Foreground(termenv.RGBColor("#FF0000"))
	styledBg := out.String("Italic Blue Background").Italic().Background(termenv.RGBColor("#0000FF"))
	
	fmt.Printf("Styled Color: %s\n", styledColor)
	fmt.Printf("Styled Background: %s\n", styledBg)
	
	// Test complex combinations
	complex := out.String("Bold Italic Underlined Red on Blue").
		Bold().
		Italic().
		Underline().
		Foreground(termenv.RGBColor("#FF0000")).
		Background(termenv.RGBColor("#0000FF"))
	
	fmt.Printf("Complex: %s\n", complex)
}