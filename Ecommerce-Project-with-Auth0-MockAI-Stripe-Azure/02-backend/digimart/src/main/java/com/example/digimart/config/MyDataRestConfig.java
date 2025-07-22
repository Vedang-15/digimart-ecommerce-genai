package com.example.digimart.config;

import com.example.digimart.entity.Country;
import com.example.digimart.entity.Product;
import com.example.digimart.entity.ProductCategory;
import com.example.digimart.entity.State;
import jakarta.persistence.EntityManager;
import jakarta.persistence.metamodel.EntityType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.RepositoryRestController;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.http.HttpMethod;
import org.springframework.web.servlet.config.annotation.CorsRegistry;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Configuration
public class MyDataRestConfig implements RepositoryRestConfigurer {

    private EntityManager entityManager;

    @Autowired
    public void MyDataRestConfig(EntityManager theEntityManager){  //constructor injection
        entityManager = theEntityManager;
    }

    @Override
    public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config, CorsRegistry cors) {

        // below code is written to prevent angular app from performing put, delete an post on database. It should be only able to read and display data provided by spring boot app.
        HttpMethod[] theUnsupportedActions = {HttpMethod.PUT, HttpMethod.POST, HttpMethod.DELETE, HttpMethod.PATCH};

        //disable HTTP methods for product : PUT, POST and DELETE
        disableHttpMethods(Product.class, config, theUnsupportedActions);

        //disable HTTP methods for productCategory : PUT, POST and DELETE
        disableHttpMethods(ProductCategory.class, config, theUnsupportedActions);

        //disable HTTP methods for Country : PUT, POST and DELETE
        disableHttpMethods(Country.class, config, theUnsupportedActions);

        //disable HTTP methods for State : PUT, POST and DELETE
        disableHttpMethods(State.class, config, theUnsupportedActions);


        // below code is written so that we are able to send/expose ids of productCategory class. Spring data REST, when it sends JSON data to browser(when browser visits https://localhost:8443/api/product-category), does not send id, it sends rest of the info. Ids are not sent.
        // This is default property of spring data rest. Similar is the case with product entity class. When browser visits https://localhost:8443/api/products, all products are snt in JSON format but the sent JSON data does not have id field. But in case of Product-category class,
        // we want to send ids as well(as they will be usd to dynamically create category links in menu component of angular app for searching products by category(angular routing concept)). Hence we writ the following cod that helps to send productCategory ids as well in sent JSON data.
        exposeIds(config);

    }

    private static void disableHttpMethods(Class theClass, RepositoryRestConfiguration config, HttpMethod[] theUnsupportedActions) {
        config.getExposureConfiguration()
                .forDomainType(theClass)
                .withItemExposure((metdata, httpMethods) -> httpMethods.disable(theUnsupportedActions))
                .withCollectionExposure((metdata, httpMethods) -> httpMethods.disable(theUnsupportedActions));
    }

    private void exposeIds(RepositoryRestConfiguration config) {

        //expose entity ids

        // - get a list of all entity classes from entity managr
        Set<EntityType<?>> entities = entityManager.getMetamodel().getEntities();

        // - create an array of thye ntity types
        List<Class> entityCloasses = new ArrayList<>();

        // - get the entity types for the entities
        for(EntityType tempEntityType : entities){
            entityCloasses.add(tempEntityType.getJavaType());
        }

        // - expose the entity ids
        Class[] domainTypes = entityCloasses.toArray(new Class[0]);
        config.exposeIdsFor(domainTypes);
    }
}
