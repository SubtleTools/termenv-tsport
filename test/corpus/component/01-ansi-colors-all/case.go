package main

import (
	"fmt"

	"github.com/muesli/termenv"
)

func main() {
	// Force ANSI profile for consistent testing
	out := termenv.NewOutput(nil, termenv.WithProfile(termenv.ANSI))
	
	// Test all 16 ANSI colors (0-15)
	for i := 0; i <= 15; i++ {
		color := termenv.ANSIColor(i)
		styled := out.String(fmt.Sprintf("ANSI Color %d", i)).Foreground(color)
		fmt.Printf("%s\n", styled)
	}
	
	// Test ANSI colors as background
	fmt.Println("\n--- Background Colors ---")
	for i := 0; i <= 7; i++ {  // Only test first 8 colors for background
		color := termenv.ANSIColor(i)
		styled := out.String(fmt.Sprintf("BG %d", i)).Background(color)
		fmt.Printf("%s\n", styled)
	}
}