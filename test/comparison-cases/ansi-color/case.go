package main

import (
	"fmt"
	"strings"

	"github.com/muesli/termenv"
)

var output strings.Builder

func init() {
	// Redirect output to capture it
	termenv.SetDefaultOutput(termenv.NewOutput(&output, termenv.WithProfile(termenv.TrueColor)))
}

func main() {
	
        s := termenv.String("Bright Red").Foreground(termenv.ANSIColor(9))
        output.WriteString(s.String())
        
	fmt.Print(output.String())
}
