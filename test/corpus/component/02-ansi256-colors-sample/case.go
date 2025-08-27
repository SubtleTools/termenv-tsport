package main

import (
	"fmt"

	"github.com/muesli/termenv"
)

func main() {
	// Force ANSI256 profile for consistent testing
	out := termenv.NewOutput(nil, termenv.WithProfile(termenv.ANSI256))
	
	// Test representative ANSI256 colors (16-255)
	// Test standard 216 color cube samples
	sampleColors := []int{16, 21, 27, 33, 39, 45, 51, 57, 63, 69, 75, 81, 87, 93, 99, 105, 111, 117, 123, 129, 135, 141, 147, 153, 159, 165, 171, 177, 183, 189, 195, 201, 207, 213, 219, 225, 231}
	
	fmt.Println("--- ANSI256 Color Cube Samples ---")
	for _, colorValue := range sampleColors {
		color := termenv.ANSI256Color(colorValue)
		styled := out.String(fmt.Sprintf("ANSI256 Color %d", colorValue)).Foreground(color)
		fmt.Printf("%s\n", styled)
	}
	
	// Test grayscale colors (232-255)
	fmt.Println("\n--- Grayscale Colors ---")
	for i := 232; i <= 255; i++ {
		color := termenv.ANSI256Color(i)
		styled := out.String(fmt.Sprintf("Gray %d", i)).Foreground(color)
		fmt.Printf("%s\n", styled)
	}
	
	// Test background colors
	fmt.Println("\n--- Background Colors ---")
	for _, colorValue := range []int{196, 46, 21, 33} {
		color := termenv.ANSI256Color(colorValue)
		styled := out.String(fmt.Sprintf("BG %d", colorValue)).Background(color)
		fmt.Printf("%s\n", styled)
	}
}