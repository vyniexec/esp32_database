#include <stdio.h>
#include "wifiStaa.h"
#include "includess.h"

int dadoo = 20;
char *userr = "Vinicius";

/* == Manipulador HTTP GET led2on == */
esp_err_t dado_get(httpd_req_t *req)
{
    char response[1024];
    sprintf(response, "{\"dado\": %d, \"user\": \"%s\"}", dadoo, userr);
    httpd_resp_set_type(req, "application/json");
    httpd_resp_send(req, response, strlen(response));
    return ESP_OK;
}

/* == Configuração do evento LED OFF no HTTP GET == */
httpd_uri_t dado_uri = {
    .uri = "/dado",
    .method = HTTP_GET,
    .handler = dado_get,
    .user_ctx = NULL
};

/* == Função para inicar o WEB Server HTTP == */
httpd_handle_t start_webserver(void)
{
    httpd_handle_t server = NULL;
    httpd_config_t config = HTTPD_DEFAULT_CONFIG();

    /* == Inicia o servidor HTTP == */
    if (httpd_start(&server, &config) == ESP_OK)
    {
        /* == Registra as URI responsaveis pelo estado da função led2on ou led2off == */
        httpd_register_uri_handler(server, &dado_uri);
    }
    return server;
}

void app_main(void)
{
    /* == Inicializando o NVS que armazena configurações do ESP32 == */
    esp_err_t ret = nvs_flash_init();
    if (ret == ESP_ERR_NVS_NO_FREE_PAGES || ret == ESP_ERR_NVS_NEW_VERSION_FOUND)
    {
        ESP_ERROR_CHECK(nvs_flash_erase());
        ret = nvs_flash_init();
    }
    ESP_ERROR_CHECK(ret);
    connect_wifi();
    start_webserver();
    ESP_LOGI(TAAG, "Servidor iniciado com sucesso!!!\n");
}