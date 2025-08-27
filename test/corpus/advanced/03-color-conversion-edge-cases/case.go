package main

import (
	"fmt"

	"github.com/muesli/termenv"
)

func main() {
	fmt.Println("--- Color Conversion Edge Cases Test ---")
	
	// Test color conversion between different profiles
	asciiOut := termenv.NewOutput(nil, termenv.WithProfile(termenv.Ascii))
	ansiOut := termenv.NewOutput(nil, termenv.WithProfile(termenv.ANSI))
	ansi256Out := termenv.NewOutput(nil, termenv.WithProfile(termenv.ANSI256))
	trueColorOut := termenv.NewOutput(nil, termenv.WithProfile(termenv.TrueColor))
	
	// Test edge case hex colors
	edgeColors := []string{
		"#000000", // Black
		"#FFFFFF", // White
		"#FF0000", // Pure Red
		"#00FF00", // Pure Green
		"#0000FF", // Pure Blue
		"#FFFF00", // Yellow
		"#FF00FF", // Magenta
		"#00FFFF", // Cyan
		"#808080", // Gray
		"#FF8000", // Orange
		"#8000FF", // Purple
		"#000080", // Navy
		"#008000", // Dark Green
		"#800000", // Maroon
	}
	
	for _, hexColor := range edgeColors {
		rgbColor := termenv.RGBColor(hexColor)
		
		asciiResult := asciiOut.String(hexColor).Foreground(rgbColor)
		ansiResult := ansiOut.String(hexColor).Foreground(rgbColor)
		ansi256Result := ansi256Out.String(hexColor).Foreground(rgbColor)
		trueColorResult := trueColorOut.String(hexColor).Foreground(rgbColor)
		
		fmt.Printf("%s -> Ascii: %s\n", hexColor, asciiResult)
		fmt.Printf("%s -> ANSI: %s\n", hexColor, ansiResult)
		fmt.Printf("%s -> ANSI256: %s\n", hexColor, ansi256Result)
		fmt.Printf("%s -> TrueColor: %s\n", hexColor, trueColorResult)
		fmt.Println()
	}
	
	// Test ANSI256 to ANSI conversion edge cases
	fmt.Println("--- ANSI256 to ANSI Conversion ---")
	edgeAnsi256Colors := []int{0, 1, 7, 8, 15, 16, 231, 232, 255}
	
	for _, ansi256Value := range edgeAnsi256Colors {
		ansi256Color := termenv.ANSI256Color(ansi256Value)
		
		ansiResult := ansiOut.String(fmt.Sprintf("ANSI256 %d", ansi256Value)).Foreground(ansi256Color)
		ansi256Result := ansi256Out.String(fmt.Sprintf("ANSI256 %d", ansi256Value)).Foreground(ansi256Color)
		
		fmt.Printf("ANSI256 %d -> ANSI: %s\n", ansi256Value, ansiResult)
		fmt.Printf("ANSI256 %d -> ANSI256: %s\n", ansi256Value, ansi256Result)
		fmt.Println()
	}
	
	// Test very close colors
	fmt.Println("--- Close Colors Test ---")
	closeColors := []string{
		"#FF0000", "#FF0001", "#FF0100", "#FF1000",
		"#000000", "#010101", "#020202", "#0F0F0F",
		"#FFFFFF", "#FEFEFE", "#FDFDFD", "#F0F0F0",
	}
	
	for _, hexColor := range closeColors {
		rgbColor := termenv.RGBColor(hexColor)
		ansiResult := ansiOut.String(hexColor).Foreground(rgbColor)
		fmt.Printf("%s -> ANSI: %s\n", hexColor, ansiResult)
	}
}