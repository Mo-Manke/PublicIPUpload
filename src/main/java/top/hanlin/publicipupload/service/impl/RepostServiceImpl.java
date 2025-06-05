package top.hanlin.publicipupload.service.impl;

import top.hanlin.publicipupload.dao.RepostDao;
import top.hanlin.publicipupload.dao.impl.RepostDaoImpl;
import top.hanlin.publicipupload.service.RepostService;

public class RepostServiceImpl implements RepostService {
    RepostDao repostDao=new RepostDaoImpl();
    @Override
    public boolean login(String password) {
        String results=repostDao.getPassword();
        if(!(results == null ||results.isEmpty())){
            return password.equals(results);
        }
        return false;
    }
}
