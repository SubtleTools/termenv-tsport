package main

import (
	"fmt"

	"github.com/muesli/termenv"
)

func main() {
	fmt.Println("--- Profile Types Test ---")
	
	// Test Ascii profile
	asciiOut := termenv.NewOutput(nil, termenv.WithProfile(termenv.Ascii))
	asciiStyled := asciiOut.String("Ascii Profile Text").Bold().Foreground(termenv.RGBColor("#FF0000"))
	fmt.Printf("Ascii Profile: %s\n", asciiStyled)
	
	// Test ANSI profile  
	ansiOut := termenv.NewOutput(nil, termenv.WithProfile(termenv.ANSI))
	ansiStyled := ansiOut.String("ANSI Profile Text").Bold().Foreground(termenv.ANSIColor(1))
	fmt.Printf("ANSI Profile: %s\n", ansiStyled)
	
	// Test ANSI256 profile
	ansi256Out := termenv.NewOutput(nil, termenv.WithProfile(termenv.ANSI256))
	ansi256Styled := ansi256Out.String("ANSI256 Profile Text").Bold().Foreground(termenv.ANSI256Color(196))
	fmt.Printf("ANSI256 Profile: %s\n", ansi256Styled)
	
	// Test TrueColor profile
	trueColorOut := termenv.NewOutput(nil, termenv.WithProfile(termenv.TrueColor))
	trueColorStyled := trueColorOut.String("TrueColor Profile Text").Bold().Foreground(termenv.RGBColor("#FF0000"))
	fmt.Printf("TrueColor Profile: %s\n", trueColorStyled)
	
	// Test color conversion across profiles
	fmt.Println("\n--- Color Conversion Test ---")
	
	// RGB color in different profiles
	rgbColor := termenv.RGBColor("#FF6600")
	
	asciiRgb := asciiOut.String("RGB in Ascii").Foreground(rgbColor)
	ansiRgb := ansiOut.String("RGB in ANSI").Foreground(rgbColor)
	ansi256Rgb := ansi256Out.String("RGB in ANSI256").Foreground(rgbColor)
	trueColorRgb := trueColorOut.String("RGB in TrueColor").Foreground(rgbColor)
	
	fmt.Printf("RGB #FF6600 in Ascii: %s\n", asciiRgb)
	fmt.Printf("RGB #FF6600 in ANSI: %s\n", ansiRgb)
	fmt.Printf("RGB #FF6600 in ANSI256: %s\n", ansi256Rgb)
	fmt.Printf("RGB #FF6600 in TrueColor: %s\n", trueColorRgb)
	
	// ANSI256 color in different profiles
	ansi256Color := termenv.ANSI256Color(214)
	
	asciiAnsi256 := asciiOut.String("ANSI256 in Ascii").Foreground(ansi256Color)
	ansiAnsi256 := ansiOut.String("ANSI256 in ANSI").Foreground(ansi256Color)
	ansi256Ansi256 := ansi256Out.String("ANSI256 in ANSI256").Foreground(ansi256Color)
	trueColorAnsi256 := trueColorOut.String("ANSI256 in TrueColor").Foreground(ansi256Color)
	
	fmt.Printf("ANSI256 214 in Ascii: %s\n", asciiAnsi256)
	fmt.Printf("ANSI256 214 in ANSI: %s\n", ansiAnsi256)
	fmt.Printf("ANSI256 214 in ANSI256: %s\n", ansi256Ansi256)
	fmt.Printf("ANSI256 214 in TrueColor: %s\n", trueColorAnsi256)
}