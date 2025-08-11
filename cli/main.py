#!/usr/bin/env python3
"""
Zaans Recht CLI Application

A command line interface for Zaans Recht using InquirerPy and Rich.
"""

import sys
from typing import Dict, Any
from InquirerPy import prompt
from InquirerPy.base.control import Choice
from rich.console import Console
from rich.panel import Panel
from rich.text import Text as RichText
from rich.table import Table
from rich.progress import Progress, SpinnerColumn, TextColumn

# Initialize Rich console
console = Console()


def display_welcome():
    """Display welcome message with Rich formatting"""
    welcome_text = RichText("Welcome to Zaans Recht CLI", style="bold blue")
    panel = Panel(
        welcome_text,
        title="Zaans Recht",
        border_style="blue",
        padding=(1, 2)
    )
    console.print(panel)


def main_menu() -> Dict[str, Any]:
    """Display main menu and get user selection"""
    result = prompt([
        {
            'type': 'list',
            'name': 'action',
            'message': 'What would you like to do?',
            'choices': [
                'View Legal Information',
                'Search Legal Documents',
                'Contact Information',
                'About',
                'Exit'
            ],
        }
    ])
    return result


def view_legal_info():
    """Display legal information"""
    console.print("\n[bold green]Legal Information[/bold green]")
    
    table = Table(show_header=True, header_style="bold magenta")
    table.add_column("Topic", style="dim", width=20)
    table.add_column("Description", style="dim")
    
    table.add_row("Civil Law", "Information about civil legal matters")
    table.add_row("Criminal Law", "Criminal law procedures and information")
    table.add_row("Administrative Law", "Government and administrative procedures")
    table.add_row("Commercial Law", "Business and commercial legal matters")
    
    console.print(table)


def search_documents():
    """Search legal documents functionality"""
    result = prompt([
        {
            'type': 'input',
            'name': 'search_term',
            'message': 'Enter search term:',
            'validate': lambda x: len(x.strip()) > 0 or "Please enter a search term"
        }
    ])
    
    if result:
        search_term = result['search_term']
        
        console.print(f"\n[yellow]Searching for: {search_term}[/yellow]")
        
        with Progress(
            SpinnerColumn(),
            TextColumn("[progress.description]{task.description}"),
            console=console,
        ) as progress:
            task = progress.add_task("Searching documents...", total=100)
            
            import time
            for i in range(100):
                time.sleep(0.02)  # Simulate search time
                progress.update(task, advance=1)
        
        console.print(f"[green]Search completed for '{search_term}'[/green]")
        console.print("No documents found. (This is a demo application)")


def show_contact_info():
    """Display contact information"""
    console.print("\n[bold cyan]Contact Information[/bold cyan]")
    
    contact_panel = Panel(
        "[white]Zaans Recht\n"
        "📧 Email: info@zaansrecht.nl\n"
        "📞 Phone: +31 (0)75 123 4567\n"
        "🏢 Address: Zaandam, Netherlands[/white]",
        title="Contact Details",
        border_style="cyan"
    )
    console.print(contact_panel)


def show_about():
    """Display about information"""
    console.print("\n[bold yellow]About Zaans Recht CLI[/bold yellow]")
    
    about_text = (
        "This is a command line interface for Zaans Recht legal services.\n\n"
        "Built with:\n"
        "• Python 3.13\n"
        "• InquirerPy for interactive prompts\n"
        "• Rich for beautiful terminal output\n"
        "• Docker for containerization"
    )
    
    about_panel = Panel(
        about_text,
        title="About",
        border_style="yellow"
    )
    console.print(about_panel)


def main():
    """Main application loop"""
    try:
        display_welcome()
        
        while True:
            console.print()  # Add some spacing
            answers = main_menu()
            
            if not answers:
                break
                
            action = answers['action']
            
            if action == 'View Legal Information':
                view_legal_info()
            elif action == 'Search Legal Documents':
                search_documents()
            elif action == 'Contact Information':
                show_contact_info()
            elif action == 'About':
                show_about()
            elif action == 'Exit':
                console.print("\n[green]Thank you for using Zaans Recht CLI![/green]")
                break
            
            # Ask if user wants to continue
            continue_result = prompt([
                {
                    'type': 'confirm',
                    'name': 'continue',
                    'message': 'Would you like to perform another action?',
                    'default': True
                }
            ])
            
            if not continue_result or not continue_result['continue']:
                console.print("\n[green]Thank you for using Zaans Recht CLI![/green]")
                break
                
    except KeyboardInterrupt:
        console.print("\n\n[yellow]Application interrupted by user.[/yellow]")
        sys.exit(0)
    except Exception as e:
        console.print(f"\n[red]An error occurred: {e}[/red]")
        sys.exit(1)


if __name__ == "__main__":
    main()