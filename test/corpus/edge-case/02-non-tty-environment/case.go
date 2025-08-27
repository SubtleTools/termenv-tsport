package main

import (
	"fmt"

	"github.com/muesli/termenv"
)

func main() {
	fmt.Println("--- Non-TTY Environment Test ---")
	
	// Test with default output (should detect non-TTY)
	out := termenv.NewOutput(nil)
	
	// Test color profile detection in non-TTY
	profile := out.ColorProfile()
	fmt.Printf("Non-TTY ColorProfile: %d\n", int(profile))
	
	// Test color rendering in non-TTY environment
	red := out.String("Red Text").Foreground(termenv.RGBColor("#FF0000"))
	blue := out.String("Blue Text").Foreground(termenv.RGBColor("#0000FF"))
	bold := out.String("Bold Text").Bold()
	
	fmt.Printf("Non-TTY Red: %s\n", red)
	fmt.Printf("Non-TTY Blue: %s\n", blue)
	fmt.Printf("Non-TTY Bold: %s\n", bold)
	
	// Test with forced TTY
	forcedTTYOut := termenv.NewOutput(nil, termenv.WithTTY(true))
	
	forcedProfile := forcedTTYOut.ColorProfile()
	fmt.Printf("Forced TTY ColorProfile: %d\n", int(forcedProfile))
	
	forcedRed := forcedTTYOut.String("Forced TTY Red").Foreground(termenv.RGBColor("#FF0000"))
	forcedBlue := forcedTTYOut.String("Forced TTY Blue").Foreground(termenv.RGBColor("#0000FF"))
	forcedBold := forcedTTYOut.String("Forced TTY Bold").Bold()
	
	fmt.Printf("Forced TTY Red: %s\n", forcedRed)
	fmt.Printf("Forced TTY Blue: %s\n", forcedBlue)
	fmt.Printf("Forced TTY Bold: %s\n", forcedBold)
	
	// Test with unsafe mode
	unsafeOut := termenv.NewOutput(nil, termenv.WithUnsafe())
	
	unsafeProfile := unsafeOut.ColorProfile()
	fmt.Printf("Unsafe ColorProfile: %d\n", int(unsafeProfile))
	
	unsafeRed := unsafeOut.String("Unsafe Red").Foreground(termenv.RGBColor("#FF0000"))
	unsafeBlue := unsafeOut.String("Unsafe Blue").Foreground(termenv.RGBColor("#0000FF"))
	unsafeBold := unsafeOut.String("Unsafe Bold").Bold()
	
	fmt.Printf("Unsafe Red: %s\n", unsafeRed)
	fmt.Printf("Unsafe Blue: %s\n", unsafeBlue)
	fmt.Printf("Unsafe Bold: %s\n", unsafeBold)
	
	// Test various combinations
	combinedOut := termenv.NewOutput(nil, 
		termenv.WithTTY(false), 
		termenv.WithProfile(termenv.TrueColor))
	
	combinedProfile := combinedOut.ColorProfile()
	fmt.Printf("Combined (TTY=false, TrueColor) Profile: %d\n", int(combinedProfile))
	
	combinedStyled := combinedOut.String("Combined Test").Bold().Foreground(termenv.RGBColor("#FF6600"))
	fmt.Printf("Combined styled: %s\n", combinedStyled)
}