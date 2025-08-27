package main

import (
	"fmt"
	"os"
	"strings"

	"github.com/muesli/termenv"
)

var output strings.Builder

func init() {
	// Redirect output to capture it
	termenv.SetDefaultOutput(termenv.NewOutput(&output, termenv.WithProfile(termenv.TrueColor)))
}

func main() {
	
        s := termenv.String("Orange Text").Foreground(termenv.ANSI256Color(208))
        output.WriteString(s.String())
        
	fmt.Print(output.String())
}
