package top.hanlin.publicipupload.service.impl;

import top.hanlin.publicipupload.dao.RepostDao;
import top.hanlin.publicipupload.dao.impl.RepostDaoImpl;
import top.hanlin.publicipupload.service.RepostService;

public class RepostServiceImpl implements RepostService {
    RepostDao repostDao=new RepostDaoImpl();
    @Override
    public boolean login(String password) {
        String results=repostDao.getPassword();
        System.out.println(results);
        System.out.println(!(results == null || results.isEmpty()));
        System.out.println("results"+results.length()+"password"+password.length()+password.equals(results));
        if(!(results == null ||results.isEmpty())){
            return password.equals(results);
        }
        return false;
    }
}
