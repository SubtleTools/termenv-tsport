package main

import (
	"fmt"
	"os"

	"github.com/muesli/termenv"
)

type testEnviron struct {
	vars map[string]string
}

func (e testEnviron) Getenv(key string) string {
	return e.vars[key]
}

func (e testEnviron) Environ() []string {
	var result []string
	for k, v := range e.vars {
		result = append(result, k+"="+v)
	}
	return result
}

func main() {
	fmt.Println("--- Output Methods Comprehensive Test ---")
	
	// Test newOutput factory with various options
	fmt.Println("--- NewOutput Factory Tests ---")
	
	// Default output
	defaultOut := termenv.NewOutput(os.Stdout)
	fmt.Printf("Default profile: %d\n", int(defaultOut.ColorProfile()))
	
	// With profile
	profileOut := termenv.NewOutput(os.Stdout, termenv.WithProfile(termenv.TrueColor))
	fmt.Printf("TrueColor profile: %d\n", int(profileOut.ColorProfile()))
	
	// With TTY forced
	ttyOut := termenv.NewOutput(os.Stdout, termenv.WithTTY(true))
	fmt.Printf("TTY forced profile: %d\n", int(ttyOut.ColorProfile()))
	
	// With color cache
	cacheOut := termenv.NewOutput(os.Stdout, termenv.WithColorCache(true))
	fmt.Printf("Cache enabled profile: %d\n", int(cacheOut.ColorProfile()))
	
	// With unsafe mode
	unsafeOut := termenv.NewOutput(os.Stdout, termenv.WithUnsafe())
	fmt.Printf("Unsafe mode profile: %d\n", int(unsafeOut.ColorProfile()))
	
	// Test with custom environment
	customEnv := testEnviron{
		vars: map[string]string{
			"FORCE_COLOR": "3",
			"TERM":        "xterm-256color",
		},
	}
	envOut := termenv.NewOutput(os.Stdout, termenv.WithEnvironment(customEnv))
	fmt.Printf("Custom env profile: %d\n", int(envOut.ColorProfile()))
	
	// Test combined options
	combinedOut := termenv.NewOutput(os.Stdout,
		termenv.WithProfile(termenv.ANSI256),
		termenv.WithTTY(true),
		termenv.WithColorCache(true),
		termenv.WithUnsafe())
	fmt.Printf("Combined options profile: %d\n", int(combinedOut.ColorProfile()))
	
	// Test global functions
	fmt.Println("\n--- Global Functions Tests ---")
	
	fmt.Printf("ColorProfile(): %d\n", int(termenv.ColorProfile()))
	fmt.Printf("EnvColorProfile(): %d\n", int(termenv.EnvColorProfile()))
	fmt.Printf("EnvNoColor(): %t\n", termenv.EnvNoColor())
	fmt.Printf("HasDarkBackground(): %t\n", termenv.HasDarkBackground())
	
	// Test color detection functions
	fgColor := termenv.ForegroundColor()
	bgColor := termenv.BackgroundColor()
	fmt.Printf("ForegroundColor sequence: %s\n", fgColor.Sequence(false))
	fmt.Printf("BackgroundColor sequence: %s\n", bgColor.Sequence(false))
	
	// Test output color methods
	fmt.Println("\n--- Output Color Methods Tests ---")
	
	outFgColor := defaultOut.ForegroundColor()
	outBgColor := defaultOut.BackgroundColor()
	fmt.Printf("Output ForegroundColor sequence: %s\n", outFgColor.Sequence(false))
	fmt.Printf("Output BackgroundColor sequence: %s\n", outBgColor.Sequence(false))
	fmt.Printf("Output HasDarkBackground: %t\n", defaultOut.HasDarkBackground())
	
	// Test output environment methods
	fmt.Printf("Output EnvNoColor: %t\n", defaultOut.EnvNoColor())
	fmt.Printf("Output EnvColorProfile: %d\n", int(defaultOut.EnvColorProfile()))
	
	// Test Color factory method
	colorRed := defaultOut.Color("#FF0000")
	colorBlue := defaultOut.Color("4") // ANSI color
	colorGreen := defaultOut.Color("46") // ANSI256 color
	
	redStyled := defaultOut.String("Red from Color()").Foreground(colorRed)
	blueStyled := defaultOut.String("Blue from Color()").Foreground(colorBlue)
	greenStyled := defaultOut.String("Green from Color()").Foreground(colorGreen)
	
	fmt.Printf("Color() red: %s\n", redStyled)
	fmt.Printf("Color() blue: %s\n", blueStyled)  
	fmt.Printf("Color() green: %s\n", greenStyled)
	
	// Test profile compatibility
	fmt.Println("\n--- Profile Compatibility Tests ---")
	
	profiles := []termenv.Profile{termenv.Ascii, termenv.ANSI, termenv.ANSI256, termenv.TrueColor}
	profileNames := []string{"Ascii", "ANSI", "ANSI256", "TrueColor"}
	
	testColor := termenv.RGBColor("#FF6600")
	
	for i, profile := range profiles {
		profileOut := termenv.NewOutput(os.Stdout, termenv.WithProfile(profile))
		styled := profileOut.String(fmt.Sprintf("%s Test", profileNames[i])).Foreground(testColor)
		fmt.Printf("%s profile: %s\n", profileNames[i], styled)
	}
}