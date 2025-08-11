#!/usr/bin/env python3
"""
Simple test to verify the CLI application imports and basic functionality work
"""

import sys
import os

# Add the CLI directory to the path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

try:
    # Test imports
    from main import display_welcome, view_legal_info, show_contact_info, show_about
    from rich.console import Console
    
    console = Console()
    console.print("[green]✓[/green] All imports successful")
    
    # Test basic functions that don't require user input
    console.print("\n[blue]Testing display functions...[/blue]")
    
    display_welcome()
    console.print("[green]✓[/green] Welcome display working")
    
    view_legal_info()
    console.print("[green]✓[/green] Legal info display working")
    
    show_contact_info()
    console.print("[green]✓[/green] Contact info display working")
    
    show_about()
    console.print("[green]✓[/green] About display working")
    
    console.print("\n[bold green]All tests passed! CLI application is working correctly.[/bold green]")
    
except Exception as e:
    console.print(f"[bold red]Test failed: {e}[/bold red]")
    sys.exit(1)