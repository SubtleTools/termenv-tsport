package main

import (
	"fmt"

	"github.com/muesli/termenv"
)

func main() {
	// Force Ascii profile for consistent testing
	out := termenv.NewOutput(nil, termenv.WithProfile(termenv.Ascii))
	
	// Test NoColor with various color attempts
	fmt.Println("--- NoColor Tests (ASCII Profile) ---")
	
	// Test with RGB colors - should render as plain text
	red := out.String("Red Text").Foreground(termenv.RGBColor("#FF0000"))
	blue := out.String("Blue Text").Foreground(termenv.RGBColor("#0000FF"))
	green := out.String("Green Text").Foreground(termenv.RGBColor("#00FF00"))
	
	fmt.Printf("RGB Red: %s\n", red)
	fmt.Printf("RGB Blue: %s\n", blue)
	fmt.Printf("RGB Green: %s\n", green)
	
	// Test with ANSI colors - should render as plain text
	ansiRed := out.String("ANSI Red").Foreground(termenv.ANSIColor(1))
	ansiBlue := out.String("ANSI Blue").Foreground(termenv.ANSIColor(4))
	
	fmt.Printf("ANSI Red: %s\n", ansiRed)
	fmt.Printf("ANSI Blue: %s\n", ansiBlue)
	
	// Test with ANSI256 colors - should render as plain text
	ansi256Red := out.String("ANSI256 Red").Foreground(termenv.ANSI256Color(196))
	ansi256Blue := out.String("ANSI256 Blue").Foreground(termenv.ANSI256Color(21))
	
	fmt.Printf("ANSI256 Red: %s\n", ansi256Red)
	fmt.Printf("ANSI256 Blue: %s\n", ansi256Blue)
	
	// Test styling - should also render as plain text
	bold := out.String("Bold Text").Bold()
	italic := out.String("Italic Text").Italic()
	underline := out.String("Underlined Text").Underline()
	
	fmt.Printf("Bold: %s\n", bold)
	fmt.Printf("Italic: %s\n", italic)
	fmt.Printf("Underline: %s\n", underline)
	
	// Test background colors - should render as plain text
	bgRed := out.String("Background Red").Background(termenv.RGBColor("#FF0000"))
	
	fmt.Printf("Background: %s\n", bgRed)
}