# -*- coding: utf-8 -*-

from flask import Blueprint, Response, g

blueprint = Blueprint('property-tax-assessments-broken-model-scatterplots', __name__)

@blueprint.app_template_filter('get_length')
def get_length(thing):
	return len(thing)




"""
Tarbell project configuration
"""

# Google spreadsheet key
SPREADSHEET_KEY = "1fRWsDwi4-lmdS6r61JB44Zrlb6GR9-21DTpQkgTPBdw"

# Exclude these files from publication
EXCLUDES = ['*.md', '*.ai', 'requirements.txt', 'node_modules', 'sass', 'js/src', 'package.json', 'Gruntfile.js']

# Spreadsheet cache lifetime in seconds. (Default: 4)
# SPREADSHEET_CACHE_TTL = 4

# Create JSON data at ./data.json, disabled by default
# CREATE_JSON = True

# Get context from a local file or URL. This file can be a CSV or Excel
# spreadsheet file. Relative, absolute, and remote (http/https) paths can be 
# used.
# CONTEXT_SOURCE_FILE = ""

# EXPERIMENTAL: Path to a credentials file to authenticate with Google Drive.
# This is useful for for automated deployment. This option may be replaced by
# command line flag or environment variable. Take care not to commit or publish
# your credentials file.
# CREDENTIALS_PATH = ""

# S3 bucket configuration
S3_BUCKETS = {
    # Provide target -> s3 url pairs, such as:
    #     "mytarget": "mys3url.bucket.url/some/path"
    # then use tarbell publish mytarget to publish to it
    
    "production": "apps.chicagotribune.com/property-tax-assessments-broken-model-scatterplots",
    "staging": "apps.beta.tribapps.com/property-tax-assessments-broken-model-scatterplots",
}

# Default template variables
DEFAULT_CONTEXT = {
    'name': 'property-tax-assessments-broken-model-scatterplots',
    'title': 'Property tax assessments - How the model broke'
}