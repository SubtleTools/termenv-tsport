package main

import (
	"fmt"

	"github.com/muesli/termenv"
)

func main() {
	// Force TrueColor profile for consistent testing
	out := termenv.NewOutput(nil, termenv.WithProfile(termenv.TrueColor))
	
	// Test basic text styling
	bold := out.String("Bold Text").Bold()
	italic := out.String("Italic Text").Italic()
	underline := out.String("Underlined Text").Underline()
	combined := out.String("Bold Italic Red").Bold().Italic().Foreground(out.Color("#FF0000"))
	
	fmt.Println(bold)
	fmt.Println(italic)  
	fmt.Println(underline)
	fmt.Println(combined)
}