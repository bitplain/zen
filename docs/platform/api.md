---
title: "API"
icon: lucide/code-2
---

# API справочник

!!! tip "Формат"
    Все примеры показывают аутентификацию через заголовок `Authorization: Bearer <token>`.

## Базовый вызов

```bash
curl -H "Authorization: Bearer <token>" \
     -H "Content-Type: application/json" \
     https://api.acme.com/v1/health
```

## Пример запроса

```bash
curl -X POST https://api.acme.com/v1/orders \
  -H "Authorization: Bearer <token>" \
  -d '{"sku": "SKU-1", "quantity": 2}'
```

## Рекомендации

- Версионирование через префикс `/v1`, `/v2`.
- Генерируйте SDK из OpenAPI и размещайте ссылки в разделе How-to.
- Для вебхуков документируйте схемы и подписи.
