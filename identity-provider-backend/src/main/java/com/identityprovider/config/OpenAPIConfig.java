package com.identityprovider.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import java.util.List;

@Configuration
public class OpenAPIConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Identity Provider API")
                        .version("1.0.0")
                        .description(
                                "API REST pour le fournisseur d'identité avec gestion de l'authentification et des cartes")
                        .contact(new Contact()
                                .name("Support")
                                .email("support@identityprovider.com")))
                .servers(List.of(
                        new Server().url("http://localhost:8080").description("Serveur local")));
    }
}
