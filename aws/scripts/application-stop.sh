#!/bin/bash
set -x

# System control will return either "active" or "inactive".
webapp_running=$(systemctl is-active webapp.ervice)
if [ "$webapp_running" == "active" ]; then
    sudo systemctl disable webapp.service
    sudo systemctl stop webapp.service
fi