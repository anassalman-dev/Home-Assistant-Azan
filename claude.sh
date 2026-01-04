#!/bin/bash

# Script pour lancer Claude AI dans ce projet
# Usage: ./claude.sh [mode] [options] [prompt]

CLAUDE_PATH="$HOME/.local/bin/claude"
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Couleurs pour l'affichage
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Fonction d'aide
show_help() {
    echo -e "${BLUE}Claude AI - Aide${NC}"
    echo ""
    echo "Usage: ./claude.sh [mode] [options] [prompt]"
    echo ""
    echo "Modes:"
    echo -e "  ${GREEN}code${NC}              Lance une session interactive Claude Code (défaut)"
    echo -e "  ${GREEN}chat${NC}              Lance Claude en mode chat interactif"
    echo -e "  ${GREEN}prompt${NC} <text>     Exécute un prompt spécifique"
    echo -e "  ${GREEN}help${NC}              Affiche cette aide"
    echo ""
    echo "Exemples:"
    echo "  ./claude.sh                          # Session interactive"
    echo "  ./claude.sh code                     # Session interactive (explicite)"
    echo "  ./claude.sh prompt \"explique le code\" # Avec un prompt"
    echo "  ./claude.sh --print \"votre question\"  # Mode non-interactif"
    echo ""
}

# Vérifier que Claude est installé
if [ ! -f "$CLAUDE_PATH" ]; then
    echo -e "${YELLOW}Erreur: Claude n'est pas installé à $CLAUDE_PATH${NC}" >&2
    echo "Veuillez installer Claude CLI depuis: https://docs.anthropic.com/claude/docs/claude-cli" >&2
    exit 1
fi

# Traitement des arguments
if [ $# -eq 0 ]; then
    # Mode interactif par défaut
    echo -e "${GREEN}Démarrage de Claude Code en mode interactif...${NC}"
    echo -e "${BLUE}Répertoire du projet: $PROJECT_DIR${NC}"
    echo "Utilisez Ctrl+C pour quitter."
    echo ""
    cd "$PROJECT_DIR"
    exec "$CLAUDE_PATH"
elif [ "$1" == "help" ] || [ "$1" == "--help" ] || [ "$1" == "-h" ]; then
    show_help
    exit 0
elif [ "$1" == "code" ]; then
    # Mode code interactif
    shift
    echo -e "${GREEN}Mode Claude Code${NC}"
    cd "$PROJECT_DIR"
    exec "$CLAUDE_PATH" "$@"
elif [ "$1" == "chat" ]; then
    # Mode chat interactif
    shift
    echo -e "${GREEN}Mode Claude Chat${NC}"
    cd "$PROJECT_DIR"
    exec "$CLAUDE_PATH" "$@"
elif [ "$1" == "prompt" ]; then
    # Mode prompt spécifique
    shift
    if [ $# -eq 0 ]; then
        echo -e "${YELLOW}Erreur: Un prompt est requis après 'prompt'${NC}" >&2
        exit 1
    fi
    cd "$PROJECT_DIR"
    exec "$CLAUDE_PATH" "$@"
else
    # Passer tous les arguments à Claude
    cd "$PROJECT_DIR"
    exec "$CLAUDE_PATH" "$@"
fi

