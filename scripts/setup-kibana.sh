#!/bin/bash

# منتظر آماده شدن Elasticsearch
until curl -s http://elasticsearch:9200 >/dev/null; do
    echo 'Waiting for Elasticsearch...'
    sleep 1
done

# منتظر آماده شدن Kibana
until curl -s http://kibana:5601/api/status >/dev/null; do
    echo 'Waiting for Kibana...'
    sleep 1
done

# ایجاد Index Pattern
curl -X POST "http://kibana:5601/api/saved_objects/index-pattern" \
    -H "Content-Type: application/json" \
    -H "kbn-xsrf: true" \
    -d @/setup/index-pattern.json

# ایجاد داشبوردها
curl -X POST "http://kibana:5601/api/saved_objects/_bulk_create" \
    -H "Content-Type: application/json" \
    -H "kbn-xsrf: true" \
    -d @/setup/dashboards/*.json